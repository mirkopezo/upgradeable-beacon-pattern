const { ethers, upgrades } = require("hardhat");

// Beacon address on Rinkeby network
const BEACON_ADDRESS = "0x73d3018576f4A181c26Aa4bD256305bB167f693f";

async function main() {
  const CarV2 = await ethers.getContractFactory("CarV2");

  await upgrades.upgradeBeacon(BEACON_ADDRESS, CarV2);
  console.log("Beacon is upgraded!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
