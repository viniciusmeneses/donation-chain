export const shortenAddress = address => {
	const [, start, end] = address.match(/^(\w{6}).+(\w{4})$/);
	return `${start}...${end}`;
};
