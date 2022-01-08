pragma solidity 0.8.11;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Car.sol";

contract CarFactory {
    using Counters for Counters.Counter;

    Counters.Counter private _carIds;
    IBeacon beacon;

    mapping(uint256 => address) private carIdToAddress;

    constructor(IBeacon _beacon) {
        beacon = _beacon;
    }

    function buildCar(
        string memory _brand,
        uint256 _fuelLevel,
        uint256 _mileage
    ) public {
        bytes memory data = abi.encodeWithSelector(
            Car(address(0)).initialize.selector,
            _brand,
            _fuelLevel,
            _mileage
        );

        BeaconProxy carProxy = new BeaconProxy(address(beacon), data);

        Car car = Car(address(carProxy));
        car.transferOwnership(msg.sender);

        _carIds.increment();
        uint256 newCarId = _carIds.current();
        carIdToAddress[newCarId] = address(carProxy);
    }

    /* --- Getters --- */

    function getCarAddress(uint256 _carId) external view returns (address) {
        return carIdToAddress[_carId];
    }

    function getImplementationAddress() external view returns (address) {
        return beacon.implementation();
    }

    function getBeaconAddress() external view returns (address) {
        return address(beacon);
    }
}
