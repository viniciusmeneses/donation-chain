const assert = require("assert");
const DonationChain = artifacts.require("./DonationChain.sol");

const objToArgs = (obj) => Object.values(obj);

contract("DonationChain", (accounts) => {
  const mockCharity = () => ({
    recipient: accounts[1],
    name: "Instituição de Caridade",
    description: "Ajuda crianças carentes",
    cause: 1,
    website: "www.instituicao.com.br",
    acceptedTokens: [accounts[2]],
  });

  let contract;

  before(async () => {
    contract = await DonationChain.deployed();
  });

  it("should store owner", async () => {
    const storedData = await contract.owner();
    assert.equal(storedData, accounts[0]);
  });

  it("should be able to create charity", async () => {
    const charity = mockCharity();
    await contract.createCharity(...objToArgs(charity));

    const recipients = await contract.allRecipients();
    const { name } = await contract.charities(charity.recipient);

    assert.equal(recipients[0], charity.recipient);
    assert.equal(name, charity.name);
  });

  it("shouldn't be able to create charity if isn't owner", async () => {
    const charity = mockCharity();
    await assert.rejects(async () => {
      await contract.createCharity(...objToArgs(charity), {
        from: accounts[1],
      });
    });
  });

  it("shouldn't be able to create charity if already exists", async () => {
    const charity = mockCharity();
    await assert.rejects(async () => {
      await contract.createCharity(...objToArgs(charity));
    });
  });

  it("shouldn't be able to create charity if any arg is invalid", async () => {
    const charity = mockCharity();
    await assert.rejects(async () => {
      await contract.createCharity(...objToArgs({ ...charity, name: "" }));
    });
  });

  it("should be able to update charity", async () => {
    const charity = { ...mockCharity(), cause: 0 };
    await contract.updateCharity(...objToArgs(charity));

    const recipients = await contract.allRecipients();
    const { cause } = await contract.charities(charity.recipient);

    assert.equal(recipients[0], charity.recipient);
    assert.equal(cause.toNumber(), charity.cause);
  });

  it("shouldn't be able to update charity if isn't owner", async () => {
    const charity = mockCharity();
    await assert.rejects(async () => {
      await contract.updateCharity(
        ...objToArgs({ ...charity, website: "www.google.com" }),
        {
          from: accounts[1],
        }
      );
    });
  });

  it("shouldn't be able to update charity if doesn't exists", async () => {
    const charity = mockCharity();
    await assert.rejects(async () => {
      await contract.updateCharity(
        ...objToArgs({ ...charity, recipient: accounts[4] })
      );
    });
  });

  it("shouldn't be able to update charity if any arg is invalid", async () => {
    const charity = mockCharity();
    await assert.rejects(async () => {
      await contract.updateCharity(...objToArgs({ ...charity, name: "" }));
    });
  });

  it("should be able to delete charity", async () => {
    const charity = mockCharity();
    await contract.deleteCharity(charity.recipient);
    const recipients = await contract.allRecipients();
    assert.equal(recipients[0], null);
  });

  it("shouldn't be able to delete charity if isn't owner", async () => {
    const charity = mockCharity();
    await assert.rejects(async () => {
      await contract.deleteCharity(charity.recipient, {
        from: accounts[1],
      });
    });
  });

  it("shouldn't be able to delete charity if doesn't exists", async () => {
    await assert.rejects(async () => {
      await contract.deleteCharity(accounts[4]);
    });
  });

  it("should be able to donate", async () => {
    const charity = mockCharity();
    await contract.createCharity(...objToArgs(charity));
    await contract.donate(charity.recipient, { value: web3.utils.toWei("1") });

    const [sentDonation] = await contract.addressDonations(accounts[0]);
    const [receivedDonation] = await contract.addressDonations(
      charity.recipient
    );

    const { donationCount } = await contract.charities(charity.recipient);

    assert.equal(sentDonation.from, accounts[0]);
    assert.equal(sentDonation.recipient, charity.recipient);
    assert.equal(web3.utils.fromWei(sentDonation.amount), 1);

    assert.equal(receivedDonation.from, accounts[0]);
    assert.equal(receivedDonation.recipient, charity.recipient);
    assert.equal(web3.utils.fromWei(receivedDonation.amount), 1);

    assert.equal(donationCount, 1);
  });

  it("shouldn't be able to donate if charity doesn't exists", async () => {
    await assert.rejects(async () => {
      await contract.donate(accounts[5], { value: web3.utils.toWei("1") });
    });
  });

  it("shouldn't be able to donate if sender is a charity", async () => {
    const charity = mockCharity();
    await assert.rejects(async () => {
      await contract.donate(charity.recipient, { value: web3.utils.toWei("1"), from: accounts[1] });
    });
  });

  it("shouldn't be able to donate if value is too high", async () => {
    const charity = mockCharity();
    await assert.rejects(async () => {
      await contract.donate(charity.recipient, { value: web3.utils.toWei(500) });
    });
  });

  it("should be able to get charity", async () => {
    const charity = mockCharity();
    const { name } = await contract.charities(charity.recipient);
    assert.equal(name, charity.name);
  });

  it("should be able to get donations", async () => {
    const [donation] = await contract.addressDonations(accounts[0]);
    assert.equal(donation.from, accounts[0]);
  });

  it("should be able to get number of donations to charity", async () => {
    const charity = mockCharity();
    const { donationCount } = await contract.charities(charity.recipient);
    assert.equal(donationCount, 1);
  });
});
