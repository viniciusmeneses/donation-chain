// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7 <0.9.0;

interface IBEP20 {
    function totalSupply() external view returns (uint256);
    function decimals() external view returns (uint8);
    function symbol() external view returns (string memory);
    function name() external view returns (string memory);
    function getOwner() external view returns (address);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address _owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract DonationChain {
  enum Cause {
    ANIMALS,
    CULTURE,
    EDUCATION,
    ENVIRONMENT,
    HEALTHCARE,
    JUSTICE,
    RELIGION,
    RESEARCH
  }

  struct Charity {
    string name;
    string description;
    Cause cause;
    string website;
    address[] acceptedTokens;
    uint256 donationCount;
  }

  struct Donation {
    address from;
    address recipient;
    uint256 amount;
    address token;
    uint256 timestamp;
  }

  address public owner;

  address[] private recipients;
  mapping(address => Charity) public charities;
  mapping(address => Donation[]) private donations;

  modifier existCharity(address addr) {
    require(bytes(charities[addr].name).length > 0, "Charity not exists");
    _;
  }

  modifier notExistCharity(address addr) {
    require(bytes(charities[addr].name).length == 0, "Charity already exists");
    _;
  }

  modifier senderNotRecipient() {
    require(bytes(charities[msg.sender].name).length == 0, "Sender address is a charity recipient");
    _;
  }

  modifier isCharityValid(address recipient, string memory name, string memory description, address[] memory acceptedTokens) {
    require(recipient == address(recipient), "Charity address is invalid");
    require(bytes(name).length > 0, "Charity name is blank");
    require(bytes(description).length > 0, "Charity description is blank");
    require(acceptedTokens.length > 0, "Charity must accept at least one token");
    _;
  }

  modifier isOwner() {
    require(msg.sender == owner, "Sender isn't contract owner");
    _;
  }

  constructor() {
    owner = msg.sender;
  }

  function createCharity(
    address recipient,
    string memory name,
    string memory description,
    Cause cause,
    string memory website,
    address[] memory acceptedTokens
  ) public isOwner() notExistCharity(recipient) isCharityValid(recipient, name, description, acceptedTokens) {
    charities[recipient] = Charity({
      name: name,
      description: description,
      cause: cause,
      website: website,
      acceptedTokens: acceptedTokens,
      donationCount: 0
    });

    recipients.push(recipient);
  }

  function updateCharity(
    address recipient,
    string memory name,
    string memory description,
    Cause cause,
    string memory website,
    address[] memory acceptedTokens
  ) public isOwner() existCharity(recipient) isCharityValid(recipient, name, description, acceptedTokens) {
    charities[recipient].name = name;
    charities[recipient].description = description;
    charities[recipient].cause = cause;
    charities[recipient].website = website;
    charities[recipient].acceptedTokens = acceptedTokens;
  }

  function deleteCharity(address recipient) public isOwner() existCharity(recipient) {
    delete charities[recipient];
    bool deleted = false;

    for (uint256 i = 0; i < recipients.length - 1; i++) {
      if (recipients[i] == recipient) deleted = true;
      recipients[i] = recipients[i + (deleted ? 1 : 0)];
    }

    recipients.pop();
  }

  function allRecipients() public view returns(address[] memory) {
    return recipients;
  }


  function addressDonations(address addr) public view returns(Donation[] memory) {
    return donations[addr];
  }

  function donate(address payable recipient) public payable existCharity(recipient) senderNotRecipient() {
    recipient.transfer(msg.value);
    charities[recipient].donationCount += 1;

    Donation memory donation = Donation({
      from: msg.sender,
      recipient: recipient,
      amount: msg.value,
      token: address(0),
      timestamp: block.timestamp
    });
    donations[msg.sender].push(donation);
    donations[recipient].push(donation);
  }

  function donateToken(address recipient, address token, uint256 amount) public existCharity(recipient) senderNotRecipient() {
    Charity memory charity = charities[recipient];
    IBEP20 tokenContract = IBEP20(token);
    bool isTokenAccepted = false;

    for (uint256 i = 0; i < charity.acceptedTokens.length; i++) {
      if (charity.acceptedTokens[i] == token) {
        isTokenAccepted = true;
        break;
      }
    }

    require(isTokenAccepted, "Token not accepted by charity");
    require(amount > 0, "You need to donate at least some amount");
    uint256 allowance = tokenContract.allowance(msg.sender, address(this));
    require(allowance >= amount, "Check the token allowance");

    tokenContract.transferFrom(msg.sender, recipient, amount);
    charities[recipient].donationCount += 1;

    Donation memory donation = Donation({
      from: msg.sender,
      recipient: recipient,
      amount: amount,
      token: token,
      timestamp: block.timestamp
    });
    donations[msg.sender].push(donation);
    donations[recipient].push(donation);
  }
}
