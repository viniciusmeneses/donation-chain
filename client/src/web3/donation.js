import { useContext, useState, useEffect, useCallback, useMemo } from 'react';

import BigNumber from 'bignumber.js';

import { identity } from 'ramda';

import { tokens } from './utils';

import { Web3Context } from './context';

import BEP20 from './contracts/IBEP20.json';

const maxApproveAmount = BigNumber(2).pow(256).minus(1);

export const useApproval = token => {
	const { web3, account, contract } = useContext(Web3Context);
	const [approved, setApproved] = useState(false);

	const [approving, setApproving] = useState(false);
	const [loading, setLoading] = useState(false);

	const tokenContract = useMemo(
		() => new web3.eth.Contract(BEP20.abi, tokens[token].address),
		[token]
	);

	const approve = useCallback(
		({ onPending = identity, onSuccess = identity, onError = identity }) => {
			setApproving(true);

			tokenContract.methods
				.approve(contract.options.address, maxApproveAmount.toFixed())
				.send({ from: account })
				.on('transactionHash', transactionHash =>
					onPending({ transactionHash })
				)
				.on('receipt', receipt => {
					onSuccess(receipt);
					setApproving(false);
					setApproved(true);
				})
				.on('error', error => {
					onError(error);
					setApproving(false);
				});
		},
		[tokenContract, contract, account, setApproving, setApproved]
	);

	useEffect(async () => {
		if (account) {
			setLoading(true);

			const allowedAmount = await tokenContract.methods
				.allowance(account, contract.options.address)
				.call();

			setApproved(
				BigNumber(web3.utils.fromWei(allowedAmount)).isGreaterThan(0)
			);
			setLoading(false);
		}
	}, [contract, account, web3, setLoading, setApproved, tokenContract]);

	return { approved, approve, approving, loading };
};

export const useDonation = charity => {
	const { web3, account, contract } = useContext(Web3Context);
	const [donating, setDonating] = useState(false);

	const donate = useCallback(
		({
			token,
			amount,
			onPending = identity,
			onSuccess = identity,
			onError = identity,
		}) => {
			setDonating(true);
			const weiAmount = web3.utils.toWei(amount.toFixed());

			const transaction = token
				? contract.methods
						.donateToken(charity.recipient, tokens[token].address, weiAmount)
						.send({ from: account })
				: contract.methods
						.donate(charity.recipient)
						.send({ from: account, value: weiAmount });

			transaction
				.on('transactionHash', transactionHash =>
					onPending({ transactionHash })
				)
				.on('receipt', receipt => {
					onSuccess(receipt);
					setDonating(false);
				})
				.on('error', error => {
					onError(error);
					setDonating(false);
				});
		},
		[contract, web3, setDonating, account, charity]
	);

	return { donate, donating };
};
