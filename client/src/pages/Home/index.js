import { Col, Grid, Modal, SimpleGrid, createStyles } from '@mantine/core';

import { CharityCard, Donation, Sidebar } from '../../components';

import useModalState, { bindModal, bindTrigger } from '../../hooks/modalState';

const useStyles = createStyles(theme => ({
  modal: {
    width: '800px',
  },
  modalTitle: {
    fontWeight: 600,
    fontSize: theme.fontSizes.xl,
  },
}));

export const HomePage = () => {
  const { classes } = useStyles();
  const donationModal = useModalState();

  return (
    <Grid gutter="xl">
      <Col span={3}>
        <Sidebar />
      </Col>

      <Col span={9}>
        <SimpleGrid cols={3}>
          <CharityCard {...bindTrigger(donationModal)} />

          <Modal
            {...bindModal(donationModal)}
            title="Support the charity"
            size="xl"
            classNames={{
              modal: classes.modal,
              title: classes.modalTitle,
            }}
            closeOnClickOutside={false}
          >
            <Donation />
          </Modal>
        </SimpleGrid>
      </Col>
    </Grid>
  );
};
