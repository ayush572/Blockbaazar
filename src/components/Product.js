import { useEffect, useState } from "react";
import {ethers} from 'ethers';
import Rating from "./Rating";
const Product = ({item, provider, acc, website, togglePop}) => {
    let buyHandler = async()=>{
        console.log('buying...')
    }
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
                <button onClick={togglePop} className='product_close'>
                    <img src="/close.jpg" alt="close" height="2rem" width="2rem"/>
                </button>
                </div>
                
            </div>
        </div>
     );
}
 
export default Product;