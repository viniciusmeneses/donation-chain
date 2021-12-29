import { useCallback } from 'react';

import { FaCheck, FaTimes } from 'react-icons/fa';

import { useNotifications as useMtnNotifications } from '@mantine/notifications';

const defaultProps = {
	ERROR: {
		disallowClose: true,
		color: 'red',
		icon: <FaTimes />,
	},
	LOADING: {
		disallowClose: true,
		autoClose: false,
		color: 'yellow',
		loading: true,
	},
	SUCCESS: {
		disallowClose: true,
		color: 'green',
		icon: <FaCheck />,
	},
};

const useNotifications = () => {
	const { showNotification, updateNotification, ...notifications } =
		useMtnNotifications();

	const show = useCallback(
		({ type, ...props }) =>
			showNotification({ ...defaultProps[type], ...props }),
		[showNotification]
	);

	const update = useCallback(
		(id, { type, ...props }) =>
			updateNotification(id, { ...defaultProps[type], ...props }),
		[updateNotification]
	);

	return { show, update, ...notifications };
};

export default useNotifications;
