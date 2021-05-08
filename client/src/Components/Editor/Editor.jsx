import React from 'react';
import {useState, useEffect} from 'react';
import './Editor.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {Link} from 'react-router-dom'
import Eeditor from '@ckeditor/ckeditor5-build-classic';


export default function Editor(props){
    const [text, setText] = useState('');
    const [reviewValue, setReviewValue] = useState(0);
    const [type, setType] = useState('')
    const [title, setTitle] = useState('');

    useEffect(()=> {
        console.log(`Here is the  state ${props.divState}`);
        
        if(props.divState === 'post' && type === ''){
            setType('post')
            console.log('change to post')
        } else if(props.divState === 'comment' && type === ''){
            setType('comment')
            console.log('change to comment')
        }else if(props.divState === 'review' && type === ''){
            setType('review')
            console.log('change to review')
        }
        var element = document.getElementsByClassName("ck ck-dropdown");
        // do{
        //       
        // }while(element[i])
        element[1].classList.add("display-none");
        element[1].style.display = 'none'; 
        element[2].classList.add("display-none");
        element[2].style.display = 'none';

    },[])
    

    function handleOnClick(event){
        event.preventDefault();
        var action;
        var userId = JSON.parse(localStorage.getItem('user'));
        console.log('userId IS VALUE' + userId.userId)
        console.log('handleOnClick and divState is' + props.divState);
        if(props.divState === 'post') {
            action = 'post';
            console.log('post is post')
            
        }else if(props.divState === 'comments'){
            action = 'comment';
            console.log('post is comment')
        }else if(props.divState === 'reviews'){
            action = 'review';
            console.log('post is review')
        }
        console.log('action is ' + action);
        var sendText = encodeURI(text);
        if(action === 'post') {
            let postTitle;
            
            if(title === ''){
                postTitle="Untitled"
            } else {
                postTitle=title;
            }
            console.log('post');
            fetch(`http://localhost:8888/editor/user/${props.userId}/${action}`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                content: `${sendText}`,
                title: `${postTitle}`
                
            })
        })
        .then(response => response.json())
        .then(JSONresponse => console.log(JSONresponse.status))
        .catch(error => console.log(error));
        window.location.reload()
        } else if(action === 'comment'){
            console.log('we are in comment');
            fetch(`http://localhost:8888/editor/user/${userId.userId}/${action}`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                content: `${sendText}`,
                postId: `${props.postId}`
            })
        })
        .then(response => response.json())
        .then(JSONresponse => console.log(JSONresponse))
        .catch(error => console.log(error));
        }else if(action === 'review'){
            let grade;
            if(!props.grade) {
                grade=10;
            }
                else {
                    grade=props.grade;
                }
            console.log('review');
            console.log('Grade is' + props.grade)
            fetch(`http://localhost:8888/editor/user/${userId.userId}/${action}`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                content: `${sendText}`,
                reviewValue: `${reviewValue}`,
                postId: `${props.postId}`,
                review: `${grade}`
            })
        })
        .then(response => response.json())
        .then(JSONresponse => console.log(JSONresponse.status))
        .catch(error => console.log(error));
        }
        
        //document.getElementsByClassName("editor").innerHTML = "";
        
    }

    return (
        <div className="editor-box">
            {props.divState === 'post' && props.parent === 'main' ?
                <span className="title-box">
                {/* <h5 style={{display:'inline', marginRight:'20px'}}>Title:</h5> */}
                <input type="text" className="title-input" maxLength="30" style={{marginLeft:'2px'}} onChange={(e) => setTitle(e.target.value)} placeholder="Title:"/>
                <span id="main-editor-user" style={{marginBottom:'10px', height:'50px'}}>
                        <Link style={{textDecoration: 'none'}} to={`/profile/${JSON.parse(localStorage.getItem('user')).userId}`}>
                        <img className="editor-image" style={{borderRadius: '50%'}} src={props.image} alt="profile"/>
                        
                        <p style={{display:'inline', margin: 'auto 0', verticalAlign: 'super'}}>{props.userName}</p>
                        </Link>
                        
                    </span>
            </span>
            :null
            }
            {props.divState === 'post' && props.parent !== 'main' ?
                <span className="title-box">
                {/* <h5 style={{display:'inline', marginRight:'20px'}}>Title:</h5> */}
                <input type="text" className="title-input" maxLength="30" onChange={(e) => setTitle(e.target.value)} placeholder="Title:"/>
            </span>
            :null
            }
            {/* {props.divState === 'review' ?
                <span className="review-box">
                
                <h3 style={{display:'inline', marginRight:'20px'}}>Grade:</h3>
                <input type="text" className="review-input" onChange={(e) => setReviewValue(e.target.value)}/>
            </span>
            :null
            } */}

            <div className="editor">
                    
                     <CKEditor editor={Eeditor}
                    data={text} 
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                        editor.setData('<p>Type Here...</p>')
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        setText(data);
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                        }

                    }
                    config={
                        {
                            ckfinder:{
                                uploadUrl:'http://localhost:8888/ckuploads'
                            },
                            baseFloatZIndex : 1,
                            
                        }
                    }

                    style={{zIndex: 1}}/>
            </div>
                <span className="button-span">
                {props.divState === 'reviews' ? <span><input id="grade" type="number" placeholder="Grade" min="1" max="10" defaultValue="10" onChange={(e) => {props.setReviewValue(e.target.value); console.log(e.target.value)}}/></span> : null}
                    <button className="editor_card_button post-box" onClick={e => handleOnClick(e)}>
                        Post
                    </button>
                    <div>
                    </div>
                </span>
        </div>
        
    );
}