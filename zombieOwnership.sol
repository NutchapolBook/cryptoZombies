pragma solidity ^0.4.19;

import "./zombieattack.sol";
import "./erc721.sol";

contract ZombieOwnership is ZombieAttack, ERC721 {
    function balanceOf(address _owner) public view returns (uint256 _balance) {
        // 1. Return จำนวนของ `_owner` ที่ซอมบี้มี ตรงนี้
        return ownerZombieCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        // 2. Return owner ของ `_tokenId` ตรงนี้
        return zombieToOwner[_tokenId];
    }

    function transfer(address _to, uint256 _tokenId) public {}

    function approve(address _to, uint256 _tokenId) public {}

    function takeOwnership(uint256 _tokenId) public {}
}
