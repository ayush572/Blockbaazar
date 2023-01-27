import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Website from './config.json'
import abi from './abi/EcomWeb3.json'
import Section from './components/Section';
import Product from './components/Product';

function App() {
  const [acc, setAcc] = useState(null);
  const [provider, setProvider] = useState(null);
  const [website,setWebsite] = useState(null);
  const [sports,setSports] = useState(null);
  const [clothing,setClothing] = useState(null);
  const [accessories,setAccessories] = useState(null);
  const [item,setItem] = useState({}); //empty object as default value
  const [toggle, setToggle] = useState(null);
  let togglePop = (items)=>{
    // console.log("Popped!");
    setItem(items); //for updating the items dictionary, i.e to show the details for the particular item on screen
    toggle ? setToggle(false) : setToggle(true); //for opening and closing the particular item info
  }
  //first we need a way to get hold of the metamask acc in the browser
  let loadData = async()=>{
    //Connect to blockchain -> frontend application to blockchain
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    let network = await provider.getNetwork();
    console.log(network);

    //Connect to smart contract
    //means to create the JS versions of smart contract - meaning that we 
    //want to be able to use the functions and methods of smart contracts
    //, of the .sol file and other methods of , inside here, in the JS file
    //ether.js such as .deploy(), .connect(), etc...
    const website = new ethers.Contract(Website[network.chainId].EcomWeb3.address ,abi, provider)
    setWebsite(website);

    //abi -> abstract binary interface -> it refers to the binary form
    //of all the things that a smart contract does, ranging from its
    //function to data types, etc. It describes how the contract works

    //Load products
    let items = []
    for(var i=0;i<9;i++)
    {
      items.push(await website.items(i+1));
    }
    console.log(items);

    //filtering out the items
    let accessories = items.filter((item)=>item.category === 'Accessories');
    let clothing = items.filter((item)=>item.category === 'Clothing');
    let sports = items.filter((item)=>item.category === 'Sports');
    setSports(sports)
    setClothing(clothing)
    setAccessories(accessories)
  }
  
  useEffect(()=>{
    loadData();
  },[]) 
  return (
    <div className="App">
      <Navbar acc={acc} setAcc={setAcc} />
      <h2 style={{margin: "10px", fontSize: "3rem"}}>Products available</h2>
      {/* this we have done so that while all the products are not loaded 
      till then do not show any product on the webpage */}
      {accessories && clothing && sports ? 
      <div>
        <Section title={"Clothing"} items={clothing} togglePop={togglePop} />
        <Section title={"Sports"} items={sports} togglePop={togglePop} />
        <Section title={"Accessories"} items={accessories} togglePop={togglePop} />
      </div>:"Loading..."}
      {toggle && (
        <Product item={item} provider={provider} account={acc} website={website} togglePop={togglePop} />
      )}
    </div>
  );
}

export default App;
