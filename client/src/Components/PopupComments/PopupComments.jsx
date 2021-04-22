/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./PopupComments.css";
import CardList from "../CardList/CardList";
import Card from "../Card/Card";

export default function PopupComments(props) {
  const [commentType, setCommentType] = useState();
  const [comments, setComments] = useState();

  useEffect(async () => {
    console.log("we are in post-comments");
    const lstorageuser = localStorage.getItem("user");
    if (lstorageuser) {
      const userCredentials = JSON.parse(lstorageuser);
      const { userId } = userCredentials;
      const userComments = await fetch(
        `http://localhost:8888/post/${props.postId}/comments`,
        {
          method: "POST",
          headers: {
            //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `,
            "Content-Type": "application/json",
          },
        }
      );
      const jsonComments = await userComments.json();
     
      jsonComments?.posts && setComments(JSON.parse(jsonComments.posts));
      // if (jsonComments && jsonComments.posts)

    }
  }, []);

  return (
    <div className="profile-comments">
      { comments?.map((card, i) => {
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
            form='comments'
          />
        );
      })}
    </div>
  );
}
