export const shortenAddress = address => {
	const [, start, end] = address.match(/^(\w{6}).+(\w{4})$/);
	return `${start}...${end}`;
};

export const removeHttpFromUrl = url =>
	url.replace(/^(https?:\/\/)?(www\.)?/, '');

export const causes = [
	{ label: 'Animais', color: 'orange' },
	{ label: 'Cultura', color: 'blue' },
	{ label: 'Educação', color: 'violet' },
	{ label: 'Meio Ambiente', color: 'green' },
	{ label: 'Saúde', color: 'red' },
	{ label: 'Justiça', color: 'lime' },
	{ label: 'Religião', color: 'yellow' },
	{ label: 'Pesquisa', color: 'cyan' },
];
