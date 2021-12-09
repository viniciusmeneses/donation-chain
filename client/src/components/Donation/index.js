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

import { CharityCard } from '../CharityCard';

import { useWallet } from '../../web3';

import bnbLogo from '../../assets/images/coin.png';
import busdLogo from '../../assets/images/0xe9e7cea3dedca5984780bafc599bd69add087d56.png';

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

export const Donation = () => {
	const { classes } = useStyles();

	const wallet = useWallet();

	return (
		<Grid gutter="xl">
			<Col span={6}>
				<CharityCard withButtons={false} className={classes.fullHeight} />
			</Col>
			<Col span={6}>
				<Card shadow="md" padding="lg" className={classes.fullHeight}>
					<InputWrapper size="md" label="Select the cryptocurrency">
						<SegmentedControl
							fullWidth
							size="md"
							sx={theme => ({ marginBottom: theme.spacing.lg })}
							data={[
								{
									value: 'busd',
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
									value: 'bnb',
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
						/>
					</InputWrapper>

					<TextInput
						size="md"
						placeholder="Enter the amount to be donated"
						label="Amount"
						sx={theme => ({ marginBottom: theme.spacing.lg })}
					/>

					<Button size="md" fullWidth>
						{wallet.address ? 'Donate' : 'Connect Wallet'}
					</Button>
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
