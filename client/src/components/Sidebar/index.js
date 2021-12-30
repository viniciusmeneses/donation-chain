import {
	Avatar,
	Box,
	Button,
	UnstyledButton,
	Card,
	Divider,
	Group,
	SimpleGrid,
	Skeleton,
	Text,
	createStyles,
} from '@mantine/core';

import { CAUSES } from '../../utils';
import useQueryString from '../../hooks/queryString';

const useCauseStyles = createStyles((theme, { color, active = false }) => ({
	cause: {
		borderRadius: '4px',
		textDecoration: 'none',
		backgroundColor: active ? theme.colors[color][0] : '#00000000',
		'&:hover': { backgroundColor: theme.colors[color][0] },
		'&:active': { transform: 'translateY(1px)' },
	},
	causeName: {
		color: theme.colors[color][9],
	},
}));

const Cause = ({ color, label, Icon, ...props }) => {
	const [params, setParams] = useQueryString();

	const { classes } = useCauseStyles({
		active: params.cause === label.toLowerCase(),
		color,
	});

	return (
		<UnstyledButton
			className={classes.cause}
			onClick={() => setParams({ cause: label.toLowerCase() })}
			{...props}
		>
			<Group spacing="xs">
				<Avatar size={28} color={color}>
					<Icon size={18} />
				</Avatar>

				<Text weight={600} size="sm" className={classes.causeName}>
					{label}
				</Text>
			</Group>
		</UnstyledButton>
	);
};

const useStyles = createStyles({
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

export const Sidebar = ({ loading, causes: causeIds = [] }) => {
	const { classes } = useStyles();
	const [params, setParams] = useQueryString();

	return (
		<Card shadow="sm">
			<Box mb="4px" className={classes.header}>
				<Text
					weight={500}
					mt={0}
					mb={0}
					size="sm"
					component="h3"
					sx={theme => ({ color: theme.colors.gray[6] })}
				>
					Causas
				</Text>
				{params.cause && (
					<Button
						variant="light"
						size="xs"
						color="gray"
						compact
						onClick={() => setParams()}
						styles={theme => ({
							root: {
								height: '21px',
							},
							light: {
								backgroundColor: theme.colors.gray[0],
							},
							label: {
								fontWeight: 'normal',
								color: theme.colors.gray[6],
							},
						})}
					>
						Todas
					</Button>
				)}
			</Box>

			<Divider />

			<SimpleGrid spacing="5px" cols={1} mt="xs">
				{loading ? (
					<>
						<Skeleton height={28} radius="sm" />
						<Skeleton height={28} radius="sm" />
						<Skeleton height={28} radius="sm" />
					</>
				) : (
					causeIds.sort().map(cause => <Cause key={cause} {...CAUSES[cause]} />)
				)}
			</SimpleGrid>
		</Card>
	);
};
