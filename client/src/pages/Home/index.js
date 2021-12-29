import { Fragment, useMemo, useState } from 'react';

import {
	Col,
	Grid,
	Modal,
	SimpleGrid,
	Skeleton,
	createStyles,
} from '@mantine/core';

import { prop, uniq } from 'ramda';

import { CharityCard, Donation, Sidebar } from '../../components';

import useModalState, { bindModal, bindTrigger } from '../../hooks/modalState';

import { useCharities } from '../../web3';

const useStyles = createStyles(theme => ({
	modal: {
		width: '800px',
	},
	modalTitle: {
		fontWeight: 600,
		fontSize: theme.fontSizes.xl,
	},
}));

const Charity = ({ charity, onDonate }) => {
	const { classes } = useStyles();
	const donationModal = useModalState();

	return (
		<>
			<CharityCard {...bindTrigger(donationModal)} {...charity} />

			<Modal
				{...bindModal(donationModal)}
				title="Support the charity"
				size="xl"
				classNames={{
					modal: classes.modal,
					title: classes.modalTitle,
				}}
				closeOnClickOutside={false}
			>
				<Donation
					charity={charity}
					onDonate={() => {
						donationModal.close();
						onDonate();
					}}
				/>
			</Modal>
		</>
	);
};

export const HomePage = () => {
	const [causeFilter, setCauseFilter] = useState();

	const { charities: allCharities, loading, reload } = useCharities();
	const causes = useMemo(
		() => uniq(allCharities.map(prop('cause'))),
		[allCharities]
	);

	const charities = useMemo(
		() =>
			allCharities.filter(
				({ cause }) => causeFilter == null || causeFilter === cause
			),
		[allCharities, causeFilter]
	);

	return (
		<Grid gutter="xl">
			<Col span={3}>
				<Sidebar
					causes={causes}
					loading={loading}
					onSelectCause={cause => setCauseFilter(cause)}
				/>
			</Col>

			<Col span={9}>
				<SimpleGrid cols={3}>
					{loading ? (
						<>
							<Skeleton height={363} radius="sm" />
							<Skeleton height={363} radius="sm" />
							<Skeleton height={363} radius="sm" />
							<Skeleton height={363} radius="sm" />
							<Skeleton height={363} radius="sm" />
							<Skeleton height={363} radius="sm" />
						</>
					) : (
						charities.map(charity => (
							<Charity
								key={charity.recipient}
								charity={charity}
								onDonate={reload}
							/>
						))
					)}
				</SimpleGrid>
			</Col>
		</Grid>
	);
};
