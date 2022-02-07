// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTAD1155 is ERC1155, Ownable{

    // Contract name
    string public name;
    string public uri;
    uint256 public constant PRICE = 0.1 * 10**18; // 0.1 MATIC
    mapping(uint256 => address) private adOwners;
    mapping(address => uint256) private adOwnerBalance;

    event Minted(address minter, address receiver, uint256 id, uint256 amount);

    constructor (string memory name_, string memory uri_) ERC1155(uri_) {
        name = name_;
        uri = uri;
    }

    function finalize() public onlyOwner {
        address payable addr = payable(address(owner()));
        selfdestruct(addr);
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function refundIfOver(uint256 amount, uint256 price) private {
        require(msg.value >= (price * amount), "Need to send more Matic.");
        if (msg.value > (price * amount)) {
            payable(msg.sender).transfer(msg.value - (price*amount));
        }
    }

    function mint(address account, uint256 id, uint256 amount) external payable {
        if (adOwners[id] == address(0)) {
            refundIfOver(PRICE, amount);
            adOwners[id] = msg.sender;
        }else{
            require(adOwners[id]==msg.sender, "Need to be AD Owner");
            refundIfOver(PRICE, amount);
        }
        adOwnerBalance[msg.sender] += PRICE*amount;
        _mint(account, id, amount, new bytes(0));
        emit Minted(msg.sender, account, id, amount);
    }

    function mintToMany(address[] calldata accounts, uint256 id, uint256 amount) external payable returns (uint mintedQty) {
        if (adOwners[id] == address(0)) {
            refundIfOver(PRICE, amount);
            adOwners[id] = msg.sender;
        }else{
            require(adOwners[id]==msg.sender, "Need to be AD Owner");
            refundIfOver(PRICE, amount);
        }
        adOwnerBalance[msg.sender] += PRICE*amount;
        uint mintCost = gasleft();
        _mint(accounts[0], id, amount, new bytes(0));
        emit Minted(msg.sender, accounts[0], id, amount);
        mintedQty = 1;
        mintCost = mintCost - gasleft();

        for (uint i = 1; i < accounts.length; i++) {
            if (gasleft() < mintCost) {
                return mintedQty;
            }
            _mint(accounts[i], id, amount, new bytes(0));
            emit Minted(msg.sender, accounts[i], id, amount);
            mintedQty++;
        }
        return mintedQty;
    }

    function burn(uint256 id, uint256 amount) external {
        require(balanceOf(msg.sender, id) >= amount, "Need to have enough NFT to burn");
        _burn(msg.sender, id, amount);
        address adOwner = adOwners[id];
        uint256 payAmount = PRICE*amount;
        require(adOwnerBalance[adOwner] > payAmount);
        adOwnerBalance[adOwner] -= payAmount;
        payable(msg.sender).transfer(payAmount);
    }

    function getBaseURI() public view returns (string memory) {
        return uri;
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