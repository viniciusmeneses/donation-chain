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
			case 'Animals':
				return FaPaw;
			case 'Culture':
				return FaUsers;
			case 'Education':
				return FaBook;
			case 'Environment':
				return FaTree;
			case 'Healthcare':
				return FaHeart;
			case 'Justice':
				return FaBalanceScale;
			case 'Religion':
				return FaPray;
			case 'Research':
				return FaSearch;
			default:
				return null;
		}
	}, [label]);

	return <Component {...props} />;
};
