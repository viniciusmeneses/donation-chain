import {
	Anchor,
	Avatar,
	Box,
	Button,
	Card,
	Group,
	Image,
	UnstyledButton,
	Text,
	Title,
	Tooltip,
	createStyles,
} from '@mantine/core';

import { identity } from 'ramda';

import { CAUSES, removeHttpFromUrl } from '../../utils';

const useStyles = createStyles(theme => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
	},
	header: {
		marginBottom: 5,
		marginTop: theme.spacing.sm,
	},
	nowrap: {
		whiteSpace: 'nowrap',
	},
	footer: {
		display: 'flex',
		alignItems: 'center',
		marginTop: 'auto',
	},
}));

export const CharityCard = ({
	name,
	description,
	cause,
	website,
	donationCount,
	onClick = identity,
	withButtons = true,
	...props
}) => {
	const { classes } = useStyles();
	const { Icon: CauseIcon } = CAUSES[cause];

	return (
		<Card shadow="sm" padding="lg" className={classes.container} {...props}>
			<Card.Section>
				<Image
					src={`https://source.unsplash.com/featured/300x150/?${CAUSES[cause].name}`}
					height={150}
					alt="Charity Image"
				/>
			</Card.Section>

			<Group position="apart" className={classes.header}>
				<Box>
					<Title order={4}>{name}</Title>
					<Anchor
						href={website}
						target="_blank"
						size="sm"
						sx={{ '&:hover': { textDecoration: 'none' } }}
					>
						{removeHttpFromUrl(website)}
					</Anchor>
				</Box>

				<Tooltip label={CAUSES[cause].label} withArrow>
					<Avatar color={CAUSES[cause].color} radius="xl">
						<CauseIcon />
					</Avatar>
				</Tooltip>
			</Group>

			<Text
				component="p"
				size="sm"
				m={0}
				color="gray"
				mb={withButtons ? 'sm' : 0}
			>
				{description}
			</Text>

			{withButtons && (
				<Box className={classes.footer}>
					<Button variant="filled" fullWidth onClick={onClick}>
						Doar
					</Button>

					<UnstyledButton onClick={onClick}>
						<Text
							color="yellow"
							component="span"
							size="sm"
							ml="sm"
							className={classes.nowrap}
						>
							{donationCount}{' '}
							{parseInt(donationCount) !== 1 ? 'doações' : 'doação'}
						</Text>
					</UnstyledButton>
				</Box>
			)}
		</Card>
	);
};
