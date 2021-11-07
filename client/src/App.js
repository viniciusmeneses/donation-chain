import {
	AppShell,
	Container,
	MantineProvider,
	createStyles,
} from '@mantine/core';

import { Header } from './components';

import { HomePage } from './pages';

const fontFamily = 'Rubik, sans-serif';

const useStyles = createStyles(theme => ({
	app: {
		backgroundColor: theme.colors.gray[0],
		minHeight: '100vh',
	},
	container: {
		padding: 0,
		paddingTop: '90px',
	},
}));

const App = () => {
	const { classes } = useStyles();

	return (
		<MantineProvider
			theme={{
				fontFamily,
				headings: { fontFamily },
			}}
		>
			<AppShell className={classes.app} header={<Header />}>
				<Container size="xl" className={classes.container}>
					<HomePage />
				</Container>
			</AppShell>
		</MantineProvider>
	);
};

export default App;
