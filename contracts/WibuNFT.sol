pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./WibuToken.sol";

contract WibuNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    address public owner;
    string public NFT_url;

    mapping(uint256 => uint256) public NFT_price;

    constructor() ERC721("Wibu NFT", "WIBU") {
        owner = msg.sender;
    }

    function createNFT(string memory _NFT_url) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _NFT_url);

        return newItemId;
    }

    function approveNFT(uint256 _tokenId) public {
        approve(owner, _tokenId);
    }

    function getAllMyNft() public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](_tokenIds.current());
        uint256 counter = 0;
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (ownerOf(i) == msg.sender) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function getNFTURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function transferNFT(address _to, uint256 _tokenId) public {
        safeTransferFrom(msg.sender, _to, _tokenId);
    }
}
