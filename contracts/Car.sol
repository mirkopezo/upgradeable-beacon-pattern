pragma solidity 0.8.11;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Car is OwnableUpgradeable {
    string public brand;
    uint256 public fuelLevel;
    uint256 public mileage;

    function initialize(
        string memory _brand,
        uint256 _fuelLevel,
        uint256 _mileage
    ) public initializer {
        __Ownable_init_unchained();

        brand = _brand;
        fuelLevel = _fuelLevel;
        mileage = _mileage;
    }

    function drive() public onlyOwner {
        fuelLevel--;
        mileage += 10;
    }
}
