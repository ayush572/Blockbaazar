const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EcomWeb3", function () {
  function token(n){

    //returning the smallest unit (wei) no. taken from a bigger number (ether amount)
    // n.toString() helps to display that big number by converting it into
    // string and hence returning that
    return ethers.utils.parseEther(n.toString());

    //ether = 10^18wei-> so that many no of zeros
    //eg) n = 0.25ETH -> (0.25*10^18) = 250000000000000000 wei
  }
  let website;
  let deployer, buyer;
  const ID = 1;
  const NAME = "Shoes";
  const CATEGORY = "Clothing";
  const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
  const COST = token(1); //price of product in ether 
  const RATING = 4;
  let STOCK = 5;
  //beforeEach describe it runs
  this.beforeEach(async()=>{

    
    //A Signer in ethers is an abstraction of an Ethereum Account, 
    //which can be used to sign messages and transactions and send 
    //signed transactions to the Ethereum Network to execute state 
    //changing operations.
    [deployer, buyer] = await ethers.getSigners();//getSigners func to get all the fake 
    //accounts provided by hardhat with some ethereum in it.
    //deplyer and buyer only two acc as of now
    // console.log(deployer.address, buyer.address); 


    //creating an instance of the smart contract or fetched as well to 
    //create its copy. Inside the getContractFactory goes the name of the
    //smart contract rather than the name of the solidity file.
    const Website = await ethers.getContractFactory("EcomWeb3");

    //deploying a copy of it on the test blockchain running in the background
    website = await Website.deploy();
  })

  //now we will organize each tests into specific places
  //Grouping tests into different categories
  //Etherjs is the library that connects the project to blockchain
  //here it is connecting the test to the blockchain
  describe("Deployment", ()=>{ 
    it('setting the owner',async()=>{
      expect(await website.owner()).to.equal(deployer.address)
    })
  })
  describe("Listing", ()=>{ 
    let transaction; 
    //means before any testing to perform for this Listing part,
    //do this first
    this.beforeEach(async()=>{
      //here we are actually creating a product, means, once the smart
      //contract has been deployed on the blockchain then we are creating
      //a new item for the testing purpose.
      console.log('listing runs')
      transaction = await website.list( 
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        RATING,
        STOCK
      ) //waiting for the new product to be listed on the website
      await transaction.wait();
    })
    
    it('Return the item attributes',async()=>{
      const item = await website.items(1);
      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.cost).to.equal(COST);
      expect(item.image).to.equal(IMAGE);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
    })

    it("Emits Listing of a new product on the website", async ()=>{
      expect(transaction).to.emit(website, "List");
    })
  })

  describe("Purchase Product", ()=>{ 
    
    let transaction;
    
    this.beforeEach(async()=>{
      console.log("Purchase product runs");
      //we are still listing the prodcuts so that the products can be
      //displayed on the screen or are available for the purchase
      transaction = await website.list( 
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        RATING,
        (STOCK+1) //+1 has been done because it runs before any of the 'it' from chai runs
      ) //waiting for the new product to be listed on the website
      await transaction.wait();

      // console.log("current balance is:", await ethers.provider.getBalance(website.address));
      //Buy an item -> If you need to test your code by sending a transaction 
      //from an account (or Signer in ethers.js terminology) other than the 
      //default one, you can use the connect() method on your ethers.js 
      //Contract object to connect it to a different account
      transaction = await website.connect(buyer).buy(ID, {value : COST})
      transaction.wait();
      //value:COST is like a metadata that can be passed due to 'PAYABLE'
      //modifier attached to the function
    })

    //now testing it using chai assertion lib 

    
    it("Updating the contract balance", async ()=>{
      
      //here we have stored the funds in the smart contract itself
      const amount = await ethers.provider.getBalance(website.address);
      console.log(amount);
      expect(amount).to.equal(COST);
    })

    it("Updating the order count of the buyer", async ()=>{
      //here we have stored the funds in the smart contract itself
      const orders = await website.orderCount(buyer.address);
      
      console.log("orders: ",orders);
      expect(orders).to.equal(1);
    })

    it("Adding the order to the buyers account", async ()=>{
      const order = await website.orders(buyer.address,1);

      console.log(order.time);
      console.log(order.item.name);
      expect(order.time).to.be.greaterThan(0);
      expect(order.item.name).to.equal(NAME);
    })

    //now finally emitting a buy event
    it("Emit buy event", async()=>{
      expect(transaction).to.emit(website,"buy");
    })
  })

  describe("Withdraw amount", async()=>{
    console.log("Withdraw amount runs");
    let balBefore;

    //means before any testing to perform for this Listing part,
    //do this first
    this.beforeEach(async()=>{
      //here we are actually creating a product, means, once the smart
      //contract has been deployed on the blockchain then we are creating
      //a new item for the testing purpose.
      // console.log('withdraw amount - listing runs')
      transaction = await website.connect(deployer).list( 
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        RATING,
        STOCK
      ) //waiting for the new product to be listed on the website
      await transaction.wait();
      // console.log("current balance is:", await ethers.provider.getBalance(website.address));

      //now the buyer is connected to buy a single product
      transaction = await website.connect(buyer).buy(ID, {value : COST});
      await transaction.wait();

      //getting the deployer balance before its withdrawn from the smart contract
      balBefore = await ethers.provider.getBalance(deployer.address);
      // console.log(balBefore);

      transaction = await website.connect(deployer).withdraw();
      await transaction.wait();
      // console.log(new_amt);

      //balance after the amount is withdrawn
      // console.log(await ethers.provider.getBalance(deployer))
    })

    it("Amount withdrawn by the owner", async()=>{
      let new_amt = await ethers.provider.getBalance(deployer.address);
      expect(new_amt).to.be.greaterThan(balBefore);
    })

  })
});
