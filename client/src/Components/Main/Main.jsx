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
import Analitics from '../Analitics/Analitics'
import {Link} from 'react-router-dom';

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
    

    return (
        <div>
            <TaskBar user={userName} history={props.history}/>
            <div className="main">
            <aside className="left aside">
                <span className="infos">
                <picture>
                    <img src={image} style={{borderRadius: '50%', width: '50px', height: '50px'}} alt="photo_user"/>
                </picture>
                <div className="user_info">
                    <Link style={{textDecoration: 'none'}} to={`/profile/${JSON.parse(localStorage.getItem('user')).userId}`} image={image}>
                    <div>{userName}</div>
                    </Link>
                
                </div>
                </span>
                
                <ul className="main_list">
                    <Link  style={{textDecoration: 'none'}} to={`/analitics/${JSON.parse(localStorage.getItem('user')).userId}`}>
                    <li className="list-item">Analytics</li>
                    </Link>
                    
                    <li className="list-item">Rooms</li>
                    <li className="list-item">Chat</li>
                </ul>            
            </aside>
            <span className="feedbar">
                <div className="editor-box">
                    <span>
                        <img className="editor-image" style={{borderRadius: '50%', width: '50px', height: '50px'}} src={image} alt="profile"/>
                        <Link style={{textDecoration: 'none'}} to={`/profile/${JSON.parse(localStorage.getItem('user')).userId}`}>
                        <span>{userName}</span>
                        </Link>
                    </span>
                <Editor divState='post' userId={JSON.parse(localStorage.getItem('user')).userId}/>
                </div>
            
                <div className="feed">
                    
                    <MainPosts currentUser={JSON.parse(localStorage.getItem('user')).userId}/>
                    

                </div> 
            </span>
            


            <Analitics />
            </div>
        </div>
        
            
            
                    
                
               
        
        
    );

}

