pragma solidity ^0.8.21;

import "./zombieattack.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title A contract for ZombieOwnership
/// @author Nutchapol Poonkasem
/// @notice contract for manage zombie ownership
contract ZombieOwnership is
    ZombieAttack,
    ERC721("ZombieOwnership", "ZombieOwnershipSymbol")
{
    mapping(uint => address) zombieApprovals;

    function balanceOf(
        address _owner
    ) public view override returns (uint256 _balance) {
        // 1. Return จำนวนของ `_owner` ที่ซอมบี้มี ตรงนี้
        return ownerZombieCount[_owner];
    }

    function ownerOf(
        uint256 _tokenId
    ) public view override returns (address _owner) {
        // 2. Return owner ของ `_tokenId` ตรงนี้
        return zombieToOwner[_tokenId];
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal virtual override {
        ownerZombieCount[_to] = ownerZombieCount[_to] + 1;
        ownerZombieCount[_from] = ownerZombieCount[_from] + 1;
        zombieToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transfer(
        address _to,
        uint256 _tokenId
    ) public onlyOwnerOf(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(
        address _to,
        uint256 _tokenId
    ) public override onlyOwnerOf(_tokenId) {
        zombieApprovals[_tokenId] = _to;
        emit Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        require(zombieApprovals[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }
}
