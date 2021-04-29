/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import './Login.css';
import {useState, Fragment, useEffect} from 'react';
import Helmet from 'react-helmet'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { fab } from '@fortawesome/free-solid-svg-icons'
import {gapi} from 'gapi-script';
import {Redirect} from 'react-router-dom';

export default function Login(props) {
    const [type, setType] = useState("login");
    const [error, setError] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");
    const [userIsAuth, setAuth] = useState(false);
    const [isSigned, setIsSigned] = useState(false);

    

    const changeType = (event) => {
        event.preventDefault();
        if(type === "login") {
            setType("signup");
        } else if(type === "signup"){
            setType("login");
        }

    }
   const changeErrorValue = () => {
        if(error) {
            setError(false);
        } else {
            setError(true);
        }
    }
    const handleGoogleAuth = (e) => {
        e.preventDefault();
        fetch('http://localhost:8888/auth/google', {
           mode: 'cors',
           'Access-Control-Allow-Headers': '*'
        })
        .then(response => response.json)
        .then(text => console.log(text));
    }
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log(`${username} ${email} ${pass1}`);
        if(type === "login") {
            const postObject = {
                email: email,
                password: pass1
            }
            fetch('http://localhost:8888/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postObject)
                }
            ).then(response => response.json())
            .then(json => {
                console.log('works like ' + JSON.stringify(json));
                localStorage.setItem('user', JSON.stringify(json));
                setAuth(true);
                /*
                setTimeout(() => {
                    console.log("User is auth? " + userIsAuth)
                    //props.history.push("/feed");//history is a prop of Route and pushes a route to redirect
                }, 1000);
                    */
                
            })
            .catch(err => changeErrorValue());
           
        }
        
    }

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        console.log(`${username} ${email} ${pass1}`);
        
         if(type === "signup") {
            if(!pass1 || !pass2 || pass1 !== pass2){
                changeErrorValue();
            }
            const postObject = {
                username: username,
                email: email,
                password: pass1
            }
            console.log(postObject);
            fetch("http://localhost:8888/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postObject) 
            }).then(response => response.json())
            .then(json => {
                console.log('works like ' + JSON.stringify(json));
                localStorage.setItem('user', JSON.stringify(json));
                setAuth(true);
            })
            .catch(err => changeErrorValue());
        }
    }

    useEffect(()=>{

        window.signInWithGoogle = async function(googleUser){
            var profile = googleUser.getBasicProfile();
            console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail());
            var id_token = googleUser.getAuthResponse().id_token;

            const name = profile.getName();
            const imageUrl = profile.getImageUrl();
            const email = profile.getEmail();
            //console.log(id_token);
            try{
            const result = await fetch('http://localhost:8888/auth/google_login', {
                method: 'POST',
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id_token,
                    name: name,
                    imageUrl: imageUrl,
                    email: email
                })
            })
            if(result.ok){
                const jsonResponse = await result.json();
                console.log(jsonResponse)
                return jsonResponse;
              }
              throw new Error('Request failed!');
            } catch(error) {
              console.log(error);
            }

        }
        window.signOut = function() {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                console.log('User signed out.');
            });
        }


    })
    useEffect(async() => {
        if(localStorage.getItem('user') !== undefined){
            var user = JSON.parse(localStorage.getItem('user'));
            var sessionToken = user.sessionToken;
        }
        
        if(user.userId !== undefined) {
            const result = await fetch(`http://localhost:8888/session/validate/${user.userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionToken
                })
                
            });
            const JSONresult = await result.json();
            if(JSONresult.status === 'success'){
                setAuth(true);
            }
        }
        
    },[])

    return(
        
        <Fragment>
            <Helmet>
                <script src="https://apis.google.com/js/platform.js" async defer></script>
                <meta name="google-signin-client_id" content="31068947404-bgjt4d2fteficdaht4fnsdee5j6b0q1s.apps.googleusercontent.com"></meta>
            </Helmet>
            { userIsAuth? <Redirect to="/feed"/> :
            (
                <div className="grid">
        <div className="container">
            <div className="leftContainer">
                <h1 className="title"> MyStories </h1>
                <h2 className="subtitle">Share your work and ideas, and get feedback from people all around the world</h2>
            </div>
            <div className="rightContainer">
                {error ?
                    <div className="containerChild">
                        <p className="error-text">Incorrect email and/or password</p>
                     </div>
                     :null
                }
                <div className="button-list">
                { /* <a href="http://localhost:9000/auth/google">GOOGLE+</a>*/} 
                <div class="g-signin2" data-onsuccess="signInWithGoogle"></div>
                <span onClick={window.signOut}><button>Sign Out from Google</button></span>
            
                { /*<FontAwesomeIcon icon={['fab', 'google']} />*/}
                <a href="http://localhost:9000/auth/github">Github</a>
                {/*<FontAwesomeIcon icon={["fab", "github"]} />*/}
                
                </div>
                 
                <br/>
                <div className="or">or</div>



                <form onSubmit={type === 'login' ? handleLoginSubmit : handleSignupSubmit}/*onSubmit={handleSubmit}> */ >
                {type === "signup" ?
                <input type="text" className="containerChild" name="username" id="username" placeholder="Type your username" value={username} onChange={e => setUsername(e.target.value)} required/>
                : null
                }
                {type === "signup"
                ?<input type="text" className="containerChild" name="email" id="email" placeholder="Type your email" value={email} onChange={e => setEmail(e.target.value)} required />
                :<input type="text" className="containerChild" name="email" id="email" placeholder="Type your email" value={email} onChange={e => setEmail(e.target.value)} required/>
                }

                    
                    <input type="password" name="password" id="password" className="containerChild" placeholder="Type your password" value={pass1} onChange={e => setPass1(e.target.value)} required/>
                    {type === "signup" ?
                        <input type="password" name="password" id="password" className="containerChild" value={pass2} placeholder="Retype your password" onChange={e => setPass2(e.target.value)} required/>
                        : null
                    }
                    {type === "login" ?
                        <div>
                        <button type="submit" className="login containerChild" onClick={handleLoginSubmit}> Log In </button>
                        <button className="containerChild" onClick={changeType}>Sign Up</button>
                        </div>
                    : <div>
                        <button type="submit" className="containerChild" onClick={changeErrorValue}>Sign Up</button>
                        <button className="containerChild" onClick={(e) => {changeType(e) }}>Return to Log In</button>
                    </div>
                    
                    }
                </form>
                

               
            </div>
        </div>
        </div>
            )
            }
        
        </Fragment>
    );


}