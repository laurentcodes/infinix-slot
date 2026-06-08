---
name: raffle-draw-import
description: Use when the user provides a new raffle draw Excel file (e.g. "Sallah Grand Prize Raffle Draw.xlsx") and wants it converted and wired into the app for validation before pushing to the db. Covers converting xlsx to JSON, adding it to data/data.js, building the formattedData mapping in index.jsx, handling single- or multi-region files, and updating data/regions.js + the home page tiles.
---

# Raffle draw import

End-to-end workflow for taking a new draw's Excel export and getting it ready
to validate and push to the db through the app's existing "Add New" flow.

## Overview of the flow

1. Convert the `.xlsx` file to JSON.
2. Add it as a new exported const in `data/data.js`.
3. In `src/pages/index.jsx`, write a `formattedData` mapping from the raw
   sheet columns to the db shape: `region`, `city`, `customer`, `phone`,
   `deviceBought`, `ticketNo`.
4. Wire up `regions.js` and the home page tiles so the right regions for
   *this* draw are shown (not last draw's).
5. Leave `addTicket` calls commented out — the user validates by clicking
   "Add New" and reading the console output before pushing to the db
   themselves.

## Step 1 — convert xlsx to JSON

There is no xlsx parsing library in this project (the user normally uses an
online converter by hand). Since `.xlsx` is just a zip of XML, parse it
directly with Python (no extra deps needed). This is fine for the user's own
local exports, but `xml.etree.ElementTree` is XXE-vulnerable on untrusted
input — if the source file ever comes from outside the user, parse with
`defusedxml.ElementTree` instead:

```python
import zipfile, xml.etree.ElementTree as ET, re

z = zipfile.ZipFile('<file>.xlsx')
ns = {'main': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

ss_root = ET.fromstring(z.read('xl/sharedStrings.xml'))
shared = [''.join(t.text or '' for t in si.findall('.//main:t', ns))
          for si in ss_root.findall('main:si', ns)]

sheet_root = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
rows = sheet_root.find('main:sheetData', ns).findall('main:row', ns)

def col_index(ref):
    letters = re.match(r'([A-Z]+)', ref).group(1)
    idx = 0
    for ch in letters:
        idx = idx * 26 + (ord(ch) - ord('A') + 1)
    return idx - 1

def cell_value(c):
    v = c.find('main:v', ns)
    if v is None:
        return ''
    return shared[int(v.text)] if c.get('t') == 's' else v.text

headers = {col_index(c.get('r')): cell_value(c) for c in rows[0].findall('main:c', ns)}
data = []
for r in rows[1:]:
    row = {headers[col_index(c.get('r'))]: cell_value(c)
           for c in r.findall('main:c', ns) if col_index(c.get('r')) in headers}
    data.append(row)
```

Things to check on the raw data before converting:

- **Multiple regions in one sheet**: look at whether there's a region/state
  column with more than one distinct value (e.g. `'Your Region'` containing
  `'A.Abuja'`, `'B.Ibadan'`, `'G.PHC'`, ...). If so this is a multi-region
  draw — see "Handling multi-region files" below.
- **Rows with missing/blank region**: ask the user how to handle them
  (drop / best-guess by address / leave blank for manual fix). Don't assume.
- **Embedded newlines/tabs in cell values**: some cells contain raw `\n`
  (e.g. a store name split across two lines). These MUST be collapsed to
  spaces (`re.sub(r'[\r\n\t]+', ' ', s)`) before emitting JS string literals,
  otherwise you get an "Unterminated string constant" build error.
- **Apostrophes in values**: e.g. `Oloya's compound`. When emitting the JS,
  use double quotes for strings containing `'` (and no `"`), single quotes
  otherwise — matching the existing mixed-quote style in `data/data.js`
  (e.g. `"CUSTOMER'SNAME"`).

## Step 2 — add to data/data.js

`data/data.js` is one big file of `export const <name> = [ ... ]` arrays (raw
row objects, keys exactly as they appeared in the sheet, tab-indented, mixed
single/double-quoted strings). Append the new const at the end of the file
with a short uppercase comment header, e.g.:

```js
// SALLAH GRAND PRIZE RAFFLE DRAW
export const sallah = [
	{
		'Your Name': 'Favor ',
		'Your mobile number': '09122726347',
		...
	},
	...
];
```

Name the const after the draw (lowercase, e.g. `sallah`), not the region —
multi-region files hold everything in one const and get split by the
`formattedData` mapping instead.

After writing the file, sanity-check it parses (no real xlsx parser is
available, so a quick syntax check is worth doing):

```bash
node -e "
const fs = require('fs');
const src = fs.readFileSync('data/data.js', 'utf8');
new Function(src.replace(/export const/g, 'const'));
console.log('syntax OK');
"
```

## Step 3 — formattedData mapping in index.jsx

The db schema (see `src/pages/api/models/Ticket.js`) wants:
`region`, `city`, `customer`, `phone`, `deviceBought`, `ticketNo`.

Map the raw sheet columns onto these — column names vary draw to draw, so
read the actual headers from the converted JSON rather than assuming. As a
guide from past draws:

- `customer` ← the entrant's name column
- `phone` ← the entrant's phone number column
- `city` ← the entrant's address column (NOT the store's address — recent
  draws standardized on the customer's own address here)
- `deviceBought` ← the device/prize selection column
- `ticketNo` ← the IMEI / ticket number column
- `region` ← see below

```js
const formattedData = sallah.map((reg) => {
	return {
		region: reg['Your Region'],
		city: reg['Your Address'],
		customer: reg['Your Name'],
		phone: reg['Your mobile number'],
		deviceBought: reg['Name of Device Purchased'],
		ticketNo: reg['Your Phone IMEI'],
	};
});
```

### Handling multi-region files

If the sheet's region column has prefixes for sort order (e.g. `'A.Abuja'`,
`'G.PHC'`), strip the prefix and map to the canonical region names used
elsewhere in the app (`data/regions.js`, the `[region].jsx` regex match is
case-insensitive substring, so canonical casing like `'Abuja'`, `'Port
Harcourt'` is what to store):

