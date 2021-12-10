import { createContext, useCallback, useEffect } from 'react';

import Web3 from 'web3';

import { identity } from 'ramda';

import { useLocalStorageValue } from '@mantine/hooks';

import { network, addOrChangeNetwork } from './utils';

const web3 = new Web3(network.rpcUrls[0]);

export const Web3Context = createContext({});

export const Web3Provider = props => {
	const [account, setAccountStorage] = useLocalStorageValue({
		key: '@DonationChain/account',
	});

	const setAccount = useCallback(
		account => setAccountStorage(account || ''),
		[setAccountStorage]
	);

	useEffect(async () => {
		const { ethereum } = window;

		if (ethereum) {
			ethereum.on('accountsChanged', ([account]) => setAccount(account));
			ethereum.on('chainChanged', chainId =>
				setAccount(chainId === network.chainId ? identity : null)
			);

			if (account) {
				const [addr] = await ethereum.request({ method: 'eth_accounts' });
				if (addr) await addOrChangeNetwork();
				setAccount(addr);
			}
		} else {
			setAccount(null);
		}
	}, []);

	return (
		<Web3Context.Provider {...props} value={{ web3, account, setAccount }} />
	);
};
