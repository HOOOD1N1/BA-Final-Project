/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./ProfileUserReviews.css";
import {useLocation} from 'react-router-dom';
import Card from "../Card/Card";

export default function ProfileUserReviews(props) {
  const [reviews, setReviews] = useState();
  const location = useLocation();


  useEffect(async () => {
    console.log("we are in user-reviews");
    console.log('location is ' + location.pathname);
    var number = 0;
    console.log('Useid is ' + location.pathname[location.pathname.length - 1]);    
    // var lstorageuser = id;
    var i = location.pathname.length - 1;
    var powerOfTen = 0;
    while(location.pathname[i] !== '/') {
      number = number  + location.pathname[i] * Math.pow(10, powerOfTen);
      console.log(number);
      powerOfTen++;
      i--;
    }
    console.log('Number is ' + number);
    if (number) {
      const userReviews = await fetch(
        `http://localhost:8888/user/${number}/reviews`,
        {
          method: "POST",
          headers: {
            //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `,
            "Content-Type": "application/json",
          },
        }
      );
      const jsonReviews = await userReviews.json();
  
      jsonReviews?.posts && setReviews(JSON.parse(jsonReviews.posts));
      // if (jsonComments && jsonComments.posts)

    }
  }, []);

  return (
    <div className="profile-reviews">
      { reviews ? reviews?.map((card, i) => {
        return (
          <Card
            key={`c_${i}`}
            username={card.username}
            userId={card.id}
            postId={card.postid}
            creationDate={card.creation_date}
            message={decodeURI(card.content)}
            currentUser={props.currentUser}
            image={card.profile_image}
            form='reviews'
            parent ='profile'
          />
        );
      }): null}
    </div>
  );
}
