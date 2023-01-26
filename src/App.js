import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';

function App() {
  const [acc, setAcc] = useState(null);
  const [provider, setProvider] = useState(null);
  //first we need a way to get hold of the metamask acc in the browser
  let loadData = async()=>{
    //Connect to blockchain -> frontend application to blockchain
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    let network = await provider.getNetwork();
    console.log(network);
    //Connect to smart contract
    //Load products
    
  }
  
  useEffect(()=>{
    loadData();
  },[]) 
  return (
    <div className="App">
      <Navbar acc={acc} setAcc={setAcc} />
    </div>
   
  );
}

export default App;
