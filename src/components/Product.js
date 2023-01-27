import { useEffect, useState } from "react";
import {ethers} from 'ethers';
import Rating from "./Rating";
const Product = ({item, provider, acc, website, togglePop}) => {
    const [order, setOrder] = useState(null);
    const [hasBought, setHasBought] = useState(false);


    //once an order has been bought, then we will be suing it to fetch the details from the order that we have created
    let fetchDetails = async()=>{
        //we are just fetching the event that will be emitted from the Buy method
        const events = await website.queryFilter("Buy");
        const orders = events.filter(

            //these events arguments are from the "Buy" event in thw Website.sol
            (event) => event.args.buyer === acc && event.args.itemId.toString() === item.id.toString()
        )
        
        //if there is no order for the particular item, then we are not going to return anything
        if(orders.length === 0) return

        //if there is some order then we are going to fetch the details of the order
        const order = await website.orders(acc, orders[0].args.orderId);
        setOrder(order);
        setHasBought(true);
    }
    //this is the function that will be connecting to the blockchain in order to place the order
    let buyHandler = async()=>{

        //this will be giving us the signer apart from the deployer, i.e, it knows that which acc was the deployer of the contract
        //so, we will be getting the signer which has been connected to the website (apart from the deployer)
        const signer = await provider.getSigner();

        let transcation = await website.connect(signer).buy(item.id, {value: item.cost})
        transcation.wait();
    }

    //useEffect is going to fetch the buying details of the order
    useEffect(()=>{
        fetchDetails()
        //hasbOught has been used as the depedency because, say once the order is place or bought, then once again we need to fetch the buying
        //details of the order
    },[hasBought]);
    return ( 
        <div className="product">
            <div className="product_details">
                <div className="product_image">
                    <img src={item.image} alt="item image" />
                </div>
                <div className="product_overview">
                    <h1>{item.name}</h1>
                    <Rating value={item.rating} />
                    <hr />
                    <p>{item.address}</p>
                    <p>{ethers.utils.formatEther(item.cost.toString(),'ether')}</p>
                    <hr />
                    <h2>Overview</h2>
                    <p>
                        {item.description}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eiusmod tempor incididunt ut labore et 
                        dolore magna aliqua.
                    </p>
                </div>
                <div className="product_order">
                    <h1>{ethers.utils.formatEther(item.cost.toString(),'ether')} ETH</h1>
                    <p>
                        FREE DELIVERY!<br />
                        Delivery: <strong>

                            {/* Date.now -> time in ms
                            undefined -> gives us the regular format of day, month, year
                            month, weekday, day, year-> arguments to check that whether to display these thing or not and in which format */}
                            {/* {new Date(Date.now() + 345600000).toLocaleDateString(undefined, {month:'long', weekday: 'long', day: 'numeric', year: 'numeric'})} */}
                            {new Date(Date.now() + Math.floor(Math.random() * 4 * 86400000)).toLocaleDateString(undefined, {month:'long', weekday: 'long', day: 'numeric', year: 'numeric'})}
                        </strong>
                    </p>
                    {item.stock > 0 ? (<p>In Stock</p>):(<p>Out of stock</p>)}
                    <button className="product_buy" onClick={buyHandler}>
                    Buy now
                </button>
                <p><small>Shipped from</small> : Blockbaazar</p>
                <p><small>Sold By</small> : Blockbaazar</p>
                
                {/* if the order exists then only this section will be shown... otherwise not */}
                {order && (
                    <div className="product_bought">
                        Item bought on <br />
                        <strong>
                            {new Date(Number(order.time.toString() + '000')).toLocaleDateString(
                                undefined,
                                {
                                    weekday: 'long',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric'
                                }
                            )}
                        </strong>
                    </div>
                )}
                <button onClick={togglePop} className='product_close'>
                    <img src="/close.jpg" alt="close" height="2rem" width="2rem"/>
                </button>
                </div>
                
            </div>
        </div>
     );
}
 
export default Product;