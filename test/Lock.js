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
});
