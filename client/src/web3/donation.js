import { useContext, useState, useEffect, useCallback, useMemo } from 'react';

import BigNumber from 'bignumber.js';

import {
	descend,
	filter,
	fromPairs,
	identity,
	pipe,
	prop,
	map,
	uniq,
	sort,
	take,
} from 'ramda';

import { TOKENS } from './utils';

import { Web3Context } from './context';

import BEP20 from './contracts/IBEP20.json';

const MAX_APPROVE_AMOUNT = BigNumber(2).pow(256).minus(1);

export const useApproval = token => {
	const { web3, account, contract } = useContext(Web3Context);
	const [approved, setApproved] = useState(false);

	const [approving, setApproving] = useState(false);
	const [loading, setLoading] = useState(false);

	const tokenContract = useMemo(
		() => new web3.eth.Contract(BEP20.abi, TOKENS[token].address),
		[token]
	);

	const approve = useCallback(
		({ onPending = identity, onSuccess = identity, onError = identity }) => {
			setApproving(true);

			tokenContract.methods
				.approve(contract.options.address, MAX_APPROVE_AMOUNT.toFixed())
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
						.donateToken(charity.recipient, TOKENS[token].address, weiAmount)
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

const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';

export const useDonations = ({ address }) => {
	const { web3, contract } = useContext(Web3Context);

	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(async () => {
		if (address) {
			setLoading(true);
			const donations = await contract.methods
				.addressDonations(address)
				.call()
				.then(pipe(sort(descend(prop('timestamp'))), take(10)));

			const tokens = fromPairs(
				await Promise.all(
					pipe(
						map(prop('token')),
						filter(tokenAddress => tokenAddress !== EMPTY_ADDRESS),
						uniq,
						map(async tokenAddress =>
							new web3.eth.Contract(BEP20.abi, tokenAddress).methods
								.symbol()
								.call()
								.then(symbol => [tokenAddress, symbol])
						)
					)(donations)
				)
			);

			const charities = fromPairs(
				await Promise.all(
					pipe(
						map(prop('recipient')),
						uniq,
						map(async recipient =>
							contract.methods
								.charities(recipient)
								.call()
								.then(charity => ({
									...charity,
									recipient,
								}))
								.then(charity => [recipient, charity])
						)
					)(donations)
				)
			);

			setHistory(
				donations.map(({ from, token, timestamp, amount, recipient }) => ({
					from,
					charity: charities[recipient],
					amount: BigNumber(web3.utils.fromWei(amount)),
					token: tokens[token] || null,
					date: new Date(timestamp * 1000),
				}))
			);

			setLoading(false);
		} else {
			setHistory([]);
		}
	}, [contract, setLoading, setHistory, address]);

	return { history, loading };
};
