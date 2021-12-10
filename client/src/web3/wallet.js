import { useCallback, useContext, useState } from 'react';

import { useNotifications } from '@mantine/notifications';

import { FaTimes } from 'react-icons/fa';

import { Web3Context } from './context';

import { addOrChangeNetwork } from './utils';

export const useWallet = () => {
	const { account, setAccount } = useContext(Web3Context);
	const [connecting, setConnecting] = useState(false);

	const notifications = useNotifications();

	const connect = useCallback(async () => {
		setConnecting(true);

		const { ethereum } = window;

		try {
			if (ethereum) {
				const [addr] = await ethereum.request({
					method: 'eth_requestAccounts',
				});
				await addOrChangeNetwork();
				setAccount(addr);
			} else {
				throw new Error('MetaMask not installed');
			}
		} catch (e) {
			notifications.showNotification({
				disallowClose: true,
				title: 'Failed to connect wallet',
				message: e.code === 4001 ? 'User rejected connection' : e.message,
				color: 'red',
				icon: <FaTimes />,
			});
		}

		setConnecting(false);
	}, []);

	const disconnect = useCallback(() => setAccount(null), [setAccount]);

	return { address: account, connect, connecting, disconnect };
};
