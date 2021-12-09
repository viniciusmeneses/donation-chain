import { createContext, useState, useContext, useEffect } from 'react';

import Web3 from 'web3';

import { identity } from 'ramda';

import { network, addOrChangeNetwork } from './utils';

export const Web3Context = createContext(new Web3());

export const Web3Provider = props => {
	const web3 = useContext(Web3Context);
	const [account, setAccount] = useState();

	useEffect(async () => {
		const { ethereum } = window;

		if (ethereum) {
			web3.setProvider(ethereum);
			ethereum.on('accountsChanged', ([account]) => setAccount(account));
			ethereum.on('chainChanged', chainId =>
				setAccount(chainId === network.chainId ? identity : null)
			);
		} else if (window.web3) {
			web3.setProvider(window.web3.currentProvider);
		} else {
			web3.setProvider(
				new Web3.providers.HttpProvider('http://127.0.0.1:8545')
			);
		}

		const [addr] = await web3.eth.getAccounts();
		if (ethereum && addr) await addOrChangeNetwork();
		setAccount(addr);
	}, []);

	return (
		<Web3Context.Provider {...props} value={{ web3, account, setAccount }} />
	);
};
