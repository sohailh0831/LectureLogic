import React from 'react';
import logo from './logo.svg';
import './App.css';

import {BrowserRouter as Router, Route, Switch, Link, Redirect} from "react-router-dom";
/* pages */

import Routes from './Routes';


class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {apiResponse:""};
  }

  callAPI(){
    
    fetch("http://localhost:9000/testAPI")
    .then(res => res.text())
    .then(res => this.setState({apiResponse: res})
    );
  }

  componentWillMount(){
    this.callAPI();
  }


  render(){
    return(
      <div className="App">
        <Routes/>
      </div>

      

      //<Routes/>

      // <Switch>
        //   <Route exact path ="/" component={MainPage} />
        //   <Route exact path ="/404" component = {errorPage} />

        //   <Route exact path ="/login" component = {Login} />
        //   <Route exaxt path ="/register" component ={Register}/>
        //   <Redirect to="/404" />
        // </Switch>
    )
  }

}

export default App;
