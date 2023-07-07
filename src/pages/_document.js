import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang='en'>
			<Head>
				<title>Infinix Slot</title>
				<link
					rel='stylesheet'
					href='https://unpkg.com/flowbite@1.3.3/dist/flowbite.min.css'
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
