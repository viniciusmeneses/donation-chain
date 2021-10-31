// SPDX-License-Identifier: MIT
pragma solidity >=0.6.4 <0.9.0;

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
    EDUCATION,
    HEALTHCARE,
    ENVIRONMENT
  }

  struct Charity {
    string name;
    string description;
    Cause cause;
    string website;
  }

  address public owner;

  mapping(address => Charity) public charities;
  address[] private recipients;

  constructor() {
    owner = msg.sender;
  }

  modifier existCharity(address addr) {
    require(bytes(charities[addr].name).length > 0, "Charity not exists");
    _;
  }

  modifier notExistCharity(address addr) {
    require(bytes(charities[msg.sender].name).length == 0, "Charity already exists");
    _;
  }

  modifier isCharityValid(address recipient, string memory name, string memory description) {
    require(recipient == address(recipient), "Charity address is invalid");
    require(bytes(name).length > 0, "Charity name is blank");
    require(bytes(description).length > 0, "Charity description is blank");
    _;
  }

  modifier isOwner() {
    require(msg.sender == owner, "Sender isn't contract owner");
    _;
  }

  function createCharity(
    address recipient,
    string memory name,
    string memory description,
    Cause cause,
    string memory website
  ) public isOwner() notExistCharity(recipient) isCharityValid(recipient, name, description) {
    charities[recipient] = Charity({
      name: name,
      description: description,
      cause: cause,
      website: website
    });

    recipients.push(recipient);
  }

  function updateCharity(
    address recipient,
    string memory name,
    string memory description,
    Cause cause,
    string memory website
  ) public isOwner() existCharity(recipient) isCharityValid(recipient, name, description) {
    charities[recipient].name = name;
    charities[recipient].description = description;
    charities[recipient].cause = cause;
    charities[recipient].website = website;
  }

  function deleteCharity(address recipient) public isOwner() existCharity(recipient) {
    delete charities[recipient];
    bool deleted = false;

    for (uint i = 0; i < recipients.length; i++) {
      if (recipients[i] == recipient) deleted = true;
      recipients[i] = recipients[i + (deleted ? 1 : 0)];
    }

    recipients.pop();
  }

  function getRecipients() public view returns(address[] memory) {
    return recipients;
  }

  function donate(address payable recipient) public payable existCharity(recipient) {
    recipient.transfer(msg.value);
  }

  function donateToken(address recipient, address token, uint256 amount) public existCharity(recipient) {
    IBEP20 tokenContract = IBEP20(token);

    require(amount > 0, "You need to donate at least some amount");
    uint256 allowance = tokenContract.allowance(msg.sender, address(this));
    require(allowance >= amount, "Check the token allowance");

    tokenContract.transferFrom(msg.sender, recipient, amount);
  }
}
