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

    //to create an order for purchase
    struct Order{
        uint256 time;
        //nested Item
        Item item;
    }

    //this is the mapping for the 'BUYER of the PRODUCT', means the person
    //who has placed the order and its orderCount is updated.
    mapping(address=>uint256) public orderCount;

    //this is the mapping for the 'BUYER of the PRODUCT' signifying the
    //address->user who placed the order
    //then mapping of mapping, means, the quantity of product for each individual
    //means, User1->no/ampunt of some product->what product
    mapping(address=>mapping(uint256 => Order)) public orders;   
    event List(string name, uint256 cost, uint256 stock);
    event Buy(address buyer, uint256 orderId, uint256 itemId);
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

    
    //being paybale means the amount can be transfered to/from the smart
    //contract from any address.
    function buy(uint256 _id) public payable{
        //1)Receive the amount for the product (crypto) -> done in the testing itself

        //2)Fetching the order before making the purchase or order
        Item memory item = items[_id];

        //before creating an order, making sure that the buyer (msg.sender) has enough ethers to buy the same
        //as well as enough stock is available
        require(msg.value >= item.cost && item.stock>0);

        //2)Make the order or create the order for purchase
        //instantiating a new order
        Order memory order = Order(block.timestamp, item);
        //EpochTime is used by the solidity block.timestamp, i.e number from
        //midnight 1970 is counted in sec

        //3) Adding the order for the user -> for the buyer, the orderCount of the particular item is
        //increased
        orderCount[msg.sender]++; //orderId

        orders[msg.sender][orderCount[msg.sender]] = order; //here we have created or added the new oroder space
        /*
            Representation:
            x84abspk..(some address) : {
                5 : shoes
            }
        */

        //3)Subtract the available stock
        item.stock = item.stock - 1; //items.id.stock is actually saved in the storage space
        //whereas the item created is stored in the memory
        items[_id].stock = item.stock;

        //4)Emit the event for the purchase so that the application is updated
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }
}
