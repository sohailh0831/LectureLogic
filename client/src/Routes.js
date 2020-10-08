import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Grid, Redirect } from "react-router-dom";
import {Link} from 'react-router-dom';
import {GlobalStyles} from './config/global';

import {
  Menu,
  Form
} from "semantic-ui-react"

import Register from './pages/Register';
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import errorPage from './pages/errorPage';
import Dashboard from './pages/Dashboard'
import ChangePassword from './pages/ChangePassword'




//TBH idk what that stuff above is ^^^ but i know what the stuff below this line is
export default class Routes extends React.Component {
    constructor(props) {
      super(props);
      this.handlePageJump = this.handlePageJump.bind(this);
      this.handleLogout = this.handleLogout.bind(this);

      this.state = {
        menuVisible: true,
      }
  
    } /* End constructor */
    render() {
      const {activeItem} = this.state;
      return(

        <div>
          <GlobalStyles/>
              <div className="Routes">
                  {/* This is the menu bar */}
                  <BrowserRouter>
                          <Menu attached="top" size="huge">
                              <Menu.Item
                                  as={Link}
                                  replace={false}
                                  to={{pathname: '/', state: {}}} //where we can pass values into state (access as this.props.state.____)
                                  name={"MainPage"}
                                  content="Home"
                                  onClick={this.handlePageJump}
                                  active={activeItem === 'MainPage'}
                              />
                              <Menu.Item
                                  as={Link}
                                  replace={false}
                                  to={{pathname: '/register', state: {}}} //where we can pass values into state (access as this.props.state.____)
                                  name={"Register"}
                                  content="Register"
                                  onClick={this.handlePageJump}
                                  active={activeItem === 'Register'}
                              />
                              <Menu.Item
                                  as={Link}
                                  replace={false}
                                  to={{pathname: '/login', state: {}}} //where we can pass values into state (access as this.props.state.____)
                                  name={"Login"}
                                  content="Login"
                                  onClick={this.handlePageJump}
                                  active={activeItem === 'Login'}
                              />
                              <Menu.Item
                                replace={false}
                                name={"Logout"}
                                content="Logout"
                                onClick={this.handleLogout}
                                active={activeItem === 'Logout'}
                              />
                          </Menu>

                          {/* NEW PAGES ADD PATHNAMES HERE */}
                          <Switch>
                            <Route exact path ="/" component={Login} />
                            <Route exact path ="/404" component = {errorPage} />
                            <Route exact path ="/login" component = {Login} />
                            <Route exaxt path ="/register" component ={Register}/>
                            <Route exact path ="/dashboard" component ={Dashboard}/>
                            <Route exact path ="/changePassword" component ={ChangePassword}/>
                            <Redirect to="/404" />
                          </Switch>

                          
                  </BrowserRouter>
                  </div>
        </div>
      ) /* End return(...) */
    } /* End render(){...} */

    handlePageJump(e, { name }) {
      this.setState({activeItem: name})
    }

    async handleLogout() {
      if (localStorage.getItem('authenticated') == 'authenticated'){ //make sure that
        await fetch("http://localhost:9000/logout", {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(res => res.text()).then((data) => { 
            localStorage.setItem("authenticated", "false");
            localStorage.clear(); //clears local storage
            window.location.replace('/login');
            this.setState({response: data})
        }).catch(console.log)
      }
      else {
        console.log("No user logged in");
      }
    }


  
  } /* End export default class Routes */
  