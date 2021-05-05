/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {useLocation} from 'react-router-dom';
import "./ProfileUserComments.css";
import Card from "../Card/Card";

export default function ProfileUserComments(props) {
  const [commentType, setCommentType] = useState();
  const [comments, setComments] = useState();
  const location = useLocation();

  useEffect(async () => {
    console.log("we are in user-comments");

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
      //const userCredentials = JSON.parse(lstorageuser);
      //const { userId } = userCredentials;
      const { postId } = props;
        console.log("postId este" + postId);
      const userComments = await fetch(
        `http://localhost:8888/user/${number}/comments`,
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
    <div className="profile-comments" >
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
            parent ='profile'
            form='comments'
          />
        );
      })}
    </div>
  );
}
