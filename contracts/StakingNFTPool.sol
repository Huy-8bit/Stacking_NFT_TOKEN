pragma solidity ^0.8.0;
import "./WibuNFT.sol";
import "./WibuToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingNFTPool {
    address public owner;
    uint256 public totalNFTs;
    WibuNFT public wibuNFT;
    WibuToken public wibuToken;

    mapping(uint256 => ListedNFT) public staking;

    struct ListedNFT {
        uint256 nftId;
        address payable owner;
        uint256 stackingBlock;
    }

    event NFTStackedSuccess(
        uint256 indexed nftId,
        address owner,
        uint256 stackingBlock
    );

    constructor(address _wibuNFTAddress, address _wibuTokenAddress) {
        owner = msg.sender;
        wibuNFT = WibuNFT(_wibuNFTAddress);
        wibuToken = WibuToken(_wibuTokenAddress);
    }

    function stackNFT(uint256 _nftId) public returns (uint256) {
        require(
            wibuNFT.ownerOf(_nftId) == msg.sender,
            "You are not the owner of this NFT"
        );
        totalNFTs++;
        wibuNFT.transferFrom(msg.sender, address(this), _nftId);
        staking[_nftId] = ListedNFT(_nftId, payable(msg.sender), block.number);
        emit NFTStackedSuccess(_nftId, msg.sender, block.number);
        return block.number;
    }

    function get_owner() public view returns (address) {
        return owner;
    }

    function checkBlock(uint256 _nftId) public view returns (uint256) {
        return staking[_nftId].stackingBlock;
    }

    function checkTime(uint256 _nftId) public view returns (uint256) {
        return block.number - staking[_nftId].stackingBlock;
    }

    function claimReward(uint256 _nftId) public {
        require(
            staking[_nftId].owner == msg.sender,
            "You are not the owner of this NFT"
        );
        require(
            block.number >= staking[_nftId].stackingBlock + 24, // hold for 6 minutes
            "Minimum stacking time not reached"
        );
        require(staking[_nftId].nftId != 0, "You have not stacked any NFT");
        wibuToken.transfer(msg.sender, 10_000 * 10 ** uint256(18));
        wibuNFT.transferFrom(address(this), msg.sender, staking[_nftId].nftId);

        delete staking[_nftId];
    }

    function claimToken(uint256 _nftId) public {
        require(
            staking[_nftId].owner == msg.sender,
            "You are not the owner of this NFT"
        );

        require(
            block.number >= staking[_nftId].stackingBlock + 24, // hold for 6 minutes
            "Minimum stacking time not reached"
        );
        require(staking[_nftId].nftId != 0, "You have not stacked any NFT");
        wibuToken.transfer(msg.sender, 10_000 * 10 ** uint256(18));
        staking[_nftId].stackingBlock = block.number;
    }

    function rewardNFT(uint256 _nftId) public {
        require(
            staking[_nftId].owner == msg.sender,
            "You are not the owner of this NFT"
        );
        require(staking[_nftId].nftId != 0, "You have not stacked any NFT");
        wibuNFT.transferFrom(address(this), msg.sender, staking[_nftId].nftId);
        delete staking[_nftId];
    }
}
