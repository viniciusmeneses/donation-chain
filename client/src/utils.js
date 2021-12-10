export const shortenAddress = address => {
	const [, start, end] = address.match(/^(\w{6}).+(\w{4})$/);
	return `${start}...${end}`;
};

export const removeHttpFromUrl = url =>
	url.replace(/^(https?:\/\/)?(www\.)?/, '');

export const causes = {
	0: {
		label: 'Animals',
		color: 'orange',
	},
	1: {
		label: 'Culture',
		color: 'blue',
	},
	2: {
		label: 'Education',
		color: 'violet',
	},
	3: {
		label: 'Environment',
		color: 'green',
	},
	4: {
		label: 'Healthcare',
		color: 'red',
	},
	5: {
		label: 'Justice',
		color: 'gray',
	},
	6: {
		label: 'Religion',
		color: 'yellow',
	},
	7: {
		label: 'Research',
		color: 'cian',
	},
};
