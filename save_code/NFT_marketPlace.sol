pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./NFT.sol";
import "./WibuToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./NFT_marketPlace.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT_marketPlace {
    address public owner;
    uint256 public totalNFTs;
    WibuNFT public wibuNFT;
    WibuToken public wibuToken;

    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }
    event TokenListedSuccess(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );
    mapping(uint256 => ListedToken) public idToListedToken;

    constructor(address _wibuNFTAddress, address _wibuTokenAddress) {
        owner = msg.sender;
        wibuNFT = WibuNFT(_wibuNFTAddress);
        wibuToken = WibuToken(_wibuTokenAddress);
    }

    function get_owner() public view returns (address) {
        return owner;
    }

    function get_wibuNFT() public view returns (address) {
        return address(wibuNFT);
    }

    function get_wibuToken() public view returns (address) {
        return address(wibuToken);
    }

    function getListedTokenForId(
        uint256 _tokenId
    ) public view returns (ListedToken memory) {
        return idToListedToken[_tokenId];
    }

    function approveNft(uint256 _tokenId) public {
        wibuNFT.approve(owner, _tokenId);
    }

    function ListedNFT(
        uint256 _tokenId,
        uint256 _price
    ) public returns (ListedToken memory) {
        // require(msg.sender == owner, "You are not the owner of this contract");
        // uint256 tokenId = wibuNFT.createNFT(_NFT_url);
        totalNFTs++;
        // wibuNFT.approveNFT(_tokenId);
        idToListedToken[_tokenId] = ListedToken(
            _tokenId,
            payable(msg.sender),
            payable(msg.sender),
            _price,
            true
        );
        emit TokenListedSuccess(_tokenId, msg.sender, msg.sender, _price, true);

        return idToListedToken[_tokenId];
    }

    function getAllListedTokens() public view returns (ListedToken[] memory) {
        ListedToken[] memory listedTokens = new ListedToken[](totalNFTs);
        uint256 counter = 0;
        for (uint256 i = 1; i <= totalNFTs; i++) {
            if (idToListedToken[i].currentlyListed) {
                listedTokens[counter] = idToListedToken[i];
                counter++;
            }
        }
        return listedTokens;
    }

    function buyNft(uint256 _tokenId) public payable {
        ListedToken memory listedToken = idToListedToken[_tokenId];
        address seller = listedToken.seller;
        uint256 price = listedToken.price;
        require(
            wibuToken.transferFrom(msg.sender, seller, price),
            "Token transfer failed"
        );
        wibuNFT.transferFrom(seller, msg.sender, _tokenId);
        listedToken.owner = payable(msg.sender);
        listedToken.seller = payable(msg.sender);
        listedToken.currentlyListed = false;
        idToListedToken[_tokenId] = listedToken;
    }

    function removeFromMarket(uint256 _tokenId) public {
        ListedToken storage listedToken = idToListedToken[_tokenId];

        require(
            listedToken.seller == msg.sender,
            "You are not the seller of this token"
        );

        delete idToListedToken[_tokenId];

        // Thực hiện các hành động khác sau khi xoá thành công khỏi thị trường
    }

    // check all my NFTs
    function getMyNFTs() public view returns (ListedToken[] memory) {
        ListedToken[] memory listedTokens = new ListedToken[](totalNFTs);
        uint256 counter = 0;
        for (uint256 i = 1; i <= totalNFTs; i++) {
            if (idToListedToken[i].owner == msg.sender) {
                listedTokens[counter] = idToListedToken[i];
                counter++;
            }
        }
        return listedTokens;
    }

    function getAllNFTs() public view returns (ListedToken[] memory) {
        ListedToken[] memory listedTokens = new ListedToken[](totalNFTs);
        uint256 counter = 0;
        for (uint256 i = 1; i <= totalNFTs; i++) {
            listedTokens[counter] = idToListedToken[i];
            counter++;
        }
        return listedTokens;
    }

    function transctionNft(address _to, uint256 _tokenId) public {
        ListedToken memory listedToken = idToListedToken[_tokenId];
        require(
            listedToken.owner == msg.sender,
            "You are not the owner of this NFT"
        );
        wibuNFT.transferFrom(msg.sender, _to, _tokenId);
        listedToken.owner = payable(_to);
        listedToken.seller = payable(_to);
        idToListedToken[_tokenId] = listedToken;
    }

    function editPriceNft(uint256 _tokenId, uint256 _price) public {
        ListedToken memory listedToken = idToListedToken[_tokenId];
        require(
            listedToken.owner == msg.sender,
            "You are not the owner of this NFT"
        );
        listedToken.price = _price;
        idToListedToken[_tokenId] = listedToken;
    }
}
