import {
	Anchor,
	Avatar,
	Box,
	UnstyledButton,
	Card,
	Image,
	Group,
	Button,
	Text,
	Title,
} from '@mantine/core';

import { HomeIcon } from '@modulz/radix-icons';

export const CharityCard = () => (
	<Card shadow="sm" padding="lg">
		<Card.Section>
			<Image
				src="https://source.unsplash.com/featured/300x150/?animal"
				height={150}
				alt="Norway"
			/>
		</Card.Section>

		<Group
			position="apart"
			sx={theme => ({
				marginBottom: 5,
				marginTop: theme.spacing.sm,
			})}
		>
			<Box>
				<Title order={4}>Mercy For Animals</Title>
				<Anchor
					href="http://amazonfrontlines.org"
					target="_blank"
					size="sm"
					sx={{ '&:hover': { textDecoration: 'none' } }}
				>
					amazonfrontlines.org
				</Anchor>
			</Box>
			<Avatar color="blue" radius="xl">
				<HomeIcon />
			</Avatar>
		</Group>

		<Text component="p" size="sm" m={0} color="gray">
			Exists to end the greatest cause of suffering on the planet: the
			exploitation of animals for food.
		</Text>

		<Box sx={{ display: 'flex', alignItems: 'center' }} mt="sm">
			<Button variant="filled" color="blue" fullWidth>
				Donate
			</Button>

			<UnstyledButton>
				<Text
					color="blue"
					component="span"
					size="sm"
					sx={{ whiteSpace: 'nowrap' }}
					ml="sm"
				>
					32 donors
				</Text>
			</UnstyledButton>
		</Box>
	</Card>
);
