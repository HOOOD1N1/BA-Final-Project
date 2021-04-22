/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./ProfileUserPosts.css";
import CardList from "../CardList/CardList";
import Card from "../Card/Card";
import {useLocation, useParams} from 'react-router-dom';


export default function ProfileUserPosts(props) {
  const [posts, setPosts] = useState();
  let location = useLocation();  

  useEffect(async () => {
    console.log("we are in user-posts");
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
    
    // if(props.routerUser !== undefined) {
    //   console.log('props is not undefined');
    //   lstorageuser = props.routerUser;  
    // }else lstorageuser = localStorage.getItem("user");
    //console.log('this is ' + lstorageuser);
    if (number) {
      //const userCredentials = JSON.parse(lstorageuser);
      //const { userId } = userCredentials;
      const userPosts = await fetch(
        `http://localhost:8888/${number}/posts`,
        {
          method: "POST",
          headers: {
            //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `,
            "Content-Type": "application/json",
          },
        }
      );
      const jsonPosts = await userPosts.json();
     
      jsonPosts?.posts && setPosts(JSON.parse(jsonPosts.posts));
      // if (jsonComments && jsonComments.posts)

    }
  }, []);

  return (
    <div className="profile-posts">
      { posts?.map((card, i) => {
        return (
          <Card
            key={`c_${i}`}
            username={card.username}
            userId={card.id}
            postId={card.postid}
            creationDate={card.creation_date}
            message={decodeURI(card.content)}
            parent ='profile'
            image={card.profile_image}
            title={card.title}
            form='posts'
          />
        );
      })}
    </div>
  );
}
