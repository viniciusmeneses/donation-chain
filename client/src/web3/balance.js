import { useContext, useEffect, useState } from 'react';

import { Web3Context } from './context';

import BEP20 from './contracts/IBEP20.json';

import tokens from './config/tokens.json';

export const useBalance = token => {
	const { web3, account } = useContext(Web3Context);

	const [balance, setBalance] = useState(0);
	const [loading, setLoading] = useState(false);

	useEffect(async () => {
		setLoading(true);

		if (token) {
			const tokenContract = new web3.eth.Contract(
				BEP20.abi,
				tokens[process.env.REACT_APP_NETWORK][token]
			);
			const balance = await tokenContract.methods.balanceOf(account).call();
			setBalance(web3.utils.fromWei(balance));
		} else {
			const balance = await web3.eth.getBalance(account);
			setBalance(web3.utils.fromWei(balance));
		}

		setLoading(false);
	}, []);

	return { balance, loading };
};
