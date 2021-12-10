import {
	Button,
	Container,
	Image,
	Header as MtnHeader,
	Modal,
	createStyles,
} from '@mantine/core';

import { useEffect } from 'react';

import { IoLink, IoWalletOutline } from 'react-icons/io5';

import { Wallet } from '../Wallet';

import useModalState, { bindModal, bindTrigger } from '../../hooks/modalState';

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

	useEffect(() => {
		if (!wallet.address) walletModal.close();
	}, [wallet.address]);

	return (
		<MtnHeader fixed>
			<Container size="xl" className={classes.header}>
				<Image width="190px" height="auto" src={logo} alt="DonatIonChain" />

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
						onClick={wallet.connect}
						loading={wallet.connecting}
					>
						Connect Wallet
					</Button>
				)}

				<Modal
					{...bindModal(walletModal)}
					title="Your wallet"
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
