pragma solidity ^0.8.0;
import "./WibuNFT.sol";
import "./WibuToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StackingNFTPool {
    address public owner;
    uint256 public totalNFTs;
    WibuNFT public wibuNFT;
    WibuToken public wibuToken;

    mapping(uint256 => ListedNFT) public stackings;

    struct ListedNFT {
        uint256 nftId;
        address payable owner;
        uint256 stackingTime;
    }

    event NFTStackedSuccess(
        uint256 indexed nftId,
        address owner,
        uint256 stackingTime
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
        stackings[_nftId] = ListedNFT(
            _nftId,
            payable(msg.sender),
            block.timestamp
        );
        emit NFTStackedSuccess(_nftId, msg.sender, block.timestamp);
        return block.timestamp;
    }

    function get_owner() public view returns (address) {
        return owner;
    }

    function checkTime(uint256 _nftId) public view returns (uint256) {
        return stackings[_nftId].stackingTime;
    }

    function claimReward(uint256 _nftId) public {
        require(
            block.timestamp >= stackings[_nftId].stackingTime + 24,
            "Minimum stacking time not reached"
        );
        require(stackings[_nftId].nftId != 0, "You have not stacked any NFT");
        wibuToken.transfer(msg.sender, 10_000 * 10 ** uint256(18));
        wibuNFT.transferFrom(
            address(this),
            msg.sender,
            stackings[_nftId].nftId
        );

        delete stackings[_nftId];
    }
}
