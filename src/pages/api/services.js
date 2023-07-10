import axios from 'axios';

// TICKETS
export const getTickets = async () => {
	const { data } = await axios.get('/api/tickets');

	return data;
};

export const getRegionTickets = async (region) => {
	const { data } = await axios.get(`/api/tickets?regionName=${region}`);

	return data;
};

export const addTicket = async (value) => {
	const { data } = await axios.post('/api/tickets', value);

	return data;
};
