import {ethers} from 'ethers'
const Navbar = ({acc,setAcc}) => {
    let connectHandler = async ()=>{
        //requesting all the existing acc
        let accs = await window.ethereum.request({method: "eth_requestAccounts"});

        //getting the individual acc
        let account = ethers.utils.getAddress(accs[0])
        setAcc(account);
    }
    return ( 
        <div>
    <div className="main_nav">
        <div className="nav_title">
            <h1>BLOCKBAZAAR</h1>
        </div>
        <input type="text" className="nav_search">
        </input>
{/* 
        here it means that if the account is not connected then connect it
        by showing the connect button or if its connected then simply
        connect it */}
        {acc?
        <button type="button" className='nav_connect'>
            {acc.slice(0,6) + '...' + acc.slice(36,42)}
        </button>:
        <button type="button" className='nav_connect' onClick={connectHandler}>
            Connect
        </button>
        }
        
    </div>
    <ul className='nav_links'>
            <li><a href="#Clothing and Jewelry">Clothing and Jewelry</a></li>
            <li><a href="#Sports">Sports</a></li>
            <li><a href="#Accessories">Accessories</a></li>
        </ul></div> );
}
 
export default Navbar;