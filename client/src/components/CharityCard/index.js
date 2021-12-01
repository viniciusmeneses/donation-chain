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
  createStyles
} from '@mantine/core';

import { identity } from "ramda";

import { HomeIcon } from '@modulz/radix-icons';

const useStyles = createStyles(theme => ({
  header: {
    marginBottom: 5,
    marginTop: theme.spacing.sm,
  },
  nowrap: {
    whiteSpace: "nowrap",
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
  }
}));

export const CharityCard = ({ onClick = identity, withButtons = true, ...props }) => {
  const { classes } = useStyles();

  return (
    <Card shadow="sm" padding="lg" {...props}>
      <Card.Section>
        <Image
          src="https://source.unsplash.com/featured/300x150/?animal"
          height={150}
          alt="Norway"
        />
      </Card.Section>

      <Group
        position="apart"
        className={classes.header}
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
        <Avatar color="yellow" radius="xl">
          <HomeIcon />
        </Avatar>
      </Group>

      <Text component="p" size="sm" m={0} color="gray">
        Exists to end the greatest cause of suffering on the planet: the
        exploitation of animals for food.
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
              32 donations
            </Text>
          </UnstyledButton>
        </Box>
      )}
    </Card>
  );
};
