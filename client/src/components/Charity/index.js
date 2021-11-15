import {
	Anchor,
	Avatar,
	Box,
	Button,
	Card,
	Center,
	Col,
	Grid,
	Group,
	Image,
	InputWrapper,
	TextInput,
	Modal,
	UnstyledButton,
	SegmentedControl,
	Text,
	Title,
} from '@mantine/core';

import { HomeIcon } from '@modulz/radix-icons';

import bnbLogo from '../../assets/images/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png';
import busdLogo from '../../assets/images/0xe9e7cea3dedca5984780bafc599bd69add087d56.png';

import useModalState, { bindModal, bindTrigger } from '../../hooks/modalState';

export const Charity = () => {
	const detailsModal = useModalState();

	return (
		<Card shadow="sm" padding="lg">
			<Card.Section>
				<Image
					src="https://source.unsplash.com/featured/300x150/?animal"
					height={150}
					alt="Norway"
				/>
			</Card.Section>

			<Group
				position="apart"
				sx={theme => ({
					marginBottom: 5,
					marginTop: theme.spacing.sm,
				})}
			>
				<Box>
					<Title order={4}>Mercy For Animals</Title>
					<Anchor
						href="http://amazonfrontlines.org"
						target="_blank"
						size="sm"
						sx={{ '&:hover': { textDecoration: 'none' } }}
					>
						amazonfrontlines.org
					</Anchor>
				</Box>
				<Avatar color="yellow" radius="xl">
					<HomeIcon />
				</Avatar>
			</Group>

			<Text component="p" size="sm" m={0} color="gray">
				Exists to end the greatest cause of suffering on the planet: the
				exploitation of animals for food.
			</Text>

			<Box sx={{ display: 'flex', alignItems: 'center' }} mt="sm">
				<Button variant="filled" fullWidth {...bindTrigger(detailsModal)}>
					Donate
				</Button>

				<UnstyledButton {...bindTrigger(detailsModal)}>
					<Text
						color="yellow"
						component="span"
						size="sm"
						sx={{ whiteSpace: 'nowrap' }}
						ml="sm"
					>
						32 donations
					</Text>
				</UnstyledButton>
			</Box>

			<Modal
				{...bindModal(detailsModal)}
				title="Support the charity"
				size="xl"
				styles={t => ({ title: { fontWeight: 600, fontSize: t.fontSizes.xl } })}
				closeOnClickOutside={false}
			>
				<Grid gutter="xl">
					<Col span={6}>
						<Card shadow="md" padding="lg" sx={{ height: '100%' }}>
							<Card.Section>
								<Image
									src="https://source.unsplash.com/featured/300x150/?animal"
									height={150}
									alt="Norway"
								/>
							</Card.Section>

							<Group
								position="apart"
								sx={theme => ({
									marginBottom: 5,
									marginTop: theme.spacing.sm,
								})}
							>
								<Box>
									<Title order={5}>Mercy For Animals</Title>
									<Anchor
										href="http://amazonfrontlines.org"
										target="_blank"
										size="sm"
										sx={{ '&:hover': { textDecoration: 'none' } }}
									>
										amazonfrontlines.org
									</Anchor>
								</Box>
								<Avatar color="yellow" radius="xl">
									<HomeIcon />
								</Avatar>
							</Group>

							<Text component="p" size="sm" m={0} color="gray">
								Exists to end the greatest cause of suffering on the planet: the
								exploitation of animals for food.
							</Text>
						</Card>
					</Col>
					<Col span={6}>
						<Card shadow="md" padding="lg" sx={{ height: '100%' }}>
							<InputWrapper size="md" label="Select the cryptocurrency">
								<SegmentedControl
									fullWidth
									size="md"
									sx={t => ({ marginBottom: t.spacing.lg })}
									data={[
										{
											value: 'preview',
											label: (
												<Center>
													<Image src={busdLogo} width="24px" height="auto" />
													<div style={{ marginLeft: 10 }}>BUSD</div>
												</Center>
											),
										},
										{
											value: 'code',
											label: (
												<Center>
													<Image src={bnbLogo} width="24px" height="auto" />
													<div style={{ marginLeft: 10 }}>BNB</div>
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
								sx={t => ({ marginBottom: t.spacing.lg })}
							/>
							<Button size="md" fullWidth>
								Donate
							</Button>
						</Card>
					</Col>
					<Col span={12}>
						<Card shadow="md" padding="lg">
							<Title order={5} mb="sm">
								Lastest donations
							</Title>
							<Grid gutter="sm">
								<Col
									span={6}
									sx={t => ({
										borderBottom: '1px solid',
										borderBottomColor: t.colors.gray[4],
									})}
								>
									<Text size="sm" weight="600" color="gray">
										Wallet
									</Text>
								</Col>

								<Col
									span={2}
									sx={t => ({
										borderBottom: '1px solid',
										borderBottomColor: t.colors.gray[4],
									})}
								>
									<Text size="sm" weight="600" color="gray">
										Date
									</Text>
								</Col>
								<Col
									span={2}
									sx={t => ({
										borderBottom: '1px solid',
										borderBottomColor: t.colors.gray[4],
									})}
								>
									<Text size="sm" weight="600" color="gray">
										Amount
									</Text>
								</Col>
								<Col
									span={2}
									sx={t => ({
										borderBottom: '1px solid',
										borderBottomColor: t.colors.gray[4],
									})}
								/>

								<Col span={6}>
									<Text size="sm">
										0xe2d3A739EFFCd3A99387d015E260eEFAc72EBea1
									</Text>
								</Col>

								<Col span={2}>
									<Text size="sm">11/09/2021 21:27</Text>
								</Col>
								<Col span={2}>
									<Text size="sm">50 BUSD</Text>
								</Col>
								<Col span={2}>
									<Anchor
										size="sm"
										href="http://amazonfrontlines.org"
										target="_blank"
										sx={{ '&:hover': { textDecoration: 'none' } }}
									>
										View transaction
									</Anchor>
								</Col>
							</Grid>
						</Card>
					</Col>
				</Grid>
			</Modal>
		</Card>
	);
};
