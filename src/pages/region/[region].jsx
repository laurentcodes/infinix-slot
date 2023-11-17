'use client';

import Image from 'next/image';
import { useRouter } from 'next/router';

import logo from '../../../public/assets/infinix-logo.png';

const devices = [
	{ name: 'ZERO SERIES', key: 'zero' },
	{ name: 'NOTE SERIES', key: 'note' },
	{ name: 'HOT SERIES', key: 'hot' },
	{ name: 'SMART SERIES', key: 'smart' },
];

export default function RegionSpin() {
	const router = useRouter();

	const { region } = router.query;

	return (
		<main className='h-screen w-screen flex flex-col justify-around items-center bg-gradient-to-br from-green-300 to-green-700 px-6 text-white'>
			<Image
				src={logo}
				width={100}
				alt='Infinix Logo'
				className='cursor-pointer'
				onClick={() => router.push('/')}
			/>

			<h3 className='my-5 text-3xl font-bold'>{region?.toUpperCase() || ''}</h3>

			<div className='flex flex-col md:flex-row justify-center items-center h-full'>
				{devices.map((device) => (
					<div
						key={device.key}
						className='bg-green-700 py-4 px-5 m-3 rounded-2xl cursor-pointer w-full md:w-48 text-center'
						onClick={() =>
							router.push({
								pathname: '/tickets/[region]',
								query: {
									region: region,
									type: 'norm',
									device: device.key,
								},
							})
						}
					>
						{device.name}
					</div>
				))}
			</div>
		</main>
	);
}
