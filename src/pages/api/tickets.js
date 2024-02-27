const connectDB = require('../../../config/db');

import { CustomError } from './util/customError';

const Ticket = require('./models/Ticket');

// Connect database
connectDB();

export default async function handler(req, res) {
	const { method } = req;

	const { region, city, customer, phone, deviceBought, ticketNo } = req.body;

	const { regionName, deviceType } = req.query;

	if (method === 'GET') {
		// if (regionName && deviceType) {
		if (regionName) {
			try {
				let tickets = await Ticket.find({
					region: { $regex: regionName, $options: 'i' },
					// deviceBought: { $regex: deviceType, $options: 'i' },
				});

				const count = await Ticket.countDocuments({
					region: { $regex: regionName, $options: 'i' },
					// deviceBought: { $regex: deviceType, $options: 'i' },
				});

				res.status(200).json({ data: tickets, total: count });
			} catch (err) {
				res.status(500).send({
					message: err.message || 'Server Error',
					code: err.code || 500,
				});
			}
		} else {
			try {
				let tickets = await Ticket.find();
				const count = await Ticket.countDocuments();

				res.status(200).json({ data: tickets, total: count });
			} catch (err) {
				res.status(500).send({
					message: err.message || 'Server Error',
					code: err.code || 500,
				});
			}
		}
	} else if (method === 'POST') {
		try {
			let ticket = await Ticket.findOne({ ticketNo });

			// if (ticket) {
			// 	throw new CustomError('Error', 401, 'Ticket already exists');
			// }

			ticket = new Ticket({
				region,
				city,
				customer: customer || ' ',
				phone,
				deviceBought,
				ticketNo,
			});

			await ticket.save();

			res.status(201).json({
				data: { region, city, customer, phone, deviceBought, ticketNo },
				status: res.statusCode,
			});
		} catch (err) {
			res.status(500).send({
				message: err.message || 'Server Error',
				code: err.code || 500,
			});
		}
	}
	// else if (method === 'DELETE') {
	// 	let tickets = await Ticket.deleteMany({ date: { $lt: '2023-10-07' } });

	// 	console.log(tickets);

	// 	res.status(204).json({ data: tickets });
	// }
	else {
		res.status(405).send({ message: 'Invalid' });
	}
}
