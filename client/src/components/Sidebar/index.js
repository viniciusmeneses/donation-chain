import {
	Avatar,
	UnstyledButton,
	Card,
	Divider,
	Group,
	SimpleGrid,
	Skeleton,
	Text,
	createStyles,
} from '@mantine/core';

import { CauseIcon } from '../CauseIcon';

import { causes } from '../../utils';

const useStyles = createStyles((theme, { color }) => ({
	cause: {
		borderRadius: '4px',
		'&:hover': { backgroundColor: theme.colors[color][0] },
		'&:active': { transform: 'translateY(1px)' },
	},
	causeName: {
		color: theme.colors[color][9],
	},
}));

const Cause = ({ color, label }) => {
	const { classes } = useStyles({ color });

	return (
		<UnstyledButton className={classes.cause}>
			<Group spacing="xs">
				<Avatar size={28} color={color}>
					<CauseIcon label={label} size={18} />
				</Avatar>

				<Text weight={600} size="sm" className={classes.causeName}>
					{label}
				</Text>
			</Group>
		</UnstyledButton>
	);
};

export const Sidebar = ({ loading, causes: causeIds = [] }) => (
	<Card shadow="sm">
		<Text
			weight={500}
			mt={0}
			mb="4px"
			size="sm"
			component="h3"
			sx={theme => ({ color: theme.colors.gray[6] })}
		>
			Causes
		</Text>

		<Divider />

		<SimpleGrid spacing="5px" cols={1} mt="xs">
			{loading ? (
				<>
					<Skeleton height={28} radius="sm" />
					<Skeleton height={28} radius="sm" />
					<Skeleton height={28} radius="sm" />
				</>
			) : (
				causeIds.map(cause => <Cause key={cause} {...causes[cause]} />)
			)}
		</SimpleGrid>
	</Card>
);
