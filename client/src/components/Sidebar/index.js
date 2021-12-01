import {
  Avatar,
  UnstyledButton,
  Card,
  Divider,
  Group,
  Text,
  SimpleGrid,
  createStyles,
} from '@mantine/core';

import { HomeIcon } from '@modulz/radix-icons';

const useStyles = createStyles(theme => ({
  title: {
    color: theme.colors.gray[6],
  },
  cause: {
    borderRadius: '4px',
    '&:hover': { backgroundColor: theme.colors.blue[0] },
    '&:active': { transform: 'translateY(1px)' },
  },
  causeName: {
    color: theme.colors.blue[9],
  },
}));

const Cause = () => {
  const { classes } = useStyles();

  return (
    <UnstyledButton className={classes.cause}>
      <Group spacing="xs">
        <Avatar size={28} color="blue">
          <HomeIcon />
        </Avatar>

        <Text weight={600} size="sm" className={classes.causeName}>
          Animals
        </Text>
      </Group>
    </UnstyledButton>
  );
};

export const Sidebar = () => {
  const { classes } = useStyles();

  return (
    <Card shadow="sm">
      <Text
        weight={500}
        mt={0}
        mb="4px"
        size="sm"
        component="h3"
        className={classes.title}
      >
        Causes
      </Text>

      <Divider />

      <SimpleGrid spacing="5px" cols={1} mt="xs">
        <Cause />
      </SimpleGrid>
    </Card>
  );
};
