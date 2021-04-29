import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Components/Login/Login.jsx';
import Main from './Components/Main/Main';
import Profile from './Components/Profile/Profile.jsx';
import AnaliticsPage from './Components/AnaliticsPage/AnaliticsPage.jsx';
import Chat from './Components/Chat/Chat'
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom'
import BasicComponent from './test.jsx';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './App.css';


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
                <Route path="/feed" component={Main}/>
                <Route path="/profile/:userId" component={Profile} history={this.props.history}/>
                <Route path="/analitics/:userId" component={AnaliticsPage}/>
                <Route path="/test" component={BasicComponent}/>
                <Route path='/chat' component={Chat}/>     
                </Switch>
                {/* <Profile /> */}
            </BrowserRouter>
            
            
        );
    }
        
    
    
}

export default App;