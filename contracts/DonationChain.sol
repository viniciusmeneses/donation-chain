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
  enum Category {
    ANIMALS,
    HEALTHCARE,
    ENVIRONMENT,
    SOCIAL_ASSISTANCE
  }

  struct Charity {
    string name;
    string description;
    Category category;
    string website;
  }

  mapping(address => Charity) public charities;
  address[] addresses;

  modifier charityExists(address addr) {
    require(bytes(charities[addr].name).length > 0, "Charity not exists");
    _;
  }

  modifier charityNotExists(address addr) {
    require(bytes(charities[msg.sender].name).length == 0, "Charity already exists");
    _;
  }
  
  function createCharity(string memory name, string memory description, Category category, string memory website) public charityNotExists(msg.sender) {
    charities[msg.sender] = Charity({
      name: name,
      description: description,
      category: category,
      website: website
    });

    addresses.push(msg.sender);
  }

  function updateCharity(string memory name, string memory description, Category category, string memory website) public charityExists(msg.sender) {
    charities[msg.sender].name = name;
    charities[msg.sender].description = description;
    charities[msg.sender].category = category;
    charities[msg.sender].website = website;
  }
  
  function deleteCharity() public charityExists(msg.sender) {
    delete charities[msg.sender];
    bool deleted = false;

    for (uint i = 0; i < addresses.length; i++) {
      if (addresses[i] == msg.sender) deleted = true;
      addresses[i] = addresses[i + (deleted ? 1 : 0)];
    }

    addresses.pop();
  }

  function getAddresses() public view returns(address[] memory) {
    return addresses;
  }

  function donate(address payable recipient) public payable charityExists(recipient) {
    recipient.transfer(msg.value);
  }

  function donateToken(address recipient, address token, uint256 amount) public charityExists(recipient) {
    IBEP20 tokenContract = IBEP20(token);

    require(amount > 0, "You need to donate at least some amount");
    uint256 allowance = tokenContract.allowance(msg.sender, address(this));
    require(allowance >= amount, "Check the token allowance");

    tokenContract.transferFrom(msg.sender, recipient, amount);
  }
}
