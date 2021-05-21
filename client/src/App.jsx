import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Components/Login/Login.jsx';
import Main from './Components/Main/Main';
import Profile from './Components/Profile/Profile.jsx';
import AnalyticsPage from './Components/AnalyticsPage/AnalyticsPage.jsx';
import Chat from './Components/Chat/Chat'
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom'
import BasicComponent from './test.jsx';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './App.css';
import LandingRooms from './Components/Landing-Rooms/LandingRooms.jsx';


class App extends React.Component {
    
    constructor(props){
        super(props);
        this.state = { loggedIn: "false" };
    }
    changeState(){
        this.setState({loggedIn: "true"});
    }

    componentDidMount() {
        //this.callAPI();
            
    }
    render(){
        return (
            <BrowserRouter>
                <Switch>
                 <Route path="/" exact component={Login} />
                <Route path="/feed" component={Main} history={this.props.history}/>
                <Route path="/profile/:userId" component={Profile} history={this.props.history}/>
                <Route path="/analytics/:userId" component={AnalyticsPage} history={this.props.history}/>
                <Route path="/test" component={BasicComponent} history={this.props.history}/>
                <Route path='/rooms' component={LandingRooms} history={this.props.history}/>
                <Route path='/chat' component={Chat} history={this.props.history}/>     
                </Switch>
                {/* <Profile /> */}
            </BrowserRouter>
            
            
        );
    }
        
    
    
}

export default App;