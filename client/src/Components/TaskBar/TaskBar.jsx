import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {useEffect} from 'react';
import './TaskBar.css';
import {Redirect, Link} from 'react-router-dom';

export default function TaskBar(props){
    const [username, setUsername] = useState('');
    const [image, setImage] = useState('')
    const [results, setResults] = useState([
        {image: 'http://localhost:8888/photos/default-profile-picture.jpg', name: 'here'},
        {image: 'http://localhost:8888/photos/default-profile-picture.jpg', name: 'ee'},
    ]);

    const user = JSON.parse(localStorage.getItem('user'))
    const handleLogOut = async() => {
        
        await fetch(`http://localhost:8888/clear/${user.userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        localStorage.removeItem("user");
        props.history.push('/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleSearch = async() => {
    if(document.getElementById("search-results").style.display === 'block'){
        document.getElementById("search-results").style.display = 'none'
    } else
    document.getElementById("search-results").style.display = 'block';
        
    }
    ;
    return (
        <nav className="taskbar">
            <Link to='/feed'><span className="logo">MyStories</span></Link>
            <span className="searchbar">
                <input type="search" name="search" id="search" placeholder="Search" onClick={handleSearch}/>
                <div id="search-results">
                    {results.map(result => {
                       return <div className="searchResult">
                           <span className="result">
                            <img src={result.image} alt="search result" className="search-result-image"/>
                            <p className="friend-name">{result.name}</p>
                        </span>
                       </div> 
                    } )}
                </div>
            </span>
            <span className="right_side">
            <Link style={{textDecoration: "none", padding: "5px"}} to={`/profile/${user.userId}`} >
                    <span className="image" style={{position:'relative', width:'80px'}}>
                        <img style={{width: '40px', height:'40px', borderRadius: '50%', position: 'absolute', left: '0', top: '0'}} src={image} alt="user_image" className="profileImage"/>
                        <span style={{position: 'absolute', right: '0', marginLeft:'20px', verticalAlign:'center'}}>{username}</span>    
                    </span>
                </Link>
                <button style={{cursor:'pointer'}}className="signout" onClick={handleLogOut}>
                    Sign Out
                </button>
            </span>

            
        </nav>
    );
}