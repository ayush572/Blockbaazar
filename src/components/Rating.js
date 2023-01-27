const Rating = ({value}) => {
    return ( 
    <div>
        <div className="rating">
            <img src={value >=1 ? "star.jpg" : "star_unfilled.jpg"} width="20px" height="20px" alt="star img"></img>
            <img src={value >=2 ? "star.jpg" : "star_unfilled.jpg"} width="20px" height="20px" alt="star img"></img>
            <img src={value >=3 ? "star.jpg" : "star_unfilled.jpg"} width="20px" height="20px" alt="star img"></img>
            <img src={value >=4 ? "star.jpg" : "star_unfilled.jpg"} width="20px" height="20px" alt="star img"></img>
            <img src={value >=5 ? "star.jpg" : "star_unfilled.jpg"} width="20px" height="20px" alt="star img"></img>
        </div>
    </div> );
}
 
export default Rating;