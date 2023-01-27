import {ethers} from 'ethers'
import Rating from './Rating'
const Section = ({title, items, togglePop}) => {
    return ( 
    <div>
        <div className='cards_section'>
                <h3 id={title} style={{fontSize: '1.5rem'}}>{title}</h3>
                <hr></hr>
                <div className='cards'>
                    {items.map((item,i)=>(
                        <div className='card' key={i} onClick={()=>togglePop(item)}>
                            <div className='card_img'>
                                <img src={item.image} alt="item"></img>
                            </div>
                            <div className='card_info'>
                                <h4>{item.name}</h4>
                                <Rating value={item.rating} />
                                <p>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</p>
                            </div>
                        </div>
                    ))}
                </div>
        </div>
    </div> );
}
 
export default Section;