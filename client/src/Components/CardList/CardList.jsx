/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Card from "../Card/Card";
import parse from "html-react-parser";

export default function CardList(props) {
  const {item} = props;
  item && console.log('the item prop is', item);
  const [cards, setCards] = useState();

  useEffect(async () => {
    console.log("enter CardList");
    const lstorageuser = localStorage.getItem("user");
    if (lstorageuser) {
      const userCredentials = JSON.parse(lstorageuser);
      const { userId } = userCredentials;
      const { page, type } = props;

      console.log("the type is ", props.type);
      if (page === "main") {
        const { postId } = props;
        console.log("postId este" + postId);
        if (type === "posts") {
          console.log("here, show me user posts");
          const posts = await fetch(`http://localhost:8888/posts`, {
            method: "POST",
            headers: {
              //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `,
              "Content-Type": "application/json",
            },
          });
          const jsonPosts = await posts.json();

          jsonPosts && setCards(JSON.parse(jsonPosts.posts));
        } else if (type === "comments") {
          console.log("we are in comments");
          const comments = await fetch(
            `http://localhost:8888/post/${postId}/comments`,
            {
              method: "POST",
              headers: {
                //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `,
                "Content-Type": "application/json",
              },
            }
          );
          const jsonComments = await comments.json();
          console.log("DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
          jsonComments && setCards(JSON.parse(jsonComments.posts));
        } else if (type === "reviews") {
          const reviews = await fetch(
            `http://localhost:8888/post/${postId}/reviews`,
            {
              method: "POST",
              headers: {
                //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `,
                "Content-Type": "application/json",
              },
            }
          );
          const jsonReviews = await reviews.json();
          jsonReviews && setCards(jsonReviews);
        } else {
          console.log(type);
        }
      }
    }
  }, []);

  return (
    <div className="list">
      {cards
        ? cards?.map((card, i) => (
            <Card
                key={`c_${i}`}
                username={card.username}
                userId={card.id}
                postId={card.postid}
                creationDate={card.creation_date}
                message={decodeURI(card.content)}
            />
          ))
        : null}
    </div>
  );
}
