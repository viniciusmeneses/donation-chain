import {
	Button,
	Container,
	Image,
	Header as MtnHeader,
	createStyles,
} from '@mantine/core';

import { Link2Icon } from '@modulz/radix-icons';

import logo from '../../assets/images/logo.png';

const useStyles = createStyles(theme => ({
	header: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: theme.spacing.xs,
		paddingBottom: theme.spacing.xs,
	},
}));

export const Header = () => {
	const { classes } = useStyles();

	return (
		<MtnHeader fixed>
			<Container size="xl" className={classes.header}>
				<Image width="203px" height="auto" src={logo} alt="DonationChain" />
				<Button leftIcon={<Link2Icon />}>Connect Wallet</Button>
			</Container>
		</MtnHeader>
	);
};
