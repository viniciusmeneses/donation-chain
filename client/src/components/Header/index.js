import {
  Anchor,
  ActionIcon,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Image,
  Header as MtnHeader,
  Modal,
  Text,
  SegmentedControl,
  createStyles,
} from '@mantine/core';

import { useState } from 'react';

import { IoWalletOutline } from 'react-icons/io5';

import { FiExternalLink } from 'react-icons/fi';

import useModalState, { bindModal, bindTrigger } from '../../hooks/modalState';

import logo from '../../assets/images/logo.png';

const useStyles = createStyles(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
  },
  modalTitle: {
    fontWeight: 600,
    fontSize: theme.fontSizes.xl,
  },
  copyButton: {
    color: theme.colors.gray[6],
  },
  donations: {
    // maxHeight: "70vh",
    overflowY: "auto",
  },
  flexBetween: {
    display: "flex",
    justifyContent: "space-between"
  }
}));

export const Header = () => {
  const { classes } = useStyles();
  const walletModal = useModalState();
  const [activeTab, setActiveTab] = useState("general");

  return (
    <MtnHeader fixed>
      <Container size="xl" className={classes.header}>
        <Image width="190px" height="auto" src={logo} alt="DonatIonChain" />
        {/* <Button leftIcon={<IoLink size={18} />}>Connect Wallet</Button> */}
        <Button leftIcon={<IoWalletOutline size={18} />} variant="outline" {...bindTrigger(walletModal)}>0x6EF...e883</Button>

        <Modal
          {...bindModal(walletModal)}
          title="Your wallet"
          size="xs"
          classNames={{
            title: classes.modalTitle,
          }}
          closeOnClickOutside={false}
        >
          <SegmentedControl
            fullWidth
            size="md"
            sx={theme => ({ marginBottom: theme.spacing.lg })}
            data={[
              {
                value: 'general',
                label: "General",
              },
              {
                value: 'donations',
                label: "Donations",
              },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === "general" ? (
            <Group direction="column" grow>
              <Text color="dimmed" size="xs" mb={0}>Address</Text>
              <Text mt={0}>0x6EF75743Dd20334203d0E21a553E96F68B19e883</Text>

              <Text color="dimmed" size="xs" mb={0}>BNB Balance</Text>
              <Text mt={0}>1.5323</Text>

              <Text color="dimmed" size="xs" mb={0}>BUSD Balance</Text>
              <Text my={0}>413.53</Text>

              <Divider />

              <Button color="red">Disconnect</Button>
            </Group>
          ) : (
            <Group direction="column" grow noWrap className={classes.donations}>
              <Box mb={0}>
                <Box sx={classes.flexBetween}>
                  <Text>43.63 BUSD</Text>
                  <Anchor
                    href="#"
                    target="_blank"
                    sx={{ '&:hover': { textDecoration: 'none' } }}
                  >
                    <FiExternalLink />
                  </Anchor>
                </Box>
                <Box sx={classes.flexBetween}>
                  <Text color="dimmed" size="xs">Mercy For Animals</Text>
                  <Text color="dimmed" size="xs">30/11/2021</Text>
                </Box>
              </Box>

              <Divider />

            </Group>
          )}
        </Modal>
      </Container>
    </MtnHeader >
  );
};
