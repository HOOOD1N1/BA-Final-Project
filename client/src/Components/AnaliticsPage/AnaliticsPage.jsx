/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import './AnaliticsPage.css';
import Taskbar from '../TaskBar/TaskBar';
import {renderChart} from '../Analitics/Analitics';
import Card from '../Card/Card'
import { render } from 'react-dom';

 const AnaliticsPage =(props) =>{
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const [posts, setPosts] = useState([]);
    useEffect(async()=>{
        const userId =  JSON.parse(localStorage.getItem('user')).userId;
        const data = await fetch('http://localhost:8888/analytics/cards')
        const newData = await data.json()
        console.log("Data is here" + newData.third_post.postid)

        await setPosts([
            {
                    username: newData.first_post.username,
                    id:newData.first_post.id,
                    postId: newData.first_post.postid,
                    creation_date: newData.first_post.creation_date,
                    profile_image: newData.first_post.profile_image,
                    content: newData.first_post.content
            }
            ,
            {
                username: newData.second_post.username,
                id:newData.second_post.id,
                postId: newData.second_post.postid,
                creation_date: newData.second_post.creation_date,
                profile_image: newData.second_post.profile_image,
                content: newData.second_post.content
            }
            ,
            {
                username: newData.third_post.username,
                id:newData.third_post.id,
                postId: newData.third_post.postid,
                creation_date: newData.third_post.creation_date,
                profile_image: newData.third_post.profile_image,
                content: newData.third_post.content
            }
        ])
        //console.log(posts.third_post.username)

    },[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async()=>{
        const canvas1 = document.getElementById("canvas1").getContext('2d');
        const canvas2 = document.getElementById("canvas2").getContext('2d');
        const canvas3 = document.getElementById("canvas3").getContext('2d');
        const value = await fetch('http://localhost:8888/analytics/global')
        
        const values = await value.json();
        console.log("value", values)
        let posts_counts = [];
        for(let i = 0; i < Object.keys(values.posts).length; i++ ){
            posts_counts.push(Number(values.posts[i].count))
        }
        console.log(posts_counts)

        let posts_usernames = [];
        for(let i = 0; i < Object.keys(values.posts).length; i++ ){
            posts_usernames.push(values.posts[i].username)
        }
        console.log(posts_usernames)
        //comments
        let comments_counts = [];
        for(let i = 0; i < Object.keys(values.comments).length; i++ ){
            comments_counts.push(Number(values.comments[i].count))
        }
        console.log(comments_counts)

        let comments_usernames = [];
        for(let i = 0; i < Object.keys(values.comments).length; i++ ){
            comments_usernames.push(values.comments[i].username)
        }
        console.log(comments_usernames)
        //reviews

        let reviews_counts = [];
        for(let i = 0; i < Object.keys(values.reviews).length; i++ ){
            reviews_counts.push(Number(values.reviews[i].count))
        }
        console.log(reviews_counts)

        let reviews_usernames = [];
        for(let i = 0; i < Object.keys(values.reviews).length; i++ ){
            reviews_usernames.push(values.reviews[i].username)
        }
        console.log(reviews_usernames)
        // const parsedValues = JSON.parse(values.posts)
       //const posts= parsedValues.posts
    //    const comments=JSON.parse(values.comments)
    //    const reviews=JSON.parse(values.reviews)
    //    console.log('posts are'+ JSON.parse(values.posts))

        renderChart('pie', canvas1, posts_counts, posts_usernames, "Posts");
        renderChart('pie', canvas2, comments_counts, comments_usernames, "Comments");
        renderChart('pie',canvas3, reviews_counts, reviews_usernames, "Reviews");

    },[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async() => {
        
        const canvas4 = document.getElementById("canvas4").getContext('2d');
        const canvas5 = document.getElementById("canvas5").getContext('2d');
        const canvas6 = document.getElementById("canvas6").getContext('2d');

        const userId =  JSON.parse(localStorage.getItem('user')).userId;
        const value = await fetch(`http://localhost:8888/analitics/${userId}`);
        let newValues = await value.json();
        let data1 = [JSON.parse(newValues.totalPosts), JSON.parse(newValues.postsResult)];
        let data2 = [JSON.parse(newValues.totalComments), JSON.parse(newValues.commentsResult)];
        let data3 = [JSON.parse(newValues.totalReviews), JSON.parse(newValues.reviewsResult)];
        
        renderChart('bar',canvas4, data1, ['Total Posts', 'Your posts'], 'Posts');
        renderChart('bar',canvas5, data2, ['Total Comments', 'Your comments'], 'Comments');
        renderChart('bar',canvas6, data3, ['Total Reviews', 'Your reviews'], 'Reviews');
    },[])
    const renderPosts = () => {
        return (
            <section className="analytics-posts" style={{display:'flex', flexFlow:'column nowrap', width:'100vw', justifyContent:'space-evenly', marginBottom:"20px"}}>
                    <div id="analytics-post-1" >
                    <Card 
                    username={posts[0].username}
                    userId={Number(posts[0].id)}
                    postId={Number(posts[0].postId)}
                    creationDate={posts[0].creation_date}
                    image={posts[0].profile_image}
                    message={decodeURI(posts[0].content)}
                    parent="analytics"
                    form='posts'
                    currentUser={JSON.parse(localStorage.getItem('user')).userId}
                    />
                    </div>
                    
                    <div id="analytics-post-2" >
                    <Card 
                    username={posts[1].username}
                    userId={Number(posts[1].id)}
                    postId={Number(posts[1].postId)}
                    creationDate={posts[1].creation_date}
                    image={posts[1].profile_image}
                    message={decodeURI(posts[1].content)}
                    parent="analytics"
                    form='posts'
                    currentUser={JSON.parse(localStorage.getItem('user')).userId}
                    />
                    
                    </div>
                    
                    <div id="analytics-post-3" >
                    <Card 
                    username={posts[2].username}
                    userId={Number(posts[2].id)}
                    postId={Number(posts[2].postId)}
                    creationDate={posts[2].creation_date}
                    image={posts[2].profile_image}
                    message={decodeURI(posts[2].content)}
                    parent="analytics"
                    form='posts'
                    currentUser={JSON.parse(localStorage.getItem('user')).userId}
                    />
                    </div>
                </section> 
        );
    }

    return(
            <div className="analytics-full-page">
            <Taskbar image={props.image} history={props.history}/>
            <div className="analytics-page">
            <section className="title_section" style={{borderBottom: '1px black solid'}}>
                <h1 className="title_card" style={{textAlign:'center'}}>
                    Analytics
                </h1>
            </section>

            <h3 className="subtitle">General Data</h3>
            <section >
                <section id="pies" className="pies">
                    <div id="pie1" className="pie">
                        <canvas id="canvas1" ></canvas>
                    </div>
                    <div id="pie2"className="pie" >
                        <canvas id="canvas2"></canvas>
                    </div>
                    <div id="pie3" className="pie" >
                        <canvas id="canvas3"></canvas>
                    </div>
                </section>
                    <h3 className="subtitle">Top 3 posts</h3>
                 {
                     posts.length > 0 ? renderPosts() : null
                 }
                <h3 className="subtitle">Personal Data</h3>
                <section id="bars">
                <div id="bar1" className="bars">
                        <canvas id="canvas4" ></canvas>
                    </div>
                    <div id="bar2" className="bars">
                        <canvas id="canvas5"></canvas>
                    </div>
                    <div id="bar3" className="bars" >
                        <canvas id="canvas6"></canvas>
                    </div>

                </section>
            
            </section>
            
        </div>
        </div>
        );
    }

export default AnaliticsPage;