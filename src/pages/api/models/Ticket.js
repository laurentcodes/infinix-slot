const mongoose = require('mongoose');

const TicketSchema = mongoose.Schema({
	region: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: false,
	},
	customer: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	deviceBought: {
		type: String,
	},
	ticketNo: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
});

module.exports =
	mongoose.models.ticket || mongoose.model('ticket', TicketSchema);
