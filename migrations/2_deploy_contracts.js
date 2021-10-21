var DonationChain = artifacts.require("./DonationChain.sol");

module.exports = function(deployer) {
  deployer.deploy(DonationChain);
};
