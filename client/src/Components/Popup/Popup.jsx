import React from 'react';
import {useState, useEffect} from 'react';
import Editor from '../Editor/Editor';
import CardList from '../CardList/CardList';
import PopupComments from '../PopupComments/PopupComments';
import PopupReviews from '../PopupReviews/PopupReviews';
import './Popup.css';
import parse from 'html-react-parser';
import {Link} from 'react-router-dom'

export default function Popup(props){
    
    const [title, setTitle] = useState('');
    const [reviewValue, setReviewValue] = useState(0);
    const [actionType, setActionType] = useState('comments')
    const [color1, setColor1] = useState('red');
    const [color2, setColor2] = useState('white');

    useEffect(() => {
        console.log('Here is the popup message' + props.message)
        if(props.button === true) {
            console.log('we set reviews')
            setActionType('reviews')
            handleChange(2);

        } else {
            console.log('we set comments')
            handleChange(1);
        }
        // if(props.parent === 'main') {
        //     document.getElementById("main-analytics").style.display = 'none';
           

        // }
            }, [])

    useEffect(() => {
        console.log(actionType)
    }, [actionType])

    const clickUnmount =() => {
        
        //document.getElementById("taskbar-id").style.visibility='visible';
        // if(props.parent === 'main'){
        //     document.getElementById("main-analytics").style.visibility='visible';
        // }
        

        props.setPopupOn(false);
        props.renderPopup();
        
        
    }
    const handleChange = (x) => {
        if(x === 1) {
            setColor1('red');
            setColor2('white');
        } else if(x === 2){
            setColor2('red');
            setColor1('white');
        }
    }

    return (
        <div className="popup" id="popup-div">
            <div className="close" onClick={clickUnmount}><p>✕</p></div>
            <div className="cardBox">
                <span className="messages">
                    <div className="messages_text" style={{padding: "30px"}}>
                    {parse(props.message)}
                    </div>
                
                
                </span>
                <span className="right-card">
                    <div className="infoBox">
                        <span className="user-info">
                            <Link to={`/profile/${props.userId}`} style={{textDecoration: 'none', }}>
                            
                            <img src={props.userPhoto}
                             alt="" className="user-image"/>
                            <p className="username">{props.userName}</p>
                            </Link>
                        </span>
                        <h1 className="popup-title" style={{color: 'white'}}>{props.title}</h1>
                        <div id="time-of-post">
                            <p id="post-date">
                                Posted in
                            </p>
                        </div>
                    </div>
                    <div className="comment-editor">

                        <Editor divState={actionType} postId={props.postId} userId={props.userId} grade={reviewValue} setReviewValue={setReviewValue}/>
                    </div>
                    <div className="button-list">
                        <ul className="popup-buttons">
                            <li onClick={()=> {setActionType('comments');handleChange(1)}}><span style={{color: `${color1}`}} className="button1">Comments</span></li>
                            <li onClick={()=> {setActionType('reviews');handleChange(2)}}><span style={{color: `${color2}`}} className="button2">Reviews</span></li>
                        </ul>
                    </div>
                    <div className="cardlist">
                    {/* <CardList page='main' type={actionType} postId={props.postId}/> */}
                    {actionType === 'comments' ? <PopupComments postId={props.postId} currentUser={props.currentUser}/> : null}

                    {actionType === 'reviews'? <PopupReviews postId={props.postId} currentUser={props.currentUser}/> : null}
                    </div>
                    
                </span>
            </div>
        </div>
    );
}