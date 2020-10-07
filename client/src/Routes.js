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
import Dashboard from './pages/Dashboard';




//TBH idk what that stuff above is ^^^ but i know what the stuff below this line is
export default class Routes extends React.Component {
    constructor(props) {
      super(props);
      this.handlePageJump = this.handlePageJump.bind(this);

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
                          </Menu>

                          {/* NEW PAGES ADD PATHNAMES HERE */}
                          <Switch>
                            <Route exact path ="/" component={Login} />
                            <Route exact path ="/404" component = {errorPage} />
                            <Route exact path ="/login" component = {Login} />
                            <Route exaxt path ="/register" component ={Register}/>
                            <Route exact path ="/dashboard" component ={Dashboard}/>
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


  
  } /* End export default class Routes */
  