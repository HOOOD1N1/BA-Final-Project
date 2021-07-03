import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {useEffect} from 'react';
import './Main.css';
import TaskBar from '../TaskBar/TaskBar';
import Card from '../Card/Card';
import {Redirect} from 'react-router-dom';
import Editor from '../Editor/Editor';
import CardList from '../CardList/CardList';
import MainPosts from '../MainPosts/MainPosts';
import Analytics from '../Analytics/Analytics'
import {Link} from 'react-router-dom';
import socketIOClient from "socket.io-client";

export default function Main(props) {
    const [messages, setMessage] = useState([]);
    const [image, setImage] = useState();
    const [userName, setUserName] = useState('');
    const [text, setText] = useState('');
  
    useEffect(()=> {
        
        var user = JSON.parse(localStorage.getItem('user'));
         fetch(`http://localhost:8888/main/user/${user.userId}`, {
             'method': 'POST'
             //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `
         }).then(response => {response = response.json(); return response;})
         .then(responseJson => {setUserName(responseJson.username); setImage(`http://localhost:8888/photos/${responseJson.profile_image}`)})
         .catch(error => console.log(error));
         //.then(username => setUserName(username))
    },[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async() => {
        // const user = JSON.parse(localStorage.getItem("user"));
        // const {userId, sessionId, sessionToken} = user
        // const createNamespaceReq = await fetch(`http://localhost:8888/namespace/create`, {
        //     method: 'post',
        //     headers:{
        //         'Content-type': 'application/json',
        //         authorization: `${userId}-${sessionId}-${sessionToken}`
        //     }
        // })
        // const validSessionResponse = await createNamespaceReq.json()
        // if(validSessionResponse.status === 'success'){
        //     if(!window.socket) window.socket = socketIOClient(`http://localhost:8888/${userId}`, {
        //         extraHeaders: {
        //             authorization: JSON.stringify(user)
        //         }
        //     });
        //     window.socket.on('started_listening', (params)=>{
        //         console.log('started_listening',params)
        //     })
        // }else{
        //     window.alert('Session is invalid. Please log in again.')
        // }
    }, [])
    

    return (
        <div>
            <TaskBar user={userName} history={props.history}/>
            <div className="main" id="main-div">
                <div className="top-links-list">
                    <ul className="links-list">
                    <Link  style={{textDecoration: 'none'}} to={`/analitics/${JSON.parse(localStorage.getItem('user')).userId}`}>
                    <li className="list-item"><p>Analytics</p></li>
                    </Link>
                    <Link style={{textDecoration: 'none'}} to={'/rooms'}>
                    <li className="list-item"><p>Rooms</p></li>
                    </Link>
                    <Link style={{textDecoration: 'none'}} to={`/chat/${JSON.parse(localStorage.getItem('user')).userId}`}>
                    <li className="list-item"><p>Chat</p></li>
                    </Link>  
                    </ul>
                </div>
            <aside className="left aside" id="main-left-box">
                <span className="infos">
                <Link style={{textDecoration: 'none'}} to={`/profile/${JSON.parse(localStorage.getItem('user')).userId}`} image={image}>
                <picture>
                    <img src={image} style={{borderRadius: '50%', width: '50px', height: '50px'}} alt="photo_user"/>
                </picture>
                <span className="user_info">
                    
                    <p style={{display:'inline', verticalAlign:'super'}}>{userName}</p>
                    
                
                </span>
                </Link>
                </span>
                
                <ul className="main_list" style={{textAlign:'center'}}>
                    <Link  style={{textDecoration: 'none'}} to={`/analytics/${JSON.parse(localStorage.getItem('user')).userId}`}>
                    <li className="list-item">Analytics</li>
                    </Link>
                    <Link style={{textDecoration: 'none'}} to={'/rooms'}>
                    <li className="list-item">Rooms</li>
                    </Link>
                    <Link style={{textDecoration: 'none'}} to={`/chat/${JSON.parse(localStorage.getItem('user')).userId}`}>
                    <li className="list-item">Chat</li>
                    </Link>
                    
                </ul>         
            </aside>
            <span className="feedbar">
                <div className="editor-box-parent">
                    
                <Editor divState='post' userId={JSON.parse(localStorage.getItem('user')).userId} image={image} userName={userName} parent='main'/>
                </div>
            
                <div className="feed">
                    
                    <MainPosts currentUser={JSON.parse(localStorage.getItem('user')).userId}/>
                    

                </div> 
            </span>
            


            <Analytics />
            </div>
        </div>
        
            
            
                    
                
               
        
        
    );

}

