import React from 'react';
import {useState, useEffect} from 'react';
import Popup from '../Popup/Popup';
import {Link} from 'react-router-dom';
import './Card.css';
import parse from 'html-react-parser';

function Card(props) {
    const [userPhoto, setUserPhoto] = useState('https://st.depositphotos.com/2101611/3925/v/600/depositphotos_39258143-stock-illustration-businessman-avatar-profile-picture.jpg');
    const [popupOn, setPopupOn] = useState(false);
    const [numberLikes, setNumberLikes] = useState();
    const [review, setReview] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async()=>{
        setUserPhoto(`http://localhost:8888/photos/${props.image}`)
        //console.log(`${props.username} ${props.userId} ${props.postId} ${props.message}`)
        const like = await fetch(`http://localhost:8888/${props.form}/likes/${props.postId}`, {
            
                method: "POST",
                headers: {
                  //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `,
                  "Content-Type": "application/json",
                
              }
            }
            );
            const jsonLikes = await like.json();
            setNumberLikes(jsonLikes.likes);
        
    }, [])
    const renderPopup = () => {
        if(popupOn === true) {
            setPopupOn(false);
        }
        else setPopupOn(true);
    }
    const handlePostLike = async () => {
        const userId = JSON.parse(localStorage.getItem('user')).userId
        console.log('sending post likes, baby');
        const like = await fetch(`http://localhost:8888/${props.form}/like/${props.postId}/${userId}`, {
            
                method: "POST",
                headers: {
                  //'Authorization': `Bearer ${user.userId}-${user.sessionId}-${user.sessionToken} `,
                  "Content-Type": "application/json",
                
              },
              
            }
            );
            const jsonLikes = await like.json();
            setNumberLikes(jsonLikes.likes);
    }
    
    

    return (
        <div className={props.parent === 'popup' ? "child-card" : "card"} width={props.parent === 'profile' ? "75%" : "100%"} >
            <span className="info">
                <span className="info-left">
                    
                    <Link  to={`/profile/${props.userId}`} style={{textDecoration: 'none'}}>
                        <span>
                            <img src={`${userPhoto}`} style={{borderRadius: '50%', width: '50px', height: '50px',objectFit: 'contain',
    backgroundColor: 'black'}} alt="user_photo"/>
                            <p style={{display:'inline', verticalAlign:'super'}}>{props.username}</p>
                        </span>
                    </Link>

                    
                </span>
                {(props.parent === 'main' || props.parent === 'profile' || props.parent === 'analytics')   
                ?
                <div className="title-of-card" >
                    <h5 >{props.title}</h5>
                </div>
                : null
            }
              { props.parent !== 'popup' ? 
                <span className="right">
                    <img width="20px" height="20px" src='http://localhost:8888/photos/maximize.png' alt="maximize" onClick={renderPopup} style={{cursor: 'pointer',marginTop:'10px', marginRight:'10px'}}/>
                </span>
                :null
                }    
            </span>
            
            
            
            
            <div className="message-box">
                
                <span className="message">{parse(props.message)}</span>
                <span className="actions">
                    <span className="card_button like" onClick={handlePostLike}> <img src='http://localhost:8888/photos/like.png' alt="" width="20px" height="20px" style={{margin:'auto 0'}}/><p style={{display:'inline', margin:'auto 0'}}>Like {numberLikes}</p></span>
                    <span className="card_button comment" onClick={() => {setPopupOn(true); setReview(false)}}><img src='http://localhost:8888/photos/chat.png' alt="" width="20px" height="20px" style={{margin: 'auto 0'}}/><p style={{display:'inline', margin:'auto 0'}}>Comment</p></span>
                    <span className="card_button review" onClick={() =>{ setPopupOn(true); setReview(true)}}><img src='http://localhost:8888/photos/writing.png' alt="" width="20px" height="20px" style={{margin:'auto 0'}}/><p style={{display:'inline', margin:'auto 0'}}>Review</p></span>
                </span>
                </div>
            { popupOn && <Popup close={setPopupOn} userName={props.username} userPhoto={userPhoto} message={props.message} userId={props.userId} postId={props.postId} button={review}
            currentUser={props.currentUser} title={props.title}/> }
        </div>
    );

}

export default Card;