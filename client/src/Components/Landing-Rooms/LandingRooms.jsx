import React, { useState } from 'react';
import {useEffect} from 'react';
import {Redirect, Link} from 'react-router-dom';
import './LandingRooms.css';
import TaskBar from '../TaskBar/TaskBar'
export default function LandingRooms(props) {

    return (
        <div className="rooms">
            <TaskBar history={props.history}/>
            <div className="rooms-main">
                <div className="create-room">
                    <input type="text" id="search-rooms" placeholder='Search Rooms...'/>
                    <button id="create-room-button">Create Room</button>
                </div>
            </div>
        </div>
    );

}