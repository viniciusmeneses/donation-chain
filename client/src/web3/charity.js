import { useContext, useState, useEffect, useCallback } from 'react';

import { pick } from 'ramda';

import { Web3Context } from './context';

import DonationChain from './contracts/DonationChain.json';

export const useCharities = () => {
	const { web3 } = useContext(Web3Context);
	const [charities, setCharities] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(async () => {
		setLoading(true);
		const chainId = await web3.eth.getChainId();

		const contract = new web3.eth.Contract(
			DonationChain.abi,
			DonationChain.networks[chainId].address
		);

		const addresses = await contract.methods.getRecipients().call();
		const charities = await Promise.all(
			addresses.map(addr =>
				contract.methods
					.charities(addr)
					.call()
					.then(charity => ({
						...charity,
						recipient: addr,
					}))
			)
		);

		setCharities(
			charities.map(
				pick([
					'recipient',
					'name',
					'description',
					'cause',
					'website',
					'donationCount',
				])
			)
		);
		setLoading(false);
	}, []);

	return { charities, loading };
};

export const useDonation = charity => {
	const { web3, account } = useContext(Web3Context);
	const [donating, setDonating] = useState(false);

	const donate = useCallback(async (amount, token) => {
		setDonating(true);

		const chainId = await web3.eth.getChainId();
		const contract = new web3.eth.Contract(
			DonationChain.abi,
			DonationChain.networks[chainId].address
		);

		const txHash = await window.ethereum.request({
			method: 'eth_sendTransaction',
			params: [
				{
					to: '0x7550fe4A38e294341Be6c08feD2cF26c7FAB18E0',
					from: account,
					data: contract.methods
						.donateToken(
							charity.recipient,
							'0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
							'1'
						)
						.encodeABI(),
				},
			],
		});

		console.log(txHash);
	}, []);

	return { donate, donating };
};
