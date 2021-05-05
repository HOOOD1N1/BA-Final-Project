import React from 'react';
import './Messages.css';
import { useEffect } from 'react';



export default function Chat(props) {
    useEffect(() => {
        if(props.messages.length > 0) {
            console.log("WE have lift off")
        } else console.log('No dice')
    },[])

    const checkSender = (message) => {
        const user = JSON.parse(localStorage.getItem('user'))
        console.log("The sender is ", message.sender)
        if(message.sender === user.userId) {
            
            return 'bubble bubble-bottom-left message-right';
        } else 
        { 
            return 'bubble bubble-bottom-left message-left'
        };
    }

    return ( 
        <div className = "messages-box" >
            {props?.messages.length > 0 
            ? props.messages.map((message) => {
                let messageClass = checkSender(message)
                return (
                <div className="box-message" style={{display:'block', width:'100%'}}>
                <div className={messageClass} style={{marginBottom:'10px'}}>
                    {message.message}
                </div>
                </div>
                );
            })
            : 'Click on a friend to start chating'
        }
        </div>
    );

}