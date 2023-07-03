// test file for testing smart contract

const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { id } = require("ethers/lib/utils");

// comandline: npx hardhat test scripts/testTransactionToken.js --network sepolia

const stackingNFTPoolPath = "./deployment/StackingNFTPool.json";
const stackingTokenpollPath = "./deployment/StackingTokenPool.json";
const nftFilePath = "./deployment/WibuNFT.json";
const wibuTokenFilePath = "./deployment/wibuToken.json";

// Read data from an NFT . JSON file
const nftJsonData = fs.readFileSync(nftFilePath, "utf-8");
const nftData = JSON.parse(nftJsonData);
const NFTAddress = nftData.WibuNFTAddress;

// Read data from WibuToken's JSON file
const wibuTokenJsonData = fs.readFileSync(wibuTokenFilePath, "utf-8");
const wibuTokenData = JSON.parse(wibuTokenJsonData);
const tokenAddress = wibuTokenData.tokenAddress;

// Read data from stackingNFTPool JSON file
const stackingNFTPoolJsonData = fs.readFileSync(stackingNFTPoolPath, "utf-8");
const stackingNFTPoolData = JSON.parse(stackingNFTPoolJsonData);
const stackingNFTPoolPathAddress = stackingNFTPoolData.stackingNFTPoolAddress;

// Read data from stackingTokenPool JSON file
const stackingTokenPoolJsonData = fs.readFileSync(
  stackingTokenpollPath,
  "utf-8"
);
const stackingTokenPoolData = JSON.parse(stackingTokenPoolJsonData);
const stackingTokenPoolPathAddress = stackingTokenPoolData.stackingTokenAddress;

// Using values of variables
console.log("tokenAddress:", tokenAddress);
console.log("NFTAddress:", NFTAddress);
console.log("stackingNFTPoolPathAddress:", stackingNFTPoolPathAddress);
console.log("stackingTokenPoolPathAddress:", stackingTokenPoolPathAddress);

describe("WibuToken", function () {
  // get the contract instance
  let wibuToken;
  let owner;
  const addres_recipient = stackingNFTPoolPathAddress;
  beforeEach(async function () {
    const WibuToken = await ethers.getContractFactory("WibuToken");
    wibuToken = await WibuToken.attach(tokenAddress);
    console.log("wibu token address: ", wibuToken.address);
    [owner] = await ethers.getSigners();
  });
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await wibuToken.owner()).to.equal(owner.address);
      console.log("total supply: ", await wibuToken.totalSupply());
    });
  });
  describe("Transactions", function () {
    it("transfer 1/2 size tokens from owner to pool", async function () {
      console.log("owner: ", owner.address);
      console.log("addres_recipient: ", addres_recipient);
      console.log("before transfer");
      console.log("owner balance: ", await wibuToken.balanceOf(owner.address));
      console.log(
        "addres_recipient balance: ",
        await wibuToken.balanceOf(addres_recipient)
      );
      const size = await wibuToken.totalSupply();
      const halfSize = size.div(2);
      await wibuToken.transfer(addres_recipient, halfSize);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      console.log("after transfer");
      console.log("owner balance: ", await wibuToken.balanceOf(owner.address));
      console.log(
        "addr1 balance: ",
        await wibuToken.balanceOf(addres_recipient)
      );
    });
  });
});
