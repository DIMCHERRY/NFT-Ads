// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTAD1155 is ERC1155, Ownable{

    // Contract name
    string public name;
    string public uri;

    constructor (string memory name_, string memory uri_) ERC1155(uri_) {
        name = name_;
        uri = uri;
    }

    function mint(address account, uint256 id, uint256 amount) external onlyOwner {
        _mint(account, id, amount, new bytes(0));
    }

    function mintToMany(address[] calldata accounts, uint256 id, uint256 amount) external onlyOwner returns (uint mintedQty) {
        uint mintCost = gasleft();
        _mint(accounts[0], id, amount, new bytes(0));
        mintedQty = 1;
        mintCost = mintCost - gasleft();

        for (uint i = 1; i < accounts.length; i++) {
            if (gasleft() < mintCost) {
                return mintedQty;
            }
            _mint(accounts[i], id, amount, new bytes(0));
            mintedQty++;
        }

        return mintedQty;
    }

    function burn(address account, uint256 id, uint256 amount) external onlyOwner {
        _burn(account, id, amount);
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
}