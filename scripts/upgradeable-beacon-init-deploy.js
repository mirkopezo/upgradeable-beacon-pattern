const { ethers, upgrades } = require("hardhat");

async function main() {
  const Car = await ethers.getContractFactory("Car");

  const carBeacon = await upgrades.deployBeacon(Car);
  await carBeacon.deployed();
  console.log("Beacon deployed to:", carBeacon.address);

  const CarFactory = await ethers.getContractFactory("CarFactory");
  const carFactory = await CarFactory.deploy(carBeacon.address);
  console.log("Factory deployed to:", carFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
