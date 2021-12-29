import { useCallback, useContext, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';

import { Web3Context } from './context';

import { tokens } from './utils';

import BEP20 from './contracts/IBEP20.json';

export const useBalance = token => {
	const { web3, account } = useContext(Web3Context);

	const [balance, setBalanceState] = useState(BigNumber(0));
	const [loading, setLoading] = useState(false);

	const setBalance = useCallback(
		balance => setBalanceState(BigNumber(web3.utils.fromWei(balance))),
		[setBalanceState]
	);

	useEffect(async () => {
		if (account) {
			setLoading(true);

			if (token) {
				const tokenContract = new web3.eth.Contract(
					BEP20.abi,
					tokens[token].address
				);
				setBalance(await tokenContract.methods.balanceOf(account).call());
			} else {
				setBalance(await web3.eth.getBalance(account));
			}

			setLoading(false);
		} else {
			setBalanceState(BigNumber(0));
		}
	}, [account, setLoading, token, web3, setBalance, setBalanceState]);

	return { balance, loading };
};
