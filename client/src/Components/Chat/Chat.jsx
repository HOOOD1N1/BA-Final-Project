/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import './Chat.css';
import {useState, useEffect} from 'react';
import FriendsList from '../FriendsList/FriendsList';
import TaskBar from '../TaskBar/TaskBar';
import Messages from '../Messages/Messages.jsx';
import ScrollToBottom from 'react-scroll-to-bottom'; 
import socketIOClient from "socket.io-client";

export default function Chat(props) {
    const [username, setUsername] = useState('');
    const [image, setImage] = useState('');
    const user = JSON.parse(localStorage.getItem('user'))
    
    useEffect(async()=> {

        let photo = await fetch(`http://localhost:8888/taskbar/photo/${user.userId}`);
        let JSONphoto = await photo.json();
        //console.log("JSON photo is " + JSONphoto.profile_image)
        //let profileImage = JSON.parse(JSONphoto.profile_image)
        console.log(JSONphoto)
        console.log("The image is " + JSONphoto[0].profile_image)
        setImage(`http://localhost:8888/photos/${JSONphoto[0].profile_image}`);
        setUsername(JSONphoto[0].username)
             
    },[])

    
    return (
        <div>
            <TaskBar />
            <div className="chat-component">
            <div className="topBar">
                <img src={image} alt="user" className="chat-user-image"/>
                <span>{username}</span> 
               </div>
            
        <div className="outer-chatbox">
           <FriendsList/>
           <div className="chatbox">
               <div className="message-list">
                   <ScrollToBottom>
                   <Messages />
                   </ScrollToBottom>
               </div>
               <div className="chat-input">
                   <input type="text" name="messageText" id="messageText"/>
                   <button disabled>Send</button>
               </div>
           </div>
       </div>
       </div>
       </div>
    );
}