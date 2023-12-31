import React from "react";
import profilePng from "../../images/Profile.png";
import ReactStars from "react-rating-stars-component";




const ReviewCard = ({ review }) => {
    const option={
        edit:false,
        color:"rgba(20,20,20,0,1)",
        activeColor:"tomato",
        size: window.innerWidth<600 ? 20:25,
        value:review.rating,
        isHalf:true,
      };

  return (
    <div className="reviewCard">
      <img src={profilePng} alt="User" />
      <p>{review.name}</p>
      <ReactStars {...option}/>
      <span className="reviewCardComment">{review.comment}</span>
    </div>
  );
};

export default ReviewCard;