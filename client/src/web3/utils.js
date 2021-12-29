import networks from './config/networks.json';

import tokensByNetwork from './config/tokens.json';

export const network = networks[process.env.REACT_APP_NETWORK];

export const tokens = tokensByNetwork[process.env.REACT_APP_NETWORK];

export const addOrSwitchNetwork = async () => {
	try {
		await window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: network.chainId }],
		});
	} catch (e) {
		if (e.code === 4902) {
			await window.ethereum.request({
				method: 'wallet_addEthereumChain',
				params: [network],
			});
		} else {
			throw e;
		}
	}
};
