import { useRouter } from 'next/router';

import { regions, KARegions } from '../../data/regions';

import { addTicket } from './api/services';

import { dup } from '../../data/data';

const Home = () => {
	const router = useRouter();

	const formattedData = dup.map((reg) => {
		return {
			region: reg.KA,
			city: reg.Region,
			customer: reg['Customer Name'],
			phone: reg['Customer Phone Number'],
			ticketNo: reg['Ticket Number'],
		};
	});

	const runAdd = () => {
		for (let i = 0; i < formattedData.length; i++) {
			const element = formattedData[i];

			// console.log(element);

			addTicket(element).then((res) => console.log(res));
		}
	};

	return (
		<div className='h-full md:h-screen w-screen bg-green-700 p-6'>
			<div>
				<h3 className='text-3xl uppercase text-white mb-6'>All Regions</h3>

				{/* <button className='bg-green-300 p-3 m-3' onClick={runAdd}>
					ADD
				</button> */}

				{regions.length > 0 && (
					<div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
						{regions.map((region) => (
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
			</div>

			<div className='mt-12'>
				<h3 className='text-3xl uppercase text-white mb-6'>Key Account</h3>

				{KARegions.length > 0 && (
					<div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
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
			</div>
		</div>
	);
};

export default Home;
