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
	createStyles,
} from '@mantine/core';

import { identity } from 'ramda';

import { CauseIcon } from '../CauseIcon';

import { causes, removeHttpFromUrl } from '../../utils';

const useStyles = createStyles(theme => ({
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

	return (
		<Card shadow="sm" padding="lg" {...props}>
			<Card.Section>
				<Image
					src={`https://source.unsplash.com/featured/300x150/?${causes[cause].label}`}
					height={150}
					alt="Norway"
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

				<Avatar color={causes[cause].color} radius="xl">
					<CauseIcon label={causes[cause].label} />
				</Avatar>
			</Group>

			<Text component="p" size="sm" m={0} color="gray">
				{description}
			</Text>

			{withButtons && (
				<Box className={classes.footer} mt="sm">
					<Button variant="filled" fullWidth onClick={onClick}>
						Donate
					</Button>

					<UnstyledButton onClick={onClick}>
						<Text
							color="yellow"
							component="span"
							size="sm"
							ml="sm"
							className={classes.nowrap}
						>
							{donationCount} donation{parseInt(donationCount) !== 1 ? 's' : ''}
						</Text>
					</UnstyledButton>
				</Box>
			)}
		</Card>
	);
};
