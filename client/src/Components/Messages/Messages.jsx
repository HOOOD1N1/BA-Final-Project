import React from 'react';
import './Messages.css';
import { useState, useEffect } from 'react';



export default function Chat(props) {
    const [messages, setMessages] = useState([]);
    useEffect(() => {

    })
    return ( 
        <div className = "messages-box" >
            Message
        </div>
    );

}