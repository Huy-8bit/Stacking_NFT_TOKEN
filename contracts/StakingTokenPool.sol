pragma solidity ^0.8.0;
import "./WibuNFT.sol";
import "./WibuToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingTokenPool {
    address public owner;
    WibuNFT public wibuNFT;
    WibuToken public wibuToken;

    mapping(address => ListedToken) public stakings;

    struct ListedToken {
        uint256 amount;
        address payable owner;
        uint256 stackingTime;
    }

    event TokenStackedSuccess(
        uint256 indexed amount,
        address owner,
        uint256 stackingTime
    );

    constructor(address _wibuNFTAddress, address _wibuTokenAddress) {
        owner = msg.sender;
        wibuNFT = WibuNFT(_wibuNFTAddress);
        wibuToken = WibuToken(_wibuTokenAddress);
    }

    function mintNFT(string memory _NFT_url) public returns (uint256) {
        return wibuNFT.createNFT(_NFT_url);
    }

    function StackingToken(uint256 _amount) public returns (uint256) {
        require(
            wibuToken.balanceOf(msg.sender) >= _amount,
            "You don't have enough balance to make a transaction"
        );
        wibuToken.transferFrom(msg.sender, address(this), _amount);
        stakings[msg.sender] = ListedToken(
            _amount,
            payable(msg.sender),
            block.number
        );
        emit TokenStackedSuccess(_amount, msg.sender, block.number);
        return block.number;
    }

    function get_owner() public view returns (address) {
        return owner;
    }

    function claimReward() public {
        require(
            block.number >= stakings[msg.sender].stackingTime + 1,
            "Minimum stacking time not reached"
        );

        wibuToken.transfer(msg.sender, 100);
        uint256[] memory listNFT = wibuNFT.getAllMyNft();
        wibuNFT.transferFrom(
            address(this),
            msg.sender,
            listNFT[listNFT.length - 1]
        );
        delete stakings[msg.sender];
    }
}
