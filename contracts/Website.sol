// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract EcomWeb3 {
    //Creating a structure for our product - custom datatype
    struct Item{
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }
    //public visibility because in order to for the users to see the prodcuts
    //available on the website
    mapping(uint256 => Item) public items;

    // //this is the mapping for the 'BUYER of the PRODUCT', means the person
    // //who has placed the order and its orderCount is updated.
    // mapping(address=>uint256) public orderCount;

    // //this is the mapping for the 'BUYER of the PRODUCT' signifying the
    // //address->user who placed the order
    // //then mapping of mapping, means, the quantity of product for each individual
    // //means, User1->no/ampunt of some product->what product
    // mapping(address=>mapping(uint256 => Order)) public orders;   
    event List(string name, uint256 cost, uint256 stock);
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    string public name;
    //just like the metamask or ethereum address
    address public owner;
    constructor(){
        name = "EcomWeb3";

        //whoever initiates the deployment of the smart contract
        owner = msg.sender;
    }
    function list(uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image, 
        uint256 _cost, 
        uint256 _rating,
        uint256 _stock
    )
    public onlyOwner
    {
        
        //initializing or creating a new product instance
        Item memory item = Item(_id,_name,_category,_image,_cost,_rating,_stock);

        //saving the structure (struct) to blockchain
        items[_id] = item;

        //emitting an event of listing a new product
        emit List(_name,_cost,_stock);
    }
}
