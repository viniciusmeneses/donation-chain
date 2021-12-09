import {
	AppShell,
	Container,
	MantineProvider,
	createStyles,
} from '@mantine/core';

import { Header } from './components';

import { HomePage } from './pages';

import { Web3Provider } from './web3';

const fontFamily = 'Rubik, sans-serif';

const theme = {
	fontFamily,
	headings: { fontFamily },
	primaryColor: 'yellow',
};

const useStyles = createStyles(theme => ({
	app: {
		backgroundColor: theme.colors.gray[0],
		minHeight: '100vh',
	},
	container: {
		padding: 0,
		paddingTop: '80px',
	},
}));

const App = () => {
	const { classes } = useStyles();

	return (
		<MantineProvider theme={theme}>
			<Web3Provider>
				<AppShell className={classes.app} header={<Header />}>
					<Container size="xl" className={classes.container}>
						<HomePage />
					</Container>
				</AppShell>
			</Web3Provider>
		</MantineProvider>
	);
};

export default App;
