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
        var result = await fetch(`http://localhost:8888/contacts/${user.userId}`);
        let newResult = await result.json();
        setFriends(newResult.results)
            if(!window.socket) window.socket = socketIOClient('http://localhost:8888/');
            // window.socket.emit('connection', ()=>{
            //     console.log('Connected the client successfully.')
            // })
        
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
            const messageList = await messages.json();
            console.log("Messages are +" + messageList.messages)
        })
    }
    

    return (
        <div className="friend-list">
            {friends.map(friend => {
                return (
                    <div className="friend" onClick={()=>{
                        openChannel(friend.userid)
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