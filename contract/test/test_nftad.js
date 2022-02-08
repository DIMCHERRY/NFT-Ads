const { ethers, waffle } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("NFTAD", function () {
  let myContract;
  let owner,addr1,addr2;
  console.log("test start");
  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("YourContract",  function () {
    it("Should deploy YourContract", async function () {
      const YourContract = await ethers.getContractFactory("NFTAD1155");

      myContract = await YourContract.deploy("NFTAD", "https://nftads.info/api/tokens/{id}");
    });

    describe("mint()", function () {
      it("Should be able to mint a new nft", async function () {
        const options = {
            value: ethers.utils.parseEther("0.2"),
            gasLimit: 1000000
        };
        const mintTx = await myContract.mint(addr1.address, 1, 2, options);
        await mintTx.wait();
        expect(await myContract.balanceOf(addr1.address, 1)).to.equal(2);
      });
      it("Should have 0.2 balance", async function () {
        expect(await myContract.getADOwnerBalance(owner.address)).to.equal(ethers.utils.parseEther("0.2"));
      });
      it("Should burn success", async function () {
        const burnTx = await myContract.connect(addr1).burn(1, 2);
        await burnTx.wait();
        expect(await myContract.balanceOf(addr1.address, 1)).to.equal(0);
        expect(await myContract.getADOwnerBalance(owner.address)).to.equal(0);
        const balance = await waffle.provider.getBalance(addr1.address);
        console.log(balance);
        expect(balance).to.equal(ethers.utils.parseEther("10000.2"));
      });
    });
  });
});