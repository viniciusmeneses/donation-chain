import { useCallback } from 'react';

import {
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
	Tooltip,
	createStyles,
} from '@mantine/core';

import { useForm } from '@mantine/hooks';

import BigNumber from 'bignumber.js';

import { identity } from 'ramda';

import { CharityCard } from '../CharityCard';

import {
	useApproval,
	useBalance,
	useDonation,
	useDonations,
	useWallet,
} from '../../web3';

import useNotifications from '../../hooks/notifications';

import { shortenAddress, formatDateTime } from '../../utils';

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
	const donations = useDonations({ address: charity.recipient });

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
			amount: 'Valor inválido',
		},
	});

	const onSubmit = useCallback(
		({ amount, token }) => {
			let notification;

			const onPending = () => {
				notification = notifications.show({
					type: 'LOADING',
					title: 'Transação aguardando confirmação',
					message: `Enviando doação de ${amount} ${token} para ${charity.name}`,
				});
			};

			const onSuccess = receipt => {
				notifications.update(notification, {
					type: 'SUCCESS',
					title: 'Transação confirmada',
					message: `Doação de ${amount} ${token} enviada para ${charity.name}`,
				});
				onDonate(receipt);
			};

			const onError = ({ message }) =>
				notifications.update(notification, {
					type: 'ERROR',
					title: 'Transação falhou',
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
				title: 'Transação aguardando confirmação',
				message: 'Permitindo doações utilizando BUSD',
			});
		};

		const onSuccess = () =>
			notifications.update(notification, {
				type: 'SUCCESS',
				title: 'Transação confirmada',
				message: 'Agora é possivel realizar doações com BUSD',
			});

		const onError = ({ message }) =>
			notifications.update(notification, {
				type: 'ERROR',
				title: 'Transação falhou',
				message,
			});

		busdApproval.approve({ onPending, onSuccess, onError });
	}, [busdApproval.approve, notifications]);

	const onConnectWallet = useCallback(() => {
		const onError = ({ message }) =>
			notifications.show({
				type: 'ERROR',
				title: 'Falha ao conectar carteira',
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
						<InputWrapper size="md" label="Selecione a moeda">
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
							label="Valor"
							sx={theme => ({ marginBottom: theme.spacing.lg })}
							description={
								wallet.address && !loading
									? `Saldo: ${(form.values.token === 'BUSD'
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
								{!busdApproval.loading &&
									!busdApproval.approved &&
									form.values.token === 'BUSD' && (
										<Tooltip
											label="Permitir doações utilizando BUSD"
											position="bottom"
											withArrow
										>
											<Button
												fullWidth
												size="md"
												onClick={onBusdApprove}
												loading={busdApproval.approving}
												disabled={loading}
											>
												Permitir
											</Button>
										</Tooltip>
									)}

								<Button
									fullWidth
									type="submit"
									size="md"
									loading={donation.donating}
									disabled={
										loading ||
										(!busdApproval.approved && form.values.token === 'BUSD')
									}
								>
									Doar
								</Button>
							</Box>
						) : (
							<Button
								fullWidth
								size="md"
								onClick={onConnectWallet}
								loading={wallet.connecting}
							>
								Conectar Carteira
							</Button>
						)}
					</form>
				</Card>
			</Col>
			<Col span={12}>
				<Card shadow="md" padding="lg">
					<Title order={5} mb="sm">
						Últimas doações
					</Title>

					<Grid gutter="sm" className={classes.transactionsHeader}>
						<Col span={4}>
							<Text size="sm" weight="600">
								Data
							</Text>
						</Col>

						<Col span={4}>
							<Text size="sm" weight="600">
								Carteira
							</Text>
						</Col>

						<Col span={4}>
							<Text size="sm" weight="600">
								Valor
							</Text>
						</Col>
					</Grid>

					<Box mt={6}>
						{donations.loading && (
							<>
								<Grid gutter="sm" className={classes.transactionsList}>
									<Col span={4}>
										<Skeleton height={22} radius="sm" />
									</Col>

									<Col span={4}>
										<Skeleton height={22} radius="sm" />
									</Col>

									<Col span={4}>
										<Skeleton height={22} radius="sm" />
									</Col>
								</Grid>

								<Grid gutter="sm" className={classes.transactionsList}>
									<Col span={4}>
										<Skeleton height={22} radius="sm" />
									</Col>

									<Col span={4}>
										<Skeleton height={22} radius="sm" />
									</Col>

									<Col span={4}>
										<Skeleton height={22} radius="sm" />
									</Col>
								</Grid>

								<Grid gutter="sm" className={classes.transactionsList}>
									<Col span={4}>
										<Skeleton height={22} radius="sm" />
									</Col>

									<Col span={4}>
										<Skeleton height={22} radius="sm" />
									</Col>

									<Col span={4}>
										<Skeleton height={22} radius="sm" />
									</Col>
								</Grid>
							</>
						)}

						{!donations.loading && donations.history.length === 0 ? (
							<Grid gutter="sm" className={classes.transactionsList}>
								<Col span={12}>
									<Text color="dimmed" size="sm">
										Nenhuma doação recebida
									</Text>
								</Col>
							</Grid>
						) : (
							donations.history.map(({ from, amount, token, date }, i) => (
								<Grid gutter="sm" className={classes.transactionsList} key={i}>
									<Col span={4}>
										<Text size="sm">
											{formatDateTime(date, { date: 'short', time: 'short' })}
										</Text>
									</Col>

									<Col span={4}>
										<Text size="sm">{shortenAddress(from)}</Text>
									</Col>

									<Col span={4}>
										<Text size="sm">
											{amount.toString()} {token || 'BNB'}
										</Text>
									</Col>
								</Grid>
							))
						)}
					</Box>
				</Card>
			</Col>
		</Grid>
	);
};
