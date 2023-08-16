pragma solidity ^0.8.21;
import "./ownable.sol";
import "./safemath.sol";

contract ZombieFactory is Ownable {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    event NewZombie(uint zombieId, bytes32 name, uint dna);

    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;
    uint cooldownTime = 1 days;

    struct Zombie {
        bytes32 name;
        uint dna;
        uint32 level;
        uint32 readyTime;
        uint16 winCount;
        uint16 lossCount;
    }

    Zombie[] public zombies;

    mapping(uint => address) public zombieToOwner;
    mapping(address => uint) ownerZombieCount;

    function _createZombie(bytes32 _name, uint _dna) internal {
        // เราเลือกที่จะไม่ป้องกันปัญหาของปี 2038We ... ดังนั้นจึงไม่จำเป็น
        // ที่จะต้องกังวลเกี่ยวกับ overflows ภายใน readyTime  ;)
        zombies.push(Zombie(_name, _dna, 1, uint32(block.timestamp + cooldownTime), 0, 0));
        uint id = uint(zombies.length);
        zombieToOwner[id] = msg.sender;
        ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender] + 1;
        emit NewZombie(id, _name, _dna);
        id++;
    }

    function _generateRandomDna(bytes32 _str) private view returns (uint) {
        uint rand = uint(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
    }

    function createRandomZombie(bytes32 _name) public {
        require(ownerZombieCount[msg.sender] == 0);
        uint randDna = _generateRandomDna(_name);
        _createZombie(_name, randDna);
    }
}
