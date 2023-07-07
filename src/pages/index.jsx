import { useState } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
	const router = useRouter();

	// const [regions, setRegions] = useState([]);

	const regions = [
		{
			name: 'Abuja',
			initial: 'Ab',
		},
		{
			name: 'Lagos',
			initial: 'La',
		},
		{
			name: 'Ibadan',
			initial: 'Ib',
		},
		{
			name: 'Onitsha',
			initial: 'On',
		},
	];

	return (
		<div className='h-screen w-screen bg-green-700 p-6'>
			<h3 className='text-3xl uppercase text-white mb-12'>Regions</h3>

			{regions.length > 0 && (
				<div className='flex justify-center md:justify-start md:px-12 gap-4 flex-wrap'>
					{regions.map((region) => (
						<div
							key={region.initial}
							className='bg-green-300 p-3 w-24 flex flex-col gap-3 justify-center items-center rounded-md cursor-pointer'
							onClick={() => router.push(`/${region.name.toLowerCase()}`)}
						>
							<p className='p-3 bg-black text-white rounded uppercase w-[65%] text-center'>
								{region.initial}
							</p>
							<p>{region.name}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Home;
