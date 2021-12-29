import { useCallback, useContext, useState } from 'react';

import { identity } from 'ramda';

import { Web3Context } from './context';

import { addOrSwitchNetwork } from './utils';

export const useWallet = () => {
	const { web3, account, setAccount } = useContext(Web3Context);
	const [connecting, setConnecting] = useState(false);

	const connect = useCallback(
		async ({ onSuccess = identity, onError = identity }) => {
			setConnecting(true);

			const { ethereum } = window;

			try {
				if (ethereum) {
					const [addr] = await ethereum.request({
						method: 'eth_requestAccounts',
					});
					await addOrSwitchNetwork();
					setAccount(addr);
					web3.setProvider(ethereum);
					onSuccess({ account: addr });
				} else {
					throw new Error('MetaMask não está instalada');
				}
			} catch (e) {
				onError({
					message:
						e.code === 4001
							? 'Usuário rejeitou a conexão com a carteira'
							: e.message,
				});
			}

			setConnecting(false);
		},
		[setConnecting, setAccount, web3]
	);

	const disconnect = useCallback(() => setAccount(null), [setAccount]);

	return { address: account, connect, connecting, disconnect };
};
