// SPDX-License-Identifier: MIT

/*
The WibuNFT contract creates the WIBU NFT (built on ERC721) with the following attributes:
- Additional NFTs can be created using the createNFT function
- NFTs can be transferred using the transferNFT function
- NFTs can be transferred using the transferFrom function (extended from ERC721)
- NFTs can be approved using the approveNFT function
- NFTs can be retrieved using the getAllMyNft function
- NFTs can be retrieved using the getNFTURI function

*/

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./WibuToken.sol";

contract WibuNFT is ERC721URIStorage {
    using Counters for Counters.Counter; // using the Counters library from OpenZeppelin (Count number, assign id value to nft)
    Counters.Counter private _tokenIds; // tokenid counter
    Counters.Counter private _itemsSold;
    address public owner; // address of the contract creator
    string public NFT_url; // url of the NFT

    mapping(uint256 => uint256) public NFT_price;

    /*
        Constructor of the WibuNFT contract
    */
    constructor() ERC721("Wibu NFT", "WIBU") {
        owner = msg.sender;
    }

    /* 
        Create a new NFT with the specified url and mint it to the contract creator
        @param _NFT_url: url of the NFT
        @return newItemId: id of the newly created NFT
    */
    function createNFT(string memory _NFT_url) public returns (uint256) {
        _tokenIds.increment(); // increment the tokenid counter
        uint256 newItemId = _tokenIds.current(); // assign the current tokenid to newItemId
        _mint(msg.sender, newItemId); // mint the NFT with  to the contract creator
        _setTokenURI(newItemId, _NFT_url); // set url for the NFT
        return newItemId;
    }

    /*
        Approve the NFT with the specified id
        @param _tokenId: id of the NFT
        @param _to: address of the approved user
    */
    function approveNFT(uint256 _tokenId) public {
        approve(owner, _tokenId); // approve the NFT to the contract creator
    }

    /*
        Transfer the NFT with the specified id to the specified address
        @param _to: address of the recipient
        @param _tokenId: id of the NFT
    */
    function transferNFT(address _to, uint256 _tokenId) public {
        safeTransferFrom(msg.sender, _to, _tokenId); // transfer the NFT to the specified address
    }

    /*
        Retrieve all NFTs owned by the caller
        @return result: array of NFT ids
    */
    function getAllMyNft() public view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](_tokenIds.current()); // create an array of NFT ids
        uint256 counter = 0; // counter for the array
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (ownerOf(i) == msg.sender) {
                // check if the NFT with the specified id is owned by the caller
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function getNFTURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }
}
