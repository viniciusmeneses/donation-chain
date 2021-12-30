import {
	FaBalanceScale,
	FaBook,
	FaHeart,
	FaPaw,
	FaPray,
	FaSearch,
	FaUsers,
	FaTree,
} from 'react-icons/fa';

export const CAUSES = [
	{ label: 'Animais', name: 'animals', color: 'orange', Icon: FaPaw },
	{ label: 'Cultura', name: 'culture', color: 'blue', Icon: FaUsers },
	{ label: 'Educação', name: 'education', color: 'violet', Icon: FaBook },
	{ label: 'Meio Ambiente', name: 'environment', color: 'green', Icon: FaTree },
	{ label: 'Saúde', name: 'healthcare', color: 'red', Icon: FaHeart },
	{ label: 'Justiça', name: 'justice', color: 'lime', Icon: FaBalanceScale },
	{ label: 'Religião', name: 'religion', color: 'yellow', Icon: FaPray },
	{ label: 'Pesquisa', name: 'research', color: 'cyan', Icon: FaSearch },
];

export const shortenAddress = address => {
	const [, start, end] = address.match(/^(\w{6}).+(\w{4})$/);
	return `${start}...${end}`;
};

export const removeHttpFromUrl = url =>
	url.replace(/^(https?:\/\/)?(www\.)?/, '');

export const formatDateTime = (date, options = { date: 'short' }) =>
	new Intl.DateTimeFormat('pt-BR', {
		dateStyle: options.date,
		timeStyle: options.time,
	}).format(date);
