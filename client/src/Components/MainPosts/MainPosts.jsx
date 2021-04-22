/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./MainPosts.css";
import Card from "../Card/Card";
import { attributesToProps } from "html-react-parser";

export default function MainPosts(props) {
  const [posts, setPosts] = useState();

  useEffect(async () => {
    console.log("we are in main user-posts");
    const lstorageuser = localStorage.getItem("user");
    if (lstorageuser) {
      const userCredentials = JSON.parse(lstorageuser);
      const { userId } = userCredentials;
      const mainPosts = await fetch(
        `http://localhost:8888/posts`,
        {
          method: "POST",
          headers: {
            //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `,
            "Content-Type": "application/json",
          },
        }
      );
      const jsonPosts = await mainPosts.json();
     
      jsonPosts?.posts && setPosts(JSON.parse(jsonPosts.posts));
      // if (jsonComments && jsonComments.posts)

      

    }
  }, []);

  return (
    <div className="main-posts">
      { posts?.map((card, i) => {
        return (
          <Card
            key={`c_${i}`}
            username={card.username}
            userId={card.id}
            postId={card.postid}
            creationDate={card.creation_date}
            message={decodeURI(card.content)}
            currentUser={props.currentUser}
            form='posts'
            parent='main'
            title={card.title}
            image={card.profile_image}
          />
        );
      })}
    </div>
  );
}
