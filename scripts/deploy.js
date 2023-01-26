// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");
const items = require('../src/items.json');


function token(n){

  //returning the smallest unit (wei) no. taken from a bigger number (ether amount)
  // n.toString() helps to display that big number by converting it into
  // string and hence returning that
  return ethers.utils.parseEther(n.toString()); //n.toString() is the required format for parseEther

  //ether = 10^18wei-> so that many no of zeros
  //eg) n = 0.25ETH -> (0.25*10^18) = 250000000000000000 wei
}
async function main() {
  //code going here
  const [deployer] = await ethers.getSigners();

  //deploying the smart contract
  const Website = await hre.ethers.getContractFactory("EcomWeb3");
  const website = await Website.deploy();
  await website.deployed();

  console.log("Deployed the website contract (smart contract) at:", `${website.address}`)

  //Either we do in a separate script file or directly here
  //Listing the items -> items is the array of products
  for(let i=0;i<items.length;i++){
    var transaction = await website.list(
      items[i].id,
      items[i].name,
      items[i].category,
      items[i].image,
      token(items[i].cost),
      items[i].rating,
      items[i].stock
    )
    await transaction.wait();
    console.log('Listed Item : ', `${items[i].id}: ${items[i].name}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
