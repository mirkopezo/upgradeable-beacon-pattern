pragma solidity 0.8.11;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract CarV2 is OwnableUpgradeable {
    string public brand;
    uint256 public fuelLevel;
    uint256 public mileage;
    /* --- New state variable added --- */
    uint256 public refillCounter;

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

    /* --- New function added --- */

    function refillFuel() public onlyOwner {
        fuelLevel += 10;
        refillCounter++;
    }
}
