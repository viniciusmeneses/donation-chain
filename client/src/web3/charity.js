import { useContext, useState, useEffect, useCallback } from 'react';

import { pick } from 'ramda';

import { Web3Context } from './context';

export const useCharities = () => {
	const { contract } = useContext(Web3Context);
	const [charities, setCharities] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetch = useCallback(async () => {
		const addresses = await contract.methods.allRecipients().call();
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
	}, [contract, setCharities]);

	useEffect(async () => {
		setLoading(true);
		await fetch();
		setLoading(false);
	}, []);

	return { charities, loading, reload: fetch };
};
