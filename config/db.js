const mongoose = require('mongoose');

const connection = {};

const connectDB = async () => {
	if (connection.isConnected)
		return {
			message: 'MongoDB Connected',
			status: 200,
			connected: connection.isConnected,
		};

	try {
		const db = await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		connection.isConnected = db.connections[0].readyState;

		return {
			message: 'MongoDB Connected',
			status: 200,
			connected: connection.isConnected,
		};
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
};

module.exports = connectDB;
