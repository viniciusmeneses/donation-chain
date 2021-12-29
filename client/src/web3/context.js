import { createContext, useCallback, useEffect } from 'react';

import Web3 from 'web3';

import { useLocalStorageValue } from '@mantine/hooks';

import DonationChain from './contracts/DonationChain.json';

import { network, addOrSwitchNetwork } from './utils';

const web3 = new Web3(network.rpcUrls[0]);

const contract = new web3.eth.Contract(
	DonationChain.abi,
	DonationChain.networks[web3.utils.hexToNumber(network.chainId)].address
);

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
			ethereum.on('chainChanged', chainId => {
				if (chainId !== network.chainId) {
					setAccount(null);
					web3.setProvider(network.rpcUrls[0]);
				}
			});

			if (account) {
				const [addr] = await ethereum.request({ method: 'eth_accounts' });
				try {
					if (addr) await addOrSwitchNetwork();
					setAccount(addr);
					web3.setProvider(window.ethereum);
				} catch (e) {
					setAccount(null);
				}
			}
		} else {
			setAccount(null);
		}
	}, []);

	return (
		<Web3Context.Provider
			{...props}
			value={{ web3, contract, account, setAccount }}
		/>
	);
};
