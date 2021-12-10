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
	Text,
	TextInput,
	Title,
	createStyles,
} from '@mantine/core';

import { useForm } from '@mantine/hooks';

import { CharityCard } from '../CharityCard';

import { useBalance, useDonation, useWallet } from '../../web3';

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
}));

export const Donation = charity => {
	const { classes } = useStyles();

	const wallet = useWallet();
	const bnbCoin = useBalance();
	const busdToken = useBalance('BUSD');

	const { donate, donating } = useDonation(charity);

	const form = useForm({
		initialValues: {
			currency: 'BUSD',
			amount: '',
		},
		validationRules: {
			amount: (value, { currency }) => {
				const parsed = parseFloat(value);
				const max = parseFloat(
					currency === 'BUSD' ? busdToken.balance : bnbCoin.balance
				);
				return parsed && parsed > 0 && parsed <= max;
			},
		},
		errorMessages: {
			amount: 'Invalid amount',
		},
	});

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
					<form onSubmit={form.onSubmit(values => donate(1, '0x0'))}>
						<InputWrapper size="md" label="Select the cryptocurrency">
							<SegmentedControl
								fullWidth
								size="md"
								sx={theme => ({ marginBottom: theme.spacing.lg })}
								data={[
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
								]}
								{...form.getInputProps('currency')}
							/>
						</InputWrapper>

						<TextInput
							size="md"
							placeholder="0.0"
							label="Amount"
							description={`Balance: ${
								form.values.currency === 'BUSD'
									? busdToken.balance
									: bnbCoin.balance
							}`}
							sx={theme => ({ marginBottom: theme.spacing.lg })}
							{...form.getInputProps('amount')}
						/>

						<Button
							fullWidth
							type={wallet.address ? 'submit' : 'button'}
							size="md"
							onClick={wallet.address ? undefined : wallet.connect}
							loading={wallet.connecting}
						>
							{wallet.address ? 'Donate' : 'Connect Wallet'}
						</Button>
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
