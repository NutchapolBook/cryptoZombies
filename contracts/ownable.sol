pragma solidity ^0.8.21;

/**
 * @title Ownable
 * @dev Ownable contract มี address ของ owner และได้มีฟังก์ชั่นที่ไว้ใช้ควบคุมการยืนยันตัวตนขั้นพื้นฐานเอาไว้
 * สิ่งนี้บ่งบอกถึงการนำ "user permissions"มาใช้นั่นเอง
 */
contract Ownable {
    address payable public owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev constructor ประเภท ownable ได้ตั้งค่า `owner` ดั้งเดิมของ contract ไปยังบัญชีของผู้ส่ง
     * (sender account)
     */
    constructor() {
        owner = payable(address(msg.sender));
    }

    /**
     * @dev Throw หากมีการเรียกโดยบัญชีอื่นที่ไม่ใช่ของ owner
     */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev อนุญาตให้ owner คนปัจจุบันสามารถโอนการควบคุม contract ไปยัง newOwnerได้
     * @param newOwner คือ address ที่จะเอาไว้รับ ownership ที่ถูกโอนมาให้
     */
    function transferOwnership(
        address payable newOwner
    ) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
