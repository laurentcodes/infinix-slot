import { useRouter } from 'next/router';

import { regions } from '../../data/regions';
import { addTicket } from './api/services';

// import { sallahConsolation } from '../../data/data';

// the sheet prefixes regions with a letter for sorting (e.g. "A.Abuja"), so strip
// that off and map the cleaned name to the region names used across the app
// const regionNames = {
//   abuja: 'Abuja',
//   ibadan: 'Ibadan',
//   kano: 'Kano',
//   kaduna: 'Kaduna',
//   lagos: 'Lagos',
//   onitsha: 'Onitsha',
//   phc: 'Port Harcourt',
// };

const Home = () => {
  const router = useRouter();

  // const formattedData = sallahConsolation.map((reg) => {
  //   const cleanedRegion = reg['Your Region']
  //     .replace(/^[A-Z]\.\s*/, '')
  //     .trim()
  //     .toLowerCase();

  //   return {
  //     region: regionNames[cleanedRegion] || reg['Your Region'],
  //     city: reg['Your Address'],
  //     customer: reg['Your Name'],
  //     phone: reg['Your mobile number'],
  //     deviceBought: reg['Name of Device Purchased'],
  //     ticketNo: reg['Your Phone IMEI'],
  //   };
  // });

  const runAdd = () => {
    console.log(formattedData.length);

    let done = 0;

    for (let i = 0; i < formattedData.length; i++) {
      const element = formattedData[i];

      // console.log(element);

      addTicket(element).then((res) => {
        done++;
        console.log(res);

        console.log(`${done} of ${formattedData.length} done`);
      });
    }
  };

  return (
    <div className='h-screen w-screen bg-green-700 p-6'>
      <div>
        <h3 className='text-3xl uppercase text-white mb-6'>
          All Regions
        </h3>

        {/* <button className='p-3 bg-white my-3 rounded-md' onClick={runAdd}>
          Add New
        </button>*/}

        {regions.length > 0 && (
          <div className='grid grid-cols-2 md:grid-cols-6 gap-4 uppercase'>
            {regions
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((region) => (
                <div
                  key={region.initial}
                  className='bg-green-300 p-3 basis-1/2 md:basis-1/4 flex flex-col gap-3 justify-center items-center rounded-md cursor-pointer'
                  onClick={() =>
                    router.push({
                      pathname: '/tickets/[region]',
                      query: {
                        region:
                          region.name === 'All Regions'
                            ? 'all'
                            : region.name.toLowerCase(),
                        type: 'norm',
                      },
                    })
                  }
                >
                  <p className='p-3 bg-black text-white rounded uppercase w-[65%] md:w-[50%] text-center'>
                    {region.initial}
                  </p>
                  <p>{region.name}</p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* <div className='mt-12'>
				<h3 className='text-3xl uppercase text-white mb-6'>Key Account</h3>

				{KARegions.length > 0 && (
					<div className='grid grid-cols-2 md:grid-cols-6 gap-4 uppercase'>
						{KARegions.map((region) => (
							<div
								key={region.initial}
								className='bg-green-300 p-3 basis-1/2 md:basis-1/4 flex flex-col gap-3 justify-center items-center rounded-md cursor-pointer'
								onClick={() =>
									router.push(`/region/${region.name.toLowerCase()}`)
								}
							>
								<p className='p-3 bg-black text-white rounded uppercase w-[65%] md:w-[50%] text-center'>
									{region.initial}
								</p>
								<p>{region.name}</p>
							</div>
						))}
					</div>
				)}
			</div> */}
    </div>
  );
};

export default Home;
