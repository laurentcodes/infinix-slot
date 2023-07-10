import { useRouter } from 'next/router';
import { useState } from 'react';
import { TextInput, Select } from 'flowbite-react';
import { z } from 'zod';
import { toast } from 'react-toastify';

import { regions, lagRegions } from '../../../data/regions';

import { addTicket } from '../api/services';

const NewTicket = () => {
	const router = useRouter();

	const [customer, setCustomer] = useState('');
	const [region, setRegion] = useState('');
	const [city, setCity] = useState('');
	const [phone, setPhone] = useState('');
	const [ticketNo, setTicketNo] = useState('');
	const [errors, setErrors] = useState([]);

	const Ticket = z.object({
		customer: z.string().nonempty({ message: 'Enter customer name' }),
		region: z.string().nonempty({ message: 'Select region' }),
		// city: z.string().nonempty({ message: 'Enter city' }),
		phone: z
			.string({ message: 'Invalid phone number' })
			.min(10, { message: 'Invalid phone number' })
			.max(11, { message: 'Invalid phone number' }),
		ticketNo: z.number().positive({ message: 'Enter Ticket No.' }),
	});

	const handleSubmit = (e) => {
		e.preventDefault();

		const data = { customer, region, city, phone, ticketNo };

		try {
			Ticket.parse({ customer, region, phone, ticketNo });
		} catch (err) {
			if (err instanceof z.ZodError) {
				setErrors(err.issues);
			}
		}

		addTicket(data)
			.then((res) => {
				if (res.status === 201) {
					toast('Ticket added Successfully', {
						autoClose: 2000,
						type: 'success',
					});
				}
			})
			.catch((err) => {
				toast(err.response.data.message, {
					autoClose: 2000,
					type: 'error',
				});
			});
	};

	return (
		<div className='h-screen w-screen bg-green-700 p-6 flex flex-col justify-center items-center'>
			<form className='bg-green-300 rounded-2xl p-6 w-full md:w-[400px]'>
				<h2 className='text-center uppercase font-bold mb-6 text-white'>
					Add New Ticket
				</h2>

				<TextInput
					className='mb-2'
					id='customer'
					placeholder='Customer Name'
					required
					type='text'
					value={customer}
					onChange={(e) => setCustomer(e.target.value)}
				/>

				<Select
					className='mb-2'
					id='region'
					required
					onChange={(e) => setRegion(e.target.value)}
				>
					<option>Select Region</option>
					{regions.concat(lagRegions).map((region) => (
						<option key={region.name} value={region.name}>
							{region.name}
						</option>
					))}
				</Select>

				<TextInput
					className='mb-2'
					id='city'
					placeholder='City'
					required
					type='text'
					value={city}
					onChange={(e) => setCity(e.target.value)}
				/>

				<TextInput
					className='mb-2'
					id='phone'
					placeholder='Phone'
					required
					type='text'
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
				/>

				<TextInput
					className='mb-2'
					id='ticket'
					placeholder='Ticket No.'
					required
					type='number'
					value={ticketNo}
					onChange={(e) => setTicketNo(Number(e.target.value))}
				/>

				<p>
					{errors.length > 0 &&
						errors.map((error) => (
							<span className='text-red-500 block' key={error.path[0]}>
								{error.message}
							</span>
						))}
				</p>

				<button
					className='p-2 mt-3 bg-white rounded-lg w-full text-green-400 uppercase font-bold'
					onClick={handleSubmit}
				>
					Add Ticket
				</button>
			</form>
		</div>
	);
};

export default NewTicket;
