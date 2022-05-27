// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract NFTAD1155 is ERC1155, Ownable, VRFConsumerBase{

    bytes32 public keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    uint256 public fee = 0.3 * 10**18; // 0.1 LINK
    uint256 public randomResult;

        // ** New mapping to store requests
    mapping(bytes32 => address) public requestIdToAddress;
    mapping(address => uint) public random;

    // Contract name
    string public name;
    string public uri;
    uint256 public constant PRICE = 1 * 10**17; // 0.1 MATIC
    uint256  awardID = 0;
    mapping(uint256 => address) private adOwners;
    mapping(address => uint256) private adOwnerBalance;
    mapping(address => uint256) public addressRandomHash;

    event Minted(address minter, address receiver, uint256 id, uint256 amount);

 // 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed, // VRF Coordinator
            // 0x326C977E6efc84E512bB9C30f76E30c160eD06FB // LINK Token
    constructor(string memory name_, string memory uri_)
        ERC1155(uri_)
        VRFConsumerBase(0x6168499c0cFfCaCD319c818142124B7A15E857ab,0x01BE23585060835E02B77ef475b0Cc51aA1e0709)
    {
        
    }

    function finalize() public onlyOwner {
        address payable addr = payable(address(owner()));
        selfdestruct(addr);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function refundIfOver(uint256 amount, uint256 price) private {
        require(msg.value >= (price * amount), "Need to send more Matic.");
        if (msg.value > (price * amount)) {
            payable(msg.sender).transfer(msg.value - (price * amount));
        }
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount
    ) external payable {
        if (adOwners[id] == address(0)) {
            refundIfOver(PRICE, amount);
            adOwners[id] = msg.sender;
        } else {
            require(adOwners[id] == msg.sender, "Need to be AD Owner");
            refundIfOver(PRICE, amount);
        }
        adOwnerBalance[msg.sender] += PRICE * amount;
        _mint(account, id, amount, new bytes(0));
        emit Minted(msg.sender, account, id, amount);
    }

  function getRandomNumber() public {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        // ** Store the random request in requestID
        bytes32 requestId = requestRandomness(keyHash, fee);
        // ** Map requestId to the sender's address
        requestIdToAddress[requestId] = msg.sender;
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        // ** Find the sender address based on the request
        address _sender = requestIdToAddress[requestId];
        // ** Update sender's mapping for randomness
        random[_sender] = randomness;
    }

    function mintToMany(
        address[] calldata accounts,
        uint256 id,
        uint256 amount
    ) external payable returns (uint256 mintedQty) {
        if (adOwners[id] == address(0)) {
            refundIfOver(PRICE, amount * accounts.length);
            adOwners[id] = msg.sender;
        } else {
            require(adOwners[id] == msg.sender, "Need to be AD Owner");
            refundIfOver(PRICE, amount * accounts.length);
        }

        adOwnerBalance[msg.sender] += PRICE * amount * accounts.length;
        uint256 mintCost = gasleft();
        _mint(accounts[0], id, amount, new bytes(0));
        emit Minted(msg.sender, accounts[0], id, amount);
        mintedQty = 1;
        mintCost = mintCost - gasleft();

        for (uint256 i = 1; i < accounts.length; i++) {
            if (gasleft() < mintCost) {
                return mintedQty;
            }
            _mint(accounts[i], id, amount, new bytes(0));
            emit Minted(msg.sender, accounts[i], id, amount);
            mintedQty++;
        }
        return mintedQty;
    }

    function burn(uint256 id, uint256 amount, uint256 randomNum) external {
        require(
            balanceOf(msg.sender, id) >= amount,
            "Need to have enough NFT to burn"
        );
        require(randomNum == randomResult, "Wrong random number");
        _burn(msg.sender, id, amount);
        address adOwner = adOwners[id];
        uint256 payAmount = PRICE * amount;
        require(
            adOwnerBalance[adOwner] >= payAmount,
            "AdOwner have no enough balance to Pay"
        );
        adOwnerBalance[adOwner] -= payAmount;
        payable(msg.sender).transfer(payAmount);
    }

    function getBaseURI() public view returns (string memory) {
        return uri;
    }

    function getRandomResult(address addr)  public view returns (uint256) {
        return random[addr];
    }

    /**
     * @dev Function to set the URI for all NFT IDs
     */
    function setBaseURI(string calldata _uri) external onlyOwner {
        _setURI(_uri);
    }

    function getTotalBalance() public view returns (uint256) {
        uint256 balance = address(this).balance;
        return balance;
    }

    function getADOwner(uint256 id) public view returns (address) {
        address ADOwner = adOwners[id];
        return ADOwner;
    }

    function getADOwnerBalance(address adOwner) public view returns (uint256) {
        uint256 balance = adOwnerBalance[adOwner];
        return balance;
    }
}
