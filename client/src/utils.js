export const shortenAddress = address => {
	const [, start, end] = address.match(/^(\w{6}).+(\w{4})$/);
	return `${start}...${end}`;
};

export const removeHttpFromUrl = url =>
	url.replace(/^(https?:\/\/)?(www\.)?/, '');

export const causes = [
	{ label: 'Animals', color: 'orange' },
	{ label: 'Culture', color: 'blue' },
	{ label: 'Education', color: 'violet' },
	{ label: 'Environment', color: 'green' },
	{ label: 'Healthcare', color: 'red' },
	{ label: 'Justice', color: 'lime' },
	{ label: 'Religion', color: 'yellow' },
	{ label: 'Research', color: 'cyan' },
];
