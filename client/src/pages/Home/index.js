import { Col, Grid, SimpleGrid } from '@mantine/core';

import { Charity, Sidebar } from '../../components';

export const HomePage = () => (
	<Grid gutter="xl">
		<Col span={3}>
			<Sidebar />
		</Col>

		<Col span={9}>
			<SimpleGrid cols={3}>
				<Charity />
			</SimpleGrid>
		</Col>
	</Grid>
);
