import { useState, useCallback } from 'react';

const useModalState = (initialOpened = false) => {
	const [opened, setOpened] = useState(initialOpened);

	const open = useCallback(() => setOpened(true));
	const close = useCallback(() => setOpened(false));

	return { opened, open, close };
};

export const bindModal = state => ({
	opened: state.opened,
	onClose: state.close,
});

export const bindTrigger = state => ({ onClick: state.open });

export default useModalState;
