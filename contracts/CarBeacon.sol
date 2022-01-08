pragma solidity 0.8.11;

import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";

contract CarBeacon is UpgradeableBeacon {
    constructor(address _implementation) UpgradeableBeacon(_implementation) {}
}
