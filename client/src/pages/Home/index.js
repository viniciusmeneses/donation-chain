import { Fragment, useMemo } from 'react';

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

export const HomePage = () => {
	const { classes } = useStyles();
	const donationModal = useModalState();

	const { charities, loading } = useCharities();

	const causes = useMemo(() => uniq(charities.map(prop('cause'))), [charities]);

	return (
		<Grid gutter="xl">
			<Col span={3}>
				<Sidebar causes={causes} loading={loading} />
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
							<Fragment key={charity.recipient}>
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
									<Donation {...charity} />
								</Modal>
							</Fragment>
						))
					)}
				</SimpleGrid>
			</Col>
		</Grid>
	);
};
