import React from 'react';
import './FriendsList.css';
import {useState, useEffect} from 'react';
import socketIOClient from "socket.io-client";
export default function FriendsList(props) {
    const [friends, setFriends] = useState([]);


    const cleanup = () => {

        console.log('Unmounted')

        window.socket.emit('disconnect')

        window.socket = null
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const {userId, sessionId, sessionToken} = user
        var result = await fetch(`http://localhost:8888/contacts/${userId}`);
        let newResult = await result.json();
        setFriends(newResult.results)
        window.friend = newResult.results[0].userid
        console.log("Window.friend is", window.friend)
        const createNamespaceReq = await fetch(`http://localhost:8888/namespace/create`, {
            method: 'post',
            headers:{
                'Content-type': 'application/json',
                authorization: `${userId}-${sessionId}-${sessionToken}`
            }
        })
        const validSessionResponse = await createNamespaceReq.json()
        if(validSessionResponse.status === 'success'){
            if(!window.socket) window.socket = socketIOClient(`http://localhost:8888/${userId}`, {
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
        
        return function() {
            console.log("BOY< PLEASE WORK")
            cleanup();
            
        }

    }, []);

    const openChannel = (friend) => {
        
        const user = JSON.parse(localStorage.getItem("user"));
        // socket.emit('disconnect');
        console.log('Emit enter')
        window.socket.emit("enter", JSON.stringify({user1:friend, user2: user.userId}))
        window.socket.on("messages", async(messages) => {
            console.log("Enters the emmit")
            const messageList = JSON.parse(messages);
            console.log("Messages are +", messageList.messages)
            props.setMessages([...messageList.messages])
        })
    }
    

    return (
        <div className="friend-list">
            {friends.map(friend => {
                return (
                    <div key={friend.userid} className="friend" onClick={()=>{
                        props.setMessages([])
                        openChannel(friend.userid)
                        window.friend = friend.userid;
                        console.log("Window.friend is", window.friend)
                    }}>
                        <span className="singular">
                        <img src={`http://localhost:8888/photos/${friend.profile_image}`} alt="friend" className="friend-img"/>
                        <h3 className="friend-name">{friend.username}</h3>
                        </span>
                    </div>
                );
            })}
        </div>
    );
}