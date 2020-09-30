import React from 'react';
import logo from './logo.svg';
import './App.css';

import {BrowserRouter as Router, Route, Switch, Link, Redirect} from "react-router-dom";
/* pages */
import MainPage from './pages';
import errorPage from './pages/errorPage';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PWReset from './pages/resetPass';


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
    <Router>
      <Switch>
      <Route exact path ="/" component={MainPage} />
      <Route exact path ="/404" component = {errorPage} />

      <Route exact path ="/login" component = {SignIn} />
      <Route exaxt path ="/register" component ={SignUp}/>
      <Route exaxt path ="/resetpass" component ={PWReset}/>
      <Redirect to="/404" />
      </Switch>
    </Router>
  )
}


  // render() {
  // return (
  //   <div className="App">
  //     <p>{this.state.apiResponse}</p>
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
        
  //     </header>
  //   </div>
  // );
  // }
}

export default App;
