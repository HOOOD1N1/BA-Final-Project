import React from "react";
import "./ProfileCard.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ProfileCard() {
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState("http://localhost:8888/photos/default-profile-picture.jpg");
  const [nrPosts, setNrPosts] = useState(0);
  const [nrComments, setNrComments] = useState(0);
  const [nrReviews, setNrReviews] = useState(0);
  const [checkFriendship, setCheckFriendship] = useState(false);
  const [message, setMessage] = useState('Befriend');
  const location = useLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  var number = 0;
  var i = location.pathname.length - 1;
  var powerOfTen = 0;
  while (location.pathname[i] !== "/") {
    number = number + location.pathname[i] * Math.pow(10, powerOfTen);
    console.log(number);
    powerOfTen++;
    i--;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async() => {
    console.log("Useid is " + location.pathname[location.pathname.length - 1]);
    console.log("Number is " + number);
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("User IS " + user.userId)
    var result = await fetch(
      `http://localhost:8888/userprofile/user/${number}`,
      {
        method: "POST",
        //  'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `
      }
    );

    if (result) {
      const username = await result.json();
      //console.log(username);
      //console.log(username.username.username);
      setUsername(username.username);
      setPhoto(`http://localhost:8888/photos/${username.profile_image}`);
      setNrPosts(username.posts.posts_count);
      setNrComments(username.comments.comment_count);
      setNrReviews(username.reviews.reviews_count);
      //  username?.username &&  setUsername(username);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async() => {
    if(verify() === false) {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.userId;
      let result = await fetch(`http://localhost:8888/check/friend/${userId}/${number}`)
      let newResult = await result.json();
      if(newResult.check === true) {
        setCheckFriendship(true);
        setMessage('Friend ✓');
    }
    }
  }, [])

  const handleClickProfilePicture = ( ) => {
    if(verify() === true){
      console.log("DA");  
      document.querySelector('input[type="file"]').click()
    }
      
  }


  async function validateFileType(e) {
    var fileName = document.getElementById("user-photo").value;
    var idxDot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (extFile === "jpg" || extFile === "jpeg" || extFile === "png") {
      var userId = JSON.parse(localStorage.getItem("user"));
      console.log("userId IS VALUE" + userId.userId);



      var fData = new FormData();
    //   fData.append('name', 'Upload Image');
      fData.append("uploaded_file", e.target.files[0]);

    //   console.log("Data is " + fData.get("fileName"));
      let response = await fetch(
        `http://localhost:8888/photo/${userId.userId}`,
        {
          method: "POST",
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
          //  'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `
          body:  fData,
        }
      );
      var newResponse = await response.json();
      console.log("New response id" +  newResponse.photo)
      setPhoto(newResponse.photo);

    } else {
      alert("Only jpg/jpeg and png files are allowed!");
    }
  }
  const verify = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("THe pair is " + number + " " + user.userId)
    if(number == user.userId){
      console.log("YES");
      return true;
    }
    else return false;

  }
  const handleFriend = async() => {
    let user = JSON.parse(localStorage.getItem('user'))
    let userId = user.userId;
    let result = await fetch(`http://localhost:8888/handleFriend/${userId}/${number}`)
    let newResult = await result.json();
    console.log(newResult)
    if(newResult.message === 'FRIENDSHIP_DELETED') {
      console.log('Enters maybe')
      setMessage('Befriend');
    } else if(newResult.message === 'FRIENDSHIP_ADDED'){
      console.log('Enters maybe and adds')
      setMessage('Friend ✓');
    }


  }


  return (
    <div className="profile-card">
      <span className="leftside">
          <div id="picture-parent">
          <picture onClick={handleClickProfilePicture}>
          <img
            className="profile-img"
            src={photo}
            alt="user"
          />
          
        </picture>
        {  verify() === true ?
          <input
            type="file"
            name="photoUpload"
            id="user-photo"
            accept=".jpg,.jpeg,.png"
            onChange={validateFileType}
          /> : null
        }
          </div>
       
      </span>
      <span className="rightside">
        <div className="profile-cards">
          <ul className="profile_list">
            <li>username: {username}</li>
            <li>No. of posts: {nrPosts}</li>
            <li>No. of comments: {nrComments}</li>
            <li>No. of reviews: {nrReviews}</li>
          </ul>
        </div>
      </span>
        {
        verify() === false ?
         <button onClick={handleFriend}>{message}</button> : null 
        }
    </div>

  );
}
