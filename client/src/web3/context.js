import { createContext, useCallback, useEffect } from 'react';

import Web3 from 'web3';

import { useLocalStorageValue } from '@mantine/hooks';

import DONATIONCHAIN from './contracts/DonationChain.json';

import { NETWORK, addOrSwitchNetwork } from './utils';

const web3 = new Web3(NETWORK.rpcUrls[0]);

const contract = new web3.eth.Contract(
	DONATIONCHAIN.abi,
	DONATIONCHAIN.networks[web3.utils.hexToNumber(NETWORK.chainId)].address
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
				if (chainId !== NETWORK.chainId) {
					setAccount(null);
					web3.setProvider(NETWORK.rpcUrls[0]);
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
