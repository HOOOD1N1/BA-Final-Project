import React, {useState, useEffect} from 'react';
import TaskBar from '../TaskBar/TaskBar';
import ProfileCard from '../ProfileCard/ProfileCard';
import CardList from '../CardList/CardList';
import ProfileUserReviews from '../ProfileUserReviews/ProfileUserReviews';
import {Link} from 'react-router-dom';
import './Profile.css';
import ProfileUserComments from '../ProfileUserComments/ProfileUserComments';
import ProfileUserPosts from '../ProfileUserPosts/ProfileUserPosts';

 function Profile(props){

    const [name, setName] = useState('');
    const [nrPosts, setNrPosts] = useState(0);
    const [nrComments, setNrComments] = useState(0);
    const [item, setItem] = useState('user-posts');
    

    useEffect(() => {
        // setItem('user-posts');
        //window.setItem = setItem;
    },[]);


    return (
        <div className="profile-page">
            <TaskBar history={props.history}/>
            <ProfileCard/>
            <ul className="buttons">
                <li className="button" >
                    <button id ='user-posts' onClick={()=>{
                        console.log('clicked on posts')
                        setItem('user-posts');
                    }}>Posts</button>
                </li>
                <li className="button" >
                    <button id ='user-reviews' onClick={()=>{
                        console.log('clicked on reviews')
                        setItem('user-reviews');
                    }}>Reviews</button>
                </li>
                <li className="button" >
                    <button id ='user-comments' onClick={()=>{
                        console.log('clicked on comments')
                        setItem('user-comments');
                    }}>Comments</button>
                </li>
            </ul>
            {/* <CardList page='profile' type={item}/> */}
           {item === 'user-comments' ? <ProfileUserComments routerUser={props.routerUser} parent='profile'/> : null}
           {item === 'user-reviews' ? <ProfileUserReviews routerUser={props.routerUser} parent='profile'/> : null}
           {item === 'user-posts' ? <ProfileUserPosts routerUser={props.routerUser} parent='profile'/> : null}
        </div>
    );
}
export default Profile;