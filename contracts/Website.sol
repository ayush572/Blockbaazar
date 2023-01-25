// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract EcomWeb3 {
    string public name;
    //just like the metamask or ethereum address
    address public owner;
    constructor(){
        name = "EcomWeb3";

        //whoever initiates the deployment of the smart contract
        owner = msg.sender;
    }
}
