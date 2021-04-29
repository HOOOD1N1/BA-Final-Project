import React from 'react';
import './FriendsList.css';
import {useState, useEffect} from 'react';
export default function FriendsList(props) {
    const [friends, setFriends] = useState([
        {image: 'http://localhost:8888/photos/default-profile-picture.jpg', name: 'here'},
        {image: 'http://localhost:8888/photos/default-profile-picture.jpg', name: 'ee'},
        {image: 'http://localhost:8888/photos/default-profile-picture.jpg', name: 'here'},
        {image: 'http://localhost:8888/photos/default-profile-picture.jpg', name: 'ee'},
        {image: 'http://localhost:8888/photos/default-profile-picture.jpg', name: 'here'},
        {image: 'http://localhost:8888/photos/default-profile-picture.jpg', name: 'ee'},
        {image: 'http://localhost:8888/photos/default-profile-picture.jpg', name: 'here'},
        {image: 'http://localhost:8888/photos/default-profile-picture.jpg', name: 'ee'},
        {image: 'http://localhost:8888/photos/default-profile-picture.jpg', name: 'here'},
        {image: 'http://localhost:8888/photos/default-profile-picture.jpg', name: 'ee'}
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async() => {
        const user = JSON.parse(localStorage.getItem("user"));
        var result = await fetch(`http://localhost:8888/user/chat/${user.userId}`);
        let newResult = await result.json();
      
    }, []);

    return (
        <div className="friend-list">
            {friends.map(friend => {
                return (
                    <div classname="friend">
                        <span className="singular">
                        <img src={friend.image} alt="friend" className="friend-img"/>
                        <h3 className="friend-name">{friend.name}</h3>
                        </span>
                    </div>
                );
            })}
        </div>
    );
}