import networks from './config/networks.json';

export const network = networks[process.env.REACT_APP_NETWORK];

export const addOrChangeNetwork = () =>
	window.ethereum.request({
		method: 'wallet_addEthereumChain',
		params: [network],
	});
