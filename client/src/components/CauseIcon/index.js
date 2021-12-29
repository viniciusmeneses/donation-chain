import { useMemo } from 'react';

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

export const CauseIcon = ({ label, ...props }) => {
	const Component = useMemo(() => {
		switch (label) {
			case 'Animais':
				return FaPaw;
			case 'Cultura':
				return FaUsers;
			case 'Educação':
				return FaBook;
			case 'Meio Ambiente':
				return FaTree;
			case 'Saúde':
				return FaHeart;
			case 'Justiça':
				return FaBalanceScale;
			case 'Religião':
				return FaPray;
			case 'Pesquisa':
				return FaSearch;
			default:
				return null;
		}
	}, [label]);

	return <Component {...props} />;
};
