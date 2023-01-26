import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';

function App() {
  const [acc, setAcc] = useState(null);
  //first we need a way to get hold of the metamask acc in the browser
  let loadData = async()=>{
    //Connect to blockchain
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
