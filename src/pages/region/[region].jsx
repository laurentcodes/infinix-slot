'use client';

import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { Modal } from 'flowbite-react';
import SlotCounter from 'react-slot-counter';
import ConfettiExplosion from 'react-confetti-explosion';

import { getRegionTickets } from '../api/services';

import logo from '../../../public/assets/infinix-logo.png';
import trophy from '../../../public/assets/trophy.png';

export default function RegionSpin() {
	const router = useRouter();

	const { region, type } = router.query;

	console.log(type);

	const [loading, setLoading] = useState(false);
	const [tickets, setTickets] = useState([]);
	const [value, setValue] = useState('');
	const [winner, setWinner] = useState(null);

	const [isExploding, setIsExploding] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		setLoading(true);

		getRegionTickets(region).then((res) => {
			setTickets(res.data);
			setLoading(false);
		});
	}, [region]);

	const ref = useRef(null);

	const handleSpin = () => {
		ref.current?.startAnimation();

		// Generate a random index
		const randomIndex = Math.floor(Math.random() * tickets.length);

		// Access the randomly selected value
		const randomWinner = tickets[randomIndex];
		const randomValue = randomWinner.ticketNo;

		setWinner(randomWinner);
		setValue(randomValue);

		setTimeout(() => {
			setOpenModal(true);
			setIsExploding(true);
		}, 2500);
	};

	if (loading) {
		return (
			<span className='flex w-screen h-screen items-center justify-center'>
				<span class='animate-ping absolute h-16 w-16 rounded-full bg-green-400'></span>
			</span>
		);
	}

	return (
		<main className='h-screen w-screen flex flex-col items-center bg-gradient-to-br from-green-300 to-green-700 px-6 text-white'>
			{isExploding && (
				<ConfettiExplosion particleCount={350} duration={10000} zIndex={100} />
			)}

			<Image
				src={logo}
				width={100}
				alt='Infinix Logo'
				className='cursor-pointer'
				onClick={() => router.back()}
			/>

			{tickets.length > 0 ? (
				<div className='flex flex-col md:flex-row justify-center items-center gap-6 w-full mt-44'>
					<div className='bg-green-900 w-full md:w-[50%] py-8 text-center text-5xl rounded-lg'>
						<SlotCounter
							ref={ref}
							startValue={'     '}
							value={value}
							animateUnchanged={true}
							useMonospaceWidth
							startValueOnce
							containerClassName='bg-green-300 w-full text-black'
							charClassName='mx-3 font-bold'
							separatorClassName='p-6'
						/>
					</div>

					<button
						type='button'
						className='bg-green-900 rounded-full w-24 h-24 uppercase font-bold hover:bg-green-700 ease-in duration-300'
						onClick={handleSpin}
					>
						Spin
					</button>
				</div>
			) : (
				<div className='w-full h-full flex flex-col justify-center items-center'>
					<p className='text-2xl uppercase font-bold'>No ticket available</p>
					<p
						className='text-blue-600 underline cursor-pointer font-bold'
						onClick={() => router.back()}
					>
						back
					</p>
				</div>
			)}

			{winner !== null && (
				<Modal
					show={openModal}
					size='lg'
					popup
					position='center'
					onClose={() => {
						setOpenModal(false);
						setIsExploding(false);
					}}
				>
					<Modal.Header className='bg-black rounded-t-lg' />
					<Modal.Body className='bg-black rounded-b-lg'>
						<div className='flex flex-col justify-center items-center text-white gap-6'>
							<p className='uppercase text-center text-2xl'>
								Winning Ticket:{' '}
								<span className='text-blue-500 block'>{value}</span>
							</p>

							<Image src={trophy} alt='Image of Trophy' width={150} />

							<div className='text-center flex flex-col gap-12 text-3xl'>
								<p className='uppercase text-center font-bold'>Winner</p>
								{type === 'norm' && <p>Store: {winner.city}</p>}

								{type !== 'norm' && winner.customer !== ' ' && (
									<p>Name: {winner.customer}</p>
								)}

								{type === 'norm' ? (
									<p>Region: {winner.region}</p>
								) : (
									<p>Store: {winner.region}</p>
								)}
								<p>Phone: {winner.phone}</p>
							</div>
						</div>
					</Modal.Body>
				</Modal>
			)}
		</main>
	);
}
