import React, { useState, useEffect } from "react";
import Card from "../Card/Card";

export default function CardList(props) {
  const [cards, setCards] = useState();

  useEffect(() => {
    var newuser = JSON.parse(localStorage.getItem("user"));
    var user = newuser.userId;
    if (props.page === "profile") {
      console.log(`page is ${props.page}`);
      if (props.type === "user-posts") {
        fetch(`http://localhost:8888/${user}/posts`, {
          method: "POST",
          //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `
        })
          .then((response) => {
            response = response.json();
            return response;
          })
          .then((responseJson) => {
            setCards(responseJson);
            console.log(cards);
          })
          .catch((error) => console.log(error));
      } else if (props.type === "user-comments") {
        fetch(`http://localhost:8888/${user}/comments`, {
          method: "POST",
          //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `
        })
          .then((response) => {
            response = response.json();
            return response;
          })
          .then((responseJson) => {
            setCards(responseJson);
            console.log(cards);
          })
          .catch((error) => console.log(error));
      } else if (props.type === "user-reviews") {
        fetch(`http://localhost:8888/${user}/reviews`, {
          method: "POST",
          //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `
        })
          .then((response) => {
            response = response.json();
            return response;
          })
          .then((responseJson) => {
            setCards(responseJson);
            console.log(cards);
          })
          .catch((error) => console.log(error));
      }
    } else if (props.page === "main") {
      console.log(`page is ${props.page}`);
      var postId = props.postId;
      if (props.type === "posts") {
        fetch(`http://localhost:8888/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `
        })
          .then((response) => response.json())
          .then((responseJson) => {
            console.log(responseJson);
            var newResponseJson = JSON.parse(responseJson.posts);
            //console.log(`here are the cards ${newResponseJson.posts}`);
            setCards(newResponseJson);
          })
          .catch((error) => console.log(error));
      } else if (props.type === "comments") {
        fetch(`http://localhost:8888/${postId}/comments`, {
          method: "POST",
          //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `
        })
          .then((response) => {
            response = response.json();
            return response;
          })
          .then((responseJson) => {
            setCards(responseJson);
            console.log(cards);
          })
          .catch((error) => console.log(error));
      } else if (props.type === "reviews") {
        fetch(`http://localhost:8888/${postId}/reviews`, {
          method: "POST",
          //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `
        })
          .then((response) => {
            response = response.json();
            return response;
          })
          .then((responseJson) => {
            setCards(responseJson);
            console.log(cards);
          })
          .catch((error) => console.log(error));
      }
    }
  }, []);

  return (
    <div className="list">
      {/* {cards ? cards.map((card) => <Card prop={card} />) : null} */}
    </div>
  );
}
