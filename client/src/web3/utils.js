import NETWORKS from './config/networks.json';

import TOKENS_BY_NETWORK from './config/tokens.json';

export const NETWORK = NETWORKS[process.env.REACT_APP_NETWORK];

export const TOKENS = TOKENS_BY_NETWORK[process.env.REACT_APP_NETWORK];

export const addOrSwitchNetwork = async () => {
	try {
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: NETWORK.chainId }],
		});
	} catch (e) {
		if (e.code === 4902) {
			await window.ethereum.request({
				method: 'wallet_addEthereumChain',
				params: [NETWORK],
			});
		} else {
			throw e;
		}
	}
};
