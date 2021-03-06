import { useCallback, useEffect } from 'react';

import {
	Button,
	Container,
	Image,
	Header as MtnHeader,
	Modal,
	createStyles,
} from '@mantine/core';

import { IoLink, IoWalletOutline } from 'react-icons/io5';

import { Wallet } from '../Wallet';

import useModalState, { bindModal, bindTrigger } from '../../hooks/modalState';

import useNotifications from '../../hooks/notifications';

import { useWallet } from '../../web3';

import { shortenAddress } from '../../utils';

import logo from '../../assets/images/logo.png';

const useStyles = createStyles(theme => ({
	header: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: theme.spacing.xs,
		paddingBottom: theme.spacing.xs,
	},
	modalTitle: {
		fontWeight: 600,
		fontSize: theme.fontSizes.xl,
	},
}));

export const Header = () => {
	const { classes } = useStyles();
	const walletModal = useModalState();

	const wallet = useWallet();
	const notifications = useNotifications();

	const onConnectWallet = useCallback(() => {
		const onError = ({ message }) =>
			notifications.show({
				type: 'ERROR',
				title: 'Falha ao conectar carteira',
				message,
			});

		wallet.connect({ onError });
	}, [wallet.connect, notifications]);

	useEffect(() => {
		if (!wallet.address) walletModal.close();
	}, [wallet.address, walletModal.close]);

	return (
		<MtnHeader fixed>
			<Container size="xl" className={classes.header}>
				<Image width="190px" height="auto" src={logo} alt="DonationChain" />

				{wallet.address ? (
					<Button
						leftIcon={<IoWalletOutline size={18} />}
						variant="outline"
						{...bindTrigger(walletModal)}
					>
						{shortenAddress(wallet.address)}
					</Button>
				) : (
					<Button
						leftIcon={<IoLink size={18} />}
						onClick={onConnectWallet}
						loading={wallet.connecting}
					>
						Conectar Carteira
					</Button>
				)}

				<Modal
					{...bindModal(walletModal)}
					title="Sua carteira"
					size="xs"
					classNames={{
						title: classes.modalTitle,
					}}
					closeOnClickOutside={false}
				>
					<Wallet onDisconnect={walletModal.close} />
				</Modal>
			</Container>
		</MtnHeader>
	);
};
