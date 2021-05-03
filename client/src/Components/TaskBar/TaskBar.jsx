import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {useEffect} from 'react';
import './TaskBar.css';
import {Redirect, Link} from 'react-router-dom';

export default function TaskBar(props){
    const [username, setUsername] = useState('');
    const [image, setImage] = useState('')
    const [results, setResults] = useState([]);

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

    const handleSearchShow = async() => {
    if(document.getElementById("search-results").style.display === 'block'){
        document.getElementById("search-results").style.display = 'none'
    } else
    document.getElementById("search-results").style.display = 'block';
        
    }
    const handleSearch =async(e) =>{
        let val = e.target.value;
        let result = await fetch(`http://localhost:8888/query/search?value=${val}`)
        let newResults = await result.json()
        setResults(newResults.results)
    }
    
    return (
        <nav className="taskbar">
            <Link to='/feed' style={{textDecoration:'none'}}><span className="logo">MyStories</span></Link>
            <span className="searchbar">
                <input type="search" name="search" id="search" placeholder="Search"  autocomplete="off" onClick={handleSearchShow} onKeyDown={(e) => handleSearch(e)}/>
                <div id="search-results">
                    {results.map(result => {
                       return <Link to={`/profile/${result.id}`} style={{textDecoration: 'none', zIndex: 10}}>
                        <div className="searchResult">
                           <span className="result">
                            <img src={`http://localhost:8888/photos/${result.image}`} alt="search result" className="search-result-image"/>
                            <p className="friend-name">{result.name}</p>
                        </span>
                       </div>
                       </Link> 
                    } )}
                </div>
            </span>
            <span className="right_side">
            <Link style={{textDecoration: "none", padding: "5px"}} to={`/profile/${user.userId}`} >
                    <span className="image" style={{position:'relative', width:'80px'}}>
                        <img style={{width: '40px', height:'40px', borderRadius: '50%', position: 'absolute', left: '0', top: '0'}} src={image} alt="user_image" className="profileImage"/>
                        <p style={{position: 'absolute', right: '0', marginLeft:'20px', verticalAlign:'center', display:'inline'}}>{username}</p>    
                    </span>
                </Link>
                <button style={{cursor:'pointer'}}className="signout" onClick={handleLogOut}>
                    Sign Out
                </button>
            </span>

            
        </nav>
    );
}