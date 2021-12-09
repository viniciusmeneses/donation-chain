import { useCallback, useContext, useState } from 'react';

import { Web3Context } from './context';

import { addOrChangeNetwork } from './utils';

export const useWallet = () => {
	const { web3, account, setAccount } = useContext(Web3Context);
	const [connecting, setConnecting] = useState(false);

	const connect = useCallback(async () => {
		setConnecting(true);

		if (window.ethereum) {
			await window.ethereum.request({
				method: 'eth_requestAccounts',
			});
			await addOrChangeNetwork();
		}

		const [addr] = await web3.eth.getAccounts();
		setAccount(addr);
		setConnecting(false);
	}, []);

	const disconnect = useCallback(() => setAccount(null), [setAccount]);

	return { address: account, connect, connecting, disconnect };
};