```js
const regionNames = {
	abuja: 'Abuja',
	ibadan: 'Ibadan',
	kano: 'Kano',
	kaduna: 'Kaduna',
	lagos: 'Lagos',
	onitsha: 'Onitsha',
	phc: 'Port Harcourt', // PHC -> Port Harcourt
};

const formattedData = sallah.map((reg) => {
	const cleanedRegion = reg['Your Region']
		.replace(/^[A-Z]\.\s*/, '')
		.trim()
		.toLowerCase();

	return {
		region: regionNames[cleanedRegion] || reg['Your Region'],
		...
	};
});
```

Place the `regionNames` map outside the component (it's static).

## Step 4 — wire up regions.js and the home page

`data/regions.js` exports `regions` (and `KARegions`, unrelated to draws —
leave that alone). Comment/uncomment entries so only the regions that
actually appear in *this* draw's data are active — don't leave stale regions
from the last draw enabled, and don't enable regions this draw doesn't have.
`'All Regions'` stays enabled when the draw should also support spinning
across every region at once.

In `src/pages/index.jsx`, render tiles from the `regions` array (re-enable
the commented-out block if it's currently using a single hardcoded "All"
tile from the previous draw). Special-case `'All Regions'` to push
`region: 'all'` (matches the `region === 'all'` branch in `[region].jsx`
that calls `getTickets()` instead of `getRegionTickets()`):

```jsx
onClick={() =>
	router.push({
		pathname: '/tickets/[region]',
		query: {
			region: region.name === 'All Regions' ? 'all' : region.name.toLowerCase(),
			type: 'norm',
		},
	})
}
```

## Step 5 — validation workflow (don't push automatically)

Re-enable `formattedData`, the `runAdd` function and the "Add New" button,
but keep the `addTicket(...)` call inside `runAdd` commented out:

```js
const runAdd = () => {
	console.log(formattedData.length);

	let done = 0;

	for (let i = 0; i < formattedData.length; i++) {
		const element = formattedData[i];

		console.log(element);

		// addTicket(element).then((res) => {
		// 	done++;
		// 	console.log(res);
		// 	console.log(`${done} of ${formattedData.length} done`);
		// });
	}
};
```

The user clicks "Add New" in their running dev server and reviews the
console output themselves before deciding to uncomment `addTicket` and push
to the db. **Never run the dev server yourself or call `addTicket` for
them** — this is their manual validation/push step.

## Gotchas learned from past imports

- Don't run `npm run dev` / spin up a server — the user keeps one running
  and will validate in their own browser.
- Flag (and ask about, don't guess) any rows with missing/ambiguous data
  (e.g. blank region) rather than silently dropping or guessing.
- Preserve raw string values as-is (including trailing spaces) — that's the
  existing convention in `data/data.js`, don't "clean up" beyond what's
  needed to produce valid JS (newline collapsing, quote escaping).
