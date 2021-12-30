import React, { useState, useCallback } from 'react';

import {
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

import { useBalance, useWallet, useDonations } from '../../web3';

import { formatDateTime } from '../../utils';

const useStyles = createStyles({
	donations: {
		overflowY: 'auto',
	},
	flexBetween: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	flexCenter: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export const Wallet = ({ onDisconnect: onDisconnectCallback = identity }) => {
	const { classes } = useStyles();
	const [activeTab, setActiveTab] = useState('general');

	const wallet = useWallet();
	const donations = useDonations({ address: wallet.address });

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
						label: 'Geral',
					},
					{
						value: 'donations',
						label: 'Doações',
					},
				]}
				value={activeTab}
				onChange={setActiveTab}
			/>

			{activeTab === 'general' ? (
				<Group direction="column" grow>
					<Text color="dimmed" size="xs" mb={0}>
						Endereço
					</Text>
					<Text mt={0}>{wallet.address}</Text>

					<Text color="dimmed" size="xs" mb={0}>
						Saldo em BNB
					</Text>
					<Text mt={0}>
						{bnbCoin.loading ? (
							<Skeleton height={25} radius="sm" />
						) : (
							bnbCoin.balance.toString()
						)}
					</Text>

					<Text color="dimmed" size="xs" mb={0}>
						Saldo em BUSD
					</Text>
					<Text my={0}>
						{busdToken.loading ? (
							<Skeleton height={25} radius="sm" />
						) : (
							busdToken.balance.toString()
						)}
					</Text>

					<Divider />

					<Button color="red" onClick={onDisconnect}>
						Desconectar
					</Button>
				</Group>
			) : (
				<Group
					direction="column"
					withGutter
					grow
					noWrap
					className={classes.donations}
				>
					{donations.loading && (
						<>
							<Skeleton height={44} radius="sm" m={0} />
							<Divider my={8} />
							<Skeleton height={44} radius="sm" m={0} />
							<Divider my={8} />
							<Skeleton height={44} radius="sm" m={0} />
						</>
					)}

					{!donations.loading && donations.history.length === 0 ? (
						<Box className={classes.flexCenter}>
							<Text color="dimmed" size="sm">
								Nenhuma doação realizada
							</Text>
						</Box>
					) : (
						donations.history.map(({ charity, amount, token, date }, i) => (
							<React.Fragment key={i}>
								<Box>
									<Text>
										{amount.toString()} {token || 'BNB'}
									</Text>
									<Box className={classes.flexBetween}>
										<Text color="dimmed" size="xs">
											{charity.name}
										</Text>
										<Text color="dimmed" size="xs">
											{formatDateTime(date)}
										</Text>
									</Box>
								</Box>

								{i + 1 < donations.history.length && <Divider my={8} />}
							</React.Fragment>
						))
					)}
				</Group>
			)}
		</>
	);
};
