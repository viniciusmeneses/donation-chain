import { useState, useCallback } from 'react';

import {
	Anchor,
	Box,
	Button,
	Divider,
	Group,
	Text,
	Skeleton,
	SegmentedControl,
	createStyles,
} from '@mantine/core';

import { identity } from 'ramda';

import { FiExternalLink } from 'react-icons/fi';

import { useBalance, useWallet } from '../../web3';

const useStyles = createStyles({
	donations: {
		overflowY: 'auto',
	},
	flexBetween: {
		display: 'flex',
		justifyContent: 'space-between',
	},
});

export const Wallet = ({ onDisconnect: onDisconnectCallback = identity }) => {
	const { classes } = useStyles();
	const [activeTab, setActiveTab] = useState('general');

	const wallet = useWallet();
	const bnbCoin = useBalance();
	const busdToken = useBalance('BUSD');

	const onDisconnect = useCallback(() => {
		wallet.disconnect();
		onDisconnectCallback();
	}, [wallet.disconnect, onDisconnectCallback]);

	return (
		<>
			<SegmentedControl
				fullWidth
				size="md"
				sx={theme => ({ marginBottom: theme.spacing.lg })}
				data={[
					{
						value: 'general',
						label: 'General',
					},
					{
						value: 'donations',
						label: 'Donations',
					},
				]}
				value={activeTab}
				onChange={setActiveTab}
			/>

			{activeTab === 'general' ? (
				<Group direction="column" grow>
					<Text color="dimmed" size="xs" mb={0}>
						Address
					</Text>
					<Text mt={0}>{wallet.address}</Text>

					<Text color="dimmed" size="xs" mb={0}>
						BNB Balance
					</Text>
					<Text mt={0}>
						{bnbCoin.loading ? <Skeleton height={25} /> : bnbCoin.balance}
					</Text>

					<Text color="dimmed" size="xs" mb={0}>
						BUSD Balance
					</Text>
					<Text my={0}>
						{busdToken.loading ? <Skeleton height={25} /> : busdToken.balance}
					</Text>

					<Divider />

					<Button color="red" onClick={onDisconnect}>
						Disconnect
					</Button>
				</Group>
			) : (
				<Group direction="column" grow noWrap className={classes.donations}>
					<Box mb={0}>
						<Box sx={classes.flexBetween}>
							<Text>43.63 BUSD</Text>
							<Anchor
								href="#"
								target="_blank"
								sx={{ '&:hover': { textDecoration: 'none' } }}
							>
								<FiExternalLink />
							</Anchor>
						</Box>
						<Box sx={classes.flexBetween}>
							<Text color="dimmed" size="xs">
								Mercy For Animals
							</Text>
							<Text color="dimmed" size="xs">
								30/11/2021
							</Text>
						</Box>
					</Box>

					<Divider />
				</Group>
			)}
		</>
	);
};
