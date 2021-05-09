/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./PopupReviews.css";
import Card from "../Card/Card";

export default function ProfileUserComments(props) {
  const [reviews, setReviews] = useState();

  useEffect(async () => {
    console.log("we are in post-reviews");
    const lstorageuser = localStorage.getItem("user");
    if (lstorageuser) {
      const userCredentials = JSON.parse(lstorageuser);
      const { userId } = userCredentials;
      const { postId } = props;
        console.log("postId este" + postId);
      const userReviews = await fetch(
        `http://localhost:8888/post/${postId}/reviews`,
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
    <div className="popup-review">
      { reviews?.map((card, i) => {
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
            parent='popup'
            grade={card.review}
          />
        );
      })}
    </div>
  );
}
