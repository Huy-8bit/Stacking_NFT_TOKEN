// test file for testing smart contract

const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { id } = require("ethers/lib/utils");

// comandline: npx hardhat test scripts/testTransactionToken.js --network sepolia

const stakingNFTPoolPath = "./deployment/StakingNFTPool.json";
const wibuTokenFilePath = "./deployment/wibuToken.json";
const stakingTokenpollPath = "./deployment/StakingTokenPool.json";
// Read data from WibuToken's JSON file
const wibuTokenJsonData = fs.readFileSync(wibuTokenFilePath, "utf-8");
const wibuTokenData = JSON.parse(wibuTokenJsonData);
const tokenAddress = wibuTokenData.tokenAddress;

// Read data from stakingNFTPool JSON file
const stakingNFTPoolJsonData = fs.readFileSync(stakingNFTPoolPath, "utf-8");
const stakingNFTPoolData = JSON.parse(stakingNFTPoolJsonData);
const stakingNFTPoolPathAddress = stakingNFTPoolData.stakingNFTPoolAddress;

// Read data from stakingTokenPool JSON file
const stakingTokenPoolJsonData = fs.readFileSync(stakingTokenpollPath, "utf-8");
const stakingTokenPoolData = JSON.parse(stakingTokenPoolJsonData);
const stakingTokenPoolPathAddress = stakingTokenPoolData.stakingTokenAddress;

// Using values of variables
console.log("tokenAddress:", tokenAddress);
console.log("stakingNFTPoolPathAddress:", stakingNFTPoolPathAddress);

describe("WibuToken", function () {
  // get the contract instance
  let wibuToken;
  let owner;
  let addres_recipient;
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
    it("transfer 1/2 size tokens from owner to staking nft pool", async function () {
      addres_recipient = stakingNFTPoolPathAddress;
      console.log("owner: ", owner.address);
      console.log("addres_recipient: ", addres_recipient);
      console.log("before transfer");
      console.log("owner balance: ", await wibuToken.balanceOf(owner.address));
      console.log(
        "addres_recipient balance: ",
        await wibuToken.balanceOf(addres_recipient)
      );
      const size = await wibuToken.totalSupply();
      const halfSize = size.div(4);
      await wibuToken.transfer(addres_recipient, halfSize);
      await new Promise((resolve) => setTimeout(resolve, 20000));
      console.log("after transfer");
      console.log("owner balance: ", await wibuToken.balanceOf(owner.address));
      console.log(
        "addr1 balance: ",
        await wibuToken.balanceOf(addres_recipient)
      );
    });
    it("transfer 1/2 size tokens from owner to staking token pool", async function () {
      addres_recipient = stakingTokenPoolPathAddress;
      console.log("owner: ", owner.address);
      console.log("addres_recipient: ", addres_recipient);
      console.log("before transfer");
      console.log("owner balance: ", await wibuToken.balanceOf(owner.address));
      console.log(
        "addres_recipient balance: ",
        await wibuToken.balanceOf(addres_recipient)
      );
      const size = await wibuToken.totalSupply();
      const halfSize = size.div(4);
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
