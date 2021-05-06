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
    const [messages, setMessages] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'))
    
    useEffect(async()=> {
        if(messages.length > 0) {
            console.log("messages are " + messages)
        }
        let photo = await fetch(`http://localhost:8888/taskbar/photo/${user.userId}`);
        let JSONphoto = await photo.json();
        //console.log("JSON photo is " + JSONphoto.profile_image)
        //let profileImage = JSON.parse(JSONphoto.profile_image)
        console.log(JSONphoto)
        console.log("The image is " + JSONphoto[0].profile_image)
        setImage(`http://localhost:8888/photos/${JSONphoto[0].profile_image}`);
        setUsername(JSONphoto[0].username)
        if(window.socket)window.socket.on('notify', (payload) => {
            const { authorUsername, message } = JSON.parse(payload);
            setMessages(messages.push({sender: authorUsername, message: message}))
        })
        else {
            const createNamespaceReq = await fetch(`http://localhost:8888/namespace/create`, {
            method: 'post',
            headers:{
                'Content-type': 'application/json',
                authorization: `${user.userId}-${user.sessionId}-${user.sessionToken}`
            }
        })
        const validSessionResponse = await createNamespaceReq.json()
        if(validSessionResponse.status === 'success'){
            if(!window.socket) window.socket = socketIOClient(`http://localhost:8888/${user.userId}`, {
                extraHeaders: {
                    authorization: JSON.stringify(user)
                }
            });
            window.socket.on('started_listening', (params)=>{
                console.log('started_listening',params)
            })
        }else{
            window.alert('Session is invalid. Please log in again.')
        }
        }

    },[])

    
    return (
        <div className="chat-page">
            <TaskBar history={props.history}/>
            <div className="chat-component">
            <div className="topBar">
                <img src={image} alt="user" className="chat-user-image"/>
                <span>{username}</span> 
               </div>
            
        <div className="outer-chatbox">
           <FriendsList setMessages={setMessages}/>
           <div className="chatbox">
           
               <div className="message-list">
               <ScrollToBottom>
                   <Messages messages={messages}/>
                   </ScrollToBottom>
               </div>
               
               <div className="chat-input">
                   <input type="text" name="messageText" id="chat-messageText"/>
                   <button onClick={(e) => {
                       e.preventDefault();
                       let message = document.getElementById('chat-messageText').value;
                       document.getElementById('chat-messageText').value = '';
                       let sender = user.userId;
                       let receiver = window.friend;
                       let payload = {
                            user1: sender,
                             user2: receiver,
                              message: message 
                            }
                        window.socket.emit("send", JSON.stringify(payload))

                   }}>Send</button>
               </div>
           </div>
       </div>
       </div>
       </div>
    );
}