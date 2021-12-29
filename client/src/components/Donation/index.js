import { useCallback } from 'react';

import {
	Anchor,
	Box,
	Button,
	Card,
	Center,
	Col,
	Grid,
	Image,
	InputWrapper,
	SegmentedControl,
	Skeleton,
	Text,
	TextInput,
	Title,
	createStyles,
} from '@mantine/core';

import { useForm } from '@mantine/hooks';

import BigNumber from 'bignumber.js';

import { identity } from 'ramda';

import { CharityCard } from '../CharityCard';

import { useApproval, useBalance, useDonation, useWallet } from '../../web3';

import useNotifications from '../../hooks/notifications';

import bnbLogo from '../../assets/images/bnb.png';
import busdLogo from '../../assets/images/busd.png';

const useStyles = createStyles(theme => ({
	fullHeight: {
		height: '100%',
	},
	tokenName: {
		marginLeft: 10,
	},
	transactionsList: {
		maxHeight: '300px',
		overflowY: 'auto',
	},
	transactionsHeader: {
		borderBottom: '1px solid',
		borderBottomColor: theme.colors.gray[4],
	},
	buttonsContainer: {
		display: 'flex',
		flexWrap: 'nowrap',
		gap: '8px',
	},
}));

const tokenOptions = [
	{
		value: 'BNB',
		label: (
			<Center>
				<Image src={bnbLogo} width="24px" height="auto" />
				<Box ml={10} component="span">
					BNB
				</Box>
			</Center>
		),
	},
	{
		value: 'BUSD',
		label: (
			<Center>
				<Image src={busdLogo} width="24px" height="auto" />
				<Box ml={10} component="span">
					BUSD
				</Box>
			</Center>
		),
	},
];

export const Donation = ({ charity, onDonate = identity }) => {
	const { classes } = useStyles();

	const wallet = useWallet({});
	const bnb = useBalance();
	const busd = useBalance('BUSD');

	const busdApproval = useApproval('BUSD');
	const donation = useDonation(charity);

	const notifications = useNotifications();

	const loading = bnb.loading || busd.loading || busdApproval.loading;

	const form = useForm({
		initialValues: {
			token: 'BNB',
			amount: '',
		},
		validationRules: {
			amount: (value, { token }) => {
				const bigValue = BigNumber(value);
				const balance = token === 'BUSD' ? busd.balance : bnb.balance;
				return bigValue.isPositive() && bigValue.isLessThanOrEqualTo(balance);
			},
		},
		errorMessages: {
			amount: 'Invalid amount',
		},
	});

	const onSubmit = useCallback(
		({ amount, token }) => {
			let notification;

			const onPending = () => {
				notification = notifications.show({
					type: 'LOADING',
					title: 'Transaction waiting confirmation',
					message: `Sending a donation of ${amount} ${token} to ${charity.name}`,
				});
			};

			const onSuccess = receipt => {
				notifications.update(notification, {
					type: 'SUCCESS',
					title: 'Transaction confirmed',
					message: `Donation of ${amount} ${token} sent to ${charity.name}`,
				});
				onDonate(receipt);
			};

			const onError = ({ message }) =>
				notifications.update(notification, {
					type: 'ERROR',
					title: 'Transaction failed',
					message,
				});

			donation.donate({
				token: token !== 'BNB' ? token : null,
				amount: BigNumber(amount),
				onPending,
				onSuccess,
				onError,
			});
		},
		[donation.donate, notifications, charity, onDonate]
	);

	const onBusdApprove = useCallback(() => {
		let notification;

		const onPending = () => {
			notification = notifications.show({
				type: 'LOADING',
				title: 'Transaction waiting confirmation',
				message: 'Approving DonationChain to spend BUSD',
			});
		};

		const onSuccess = () =>
			notifications.update(notification, {
				type: 'SUCCESS',
				title: 'Transaction confirmed',
				message:
					'DonationChain approved to spend BUSD. Now you can donate to charities',
			});

		const onError = ({ message }) =>
			notifications.update(notification, {
				type: 'ERROR',
				title: 'Transaction failed',
				message,
			});

		busdApproval.approve({ onPending, onSuccess, onError });
	}, [busdApproval.approve, notifications]);

	const onConnectWallet = useCallback(() => {
		const onError = ({ message }) =>
			notifications.show({
				type: 'ERROR',
				title: 'Failed to connect wallet',
				message,
			});

		wallet.connect({ onError });
	}, [wallet.connect, notifications]);

	return (
		<Grid gutter="xl">
			<Col span={6}>
				<CharityCard
					withButtons={false}
					className={classes.fullHeight}
					{...charity}
				/>
			</Col>
			<Col span={6}>
				<Card shadow="md" padding="lg" className={classes.fullHeight}>
					<form onSubmit={form.onSubmit(onSubmit)}>
						<InputWrapper size="md" label="Select the cryptocurrency">
							<SegmentedControl
								{...form.getInputProps('token')}
								fullWidth
								size="md"
								sx={theme => ({ marginBottom: theme.spacing.lg })}
								data={tokenOptions}
							/>
						</InputWrapper>

						<TextInput
							{...form.getInputProps('amount')}
							size="md"
							placeholder="0.0"
							label="Amount"
							sx={theme => ({ marginBottom: theme.spacing.lg })}
							description={
								wallet.address && !loading
									? `Balance: ${(form.values.token === 'BUSD'
											? busd.balance
											: bnb.balance
									  ).toString()}`
									: loading && (
											<Skeleton height={16.7} radius="sm" width={150} />
									  )
							}
						/>

						{wallet.address ? (
							<Box className={classes.buttonsContainer}>
								{!busdApproval.loading && !busdApproval.approved && (
									<Button
										fullWidth
										size="md"
										onClick={onBusdApprove}
										loading={busdApproval.approving}
										disabled={loading}
									>
										Approve
									</Button>
								)}

								<Button
									fullWidth
									type="submit"
									size="md"
									loading={donation.donating}
									disabled={loading || !busdApproval.approved}
								>
									Donate
								</Button>
							</Box>
						) : (
							<Button
								fullWidth
								size="md"
								onClick={onConnectWallet}
								loading={wallet.connecting}
							>
								Connect Wallet
							</Button>
						)}
					</form>
				</Card>
			</Col>
			<Col span={12}>
				<Card shadow="md" padding="lg">
					<Title order={5} mb="sm">
						Lastest donations
					</Title>

					<Grid gutter="sm" className={classes.transactionsHeader}>
						<Col span={5}>
							<Text size="sm" weight="600" color="gray">
								Wallet
							</Text>
						</Col>

						<Col span={3}>
							<Text size="sm" weight="600" color="gray">
								Date
							</Text>
						</Col>
						<Col span={2}>
							<Text size="sm" weight="600" color="gray">
								Amount
							</Text>
						</Col>
						<Col span={2} />
					</Grid>

					<Box mt={6}>
						<Grid gutter="sm" className={classes.transactionsList}>
							<Col span={5}>
								<Text size="sm">0xe2d3A739EFFCd3</Text>
							</Col>

							<Col span={3}>
								<Text size="sm">11/09/2021 21: 27</Text>
							</Col>
							<Col span={2}>
								<Text size="sm">50 BUSD</Text>
							</Col>
							<Col span={2}>
								<Anchor
									size="sm"
									href="http://amazonfrontlines.org"
									target="_blank"
									sx={{
										'&:hover': { textDecoration: 'none' },
									}}
								>
									View transaction
								</Anchor>
							</Col>
						</Grid>
					</Box>
				</Card>
			</Col>
		</Grid>
	);
};
