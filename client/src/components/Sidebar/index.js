import {
	Avatar,
	UnstyledButton,
	Card,
	Divider,
	Group,
	Text,
	SimpleGrid,
} from '@mantine/core';

import { HomeIcon } from '@modulz/radix-icons';

const Cause = () => (
	<UnstyledButton
		sx={theme => ({
			borderRadius: '4px',
			'&:hover': { backgroundColor: theme.colors.blue[0] },
			'&:active': { transform: 'translateY(1px)' },
		})}
	>
		<Group spacing="xs">
			<Avatar size={28} color="blue">
				<HomeIcon />
			</Avatar>

			<Text
				weight={600}
				size="sm"
				sx={theme => ({ color: theme.colors.blue[9] })}
			>
				Animals
			</Text>
		</Group>
	</UnstyledButton>
);

export const Sidebar = () => (
	<Card shadow="sm">
		<Text
			weight={500}
			mt={0}
			mb="4px"
			size="sm"
			component="h3"
			sx={t => ({ color: t.colors.gray[6] })}
		>
			Causes
		</Text>

		<Divider />

		<SimpleGrid spacing="5px" cols={1} mt="xs">
			<Cause />
		</SimpleGrid>
	</Card>
);
