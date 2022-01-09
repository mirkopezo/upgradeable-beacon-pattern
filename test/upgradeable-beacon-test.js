const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Upgradeable Beacon Pattern", function () {
  beforeEach(async function () {
    [deployer, attacker] = await ethers.getSigners();

    const Car = await ethers.getContractFactory("Car");
    this.car = await Car.deploy();

    const CarBeacon = await ethers.getContractFactory("CarBeacon");
    this.carBeacon = await CarBeacon.deploy(this.car.address);

    const CarFactory = await ethers.getContractFactory("CarFactory");
    this.carFactory = await CarFactory.deploy(this.carBeacon.address);

    const CarV2 = await ethers.getContractFactory("CarV2");
    this.carV2 = await CarV2.deploy();
  });

  describe("CarBeacon", function () {
    it("beacon should have correct implementation address", async function () {
      expect(await this.carBeacon.implementation()).to.eq(this.car.address);
    });

    it("shouldn't allow anynone other than owner to upgrade implementation", async function () {
      await expect(
        this.carBeacon.connect(attacker).upgradeTo(this.carV2.address)
      ).to.be.reverted;
    });
  });

  describe("CarFactory", function () {
    it("CarFactory should have correct beacon address", async function () {
      expect(await this.carFactory.getBeaconAddress()).to.eq(
        this.carBeacon.address
      );
    });

    it("should build car proxy correctly", async function () {
      await this.carFactory.buildCar("Lambo", 65, 5000);

      const carProxyAddress = await this.carFactory.getCarAddress(1);
      this.carProxy = await ethers.getContractAt("Car", carProxyAddress);

      expect(await this.carProxy.brand()).to.eq("Lambo");
      expect(await this.carProxy.fuelLevel()).to.eq(65);
      expect(await this.carProxy.mileage()).to.eq(5000);
    });
  });

  describe("Interaction with Car proxy", function () {
    it("should call drive function and it will change state correctly", async function () {
      await this.carFactory.buildCar("Lambo", 65, 5000);

      const carProxyAddress = await this.carFactory.getCarAddress(1);
      this.carProxy = await ethers.getContractAt("Car", carProxyAddress);

      await this.carProxy.drive();
      expect(await this.carProxy.fuelLevel()).to.eq(64);
      expect(await this.carProxy.mileage()).to.eq(5010);
    });

    it("shouldn't allow to call drive function if you are not owner", async function () {
      await this.carFactory.buildCar("Lambo", 65, 5000);

      const carProxyAddress = await this.carFactory.getCarAddress(1);
      this.carProxy = await ethers.getContractAt("Car", carProxyAddress);

      await expect(this.carProxy.connect(attacker).drive()).to.be.reverted;
    });
  });

  describe("Upgrade implementation to CarV2", function () {
    it("should call refillFuel function after upgrade and change states correctly", async function () {
      await this.carFactory.buildCar("Lambo", 65, 5000);

      const carProxyAddress = await this.carFactory.getCarAddress(1);
      this.carProxy = await ethers.getContractAt("Car", carProxyAddress);

      await this.carProxy.drive();

      await this.carBeacon.upgradeTo(this.carV2.address);

      this.carProxy = await ethers.getContractAt("CarV2", carProxyAddress);

      await this.carProxy.refillFuel();
      expect(await this.carProxy.fuelLevel()).to.eq(74);
      expect(await this.carProxy.mileage()).to.eq(5010);
      expect(await this.carProxy.refillCounter()).to.eq(1);
    });

    it("shouldn't allow to call refillFuel function if you are not owner", async function () {
      await this.carFactory.buildCar("Lambo", 65, 5000);

      const carProxyAddress = await this.carFactory.getCarAddress(1);

      await this.carBeacon.upgradeTo(this.carV2.address);

      this.carProxy = await ethers.getContractAt("CarV2", carProxyAddress);

      await expect(this.carProxy.connect(attacker).refillFuel()).to.be.reverted;
    });

    it("should create car proxy correctly after upgrade", async function () {
      await this.carBeacon.upgradeTo(this.carV2.address);

      await this.carFactory.buildCar("Ferrari", 55, 2500);

      const carProxyAddress = await this.carFactory.getCarAddress(1);
      this.carProxy = await ethers.getContractAt("CarV2", carProxyAddress);

      expect(await this.carProxy.brand()).to.eq("Ferrari");
      expect(await this.carProxy.fuelLevel()).to.eq(55);
      expect(await this.carProxy.mileage()).to.eq(2500);
    });
  });
});
