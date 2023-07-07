'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';
import { Modal } from 'flowbite-react';
import SlotCounter from 'react-slot-counter';
import ConfettiExplosion from 'react-confetti-explosion';

import logo from '../../public/assets/infinix-logo.png';
import trophy from '../../public/assets/trophy.png';

export default function Home() {
	const [winner, setWinner] = useState(null);
	const [value, setValue] = useState('');

	const [isExploding, setIsExploding] = useState(false);
	const [openModal, setOpenModal] = useState(false);

	const values = [
		{
			date: '2022/09/19 1:04:44 PM GMT+1',
			region: 'Lagos',
			city: 'ML4',
			customer: 'Mr Adamu',
			phone: '8181268400',
			ticket: 38480,
		},
		{
			date: '2022/09/19 1:04:44 PM GMT+1',
			region: 'Lagos',
			city: 'ML4',
			customer: 'Mr Oluwasegun',
			phone: '8181268400',
			ticket: 34401,
		},
		{
			date: '2022/09/19 1:04:44 PM GMT+1',
			region: 'Lagos',
			city: 'ML4',
			customer: 'Yetunde',
			phone: '8181268400',
			ticket: 33880,
		},
		{
			date: '2022/09/19 1:04:44 PM GMT+1',
			region: 'Lagos',
			city: 'ML4',
			customer: 'Mr Festus',
			phone: '8181268400',
			ticket: 33878,
		},
		{
			date: '2022/09/19 1:04:44 PM GMT+1',
			region: 'Lagos',
			city: 'ML4',
			customer: 'Juliet',
			phone: '8181268400',
			ticket: 34401,
		},
		{
			date: '2022/09/19 1:04:44 PM GMT+1',
			region: 'Lagos',
			city: 'ML4',
			customer: 'Abayomi Emiloju',
			phone: '8181268400',
			ticket: 37429,
		},
	];

	const ref = useRef(null);

	const handleSpin = () => {
		ref.current?.startAnimation();

		// Generate a random index
		const randomIndex = Math.floor(Math.random() * values.length);

		// Access the randomly selected value
		const randomWinner = values[randomIndex];
		const randomValue = randomWinner.ticket;

		setWinner(randomWinner);
		setValue(randomValue);

		setTimeout(() => {
			setOpenModal(true);
			setIsExploding(true);
		}, 2500);
	};

	return (
		<main className='h-screen w-screen flex flex-col items-center bg-gradient-to-br from-green-300 to-green-700 px-6 text-white'>
			{isExploding && (
				<ConfettiExplosion
					particleCount={350}
					duration={10000}
					zIndex={100}
					width={1000}
				/>
			)}

			<div className='flex w-full justify-between items-center'>
				<Image src={logo} width={100} alt='Infinix Logo' />

				<select
					id='cities'
					className='appearance-none bg-white border border-gray-300 text-black text-center text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 h-10 w-48'
				>
					<option selected>All Regions</option>
					<option value='abuja'>Abuja</option>
					<option value='lagos'>Lagos</option>
				</select>
			</div>

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

			{winner !== null && (
				<Modal
					show={openModal}
					size='lg'
					popup
					position='center'
					onClose={() => setOpenModal(false)}
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

								<p>Name: {winner.customer}</p>
								<p>Region: {winner.region}</p>
								<p>Phone: {winner.phone}</p>
							</div>
						</div>
					</Modal.Body>
				</Modal>
			)}
		</main>
	);
}
