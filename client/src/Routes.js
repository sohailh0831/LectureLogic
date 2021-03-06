import React from "react";
import { BrowserRouter, Route, Switch, Redirect, } from "react-router-dom";
import {Link} from 'react-router-dom';
import {Header} from 'semantic-ui-react';
import {GlobalStyles} from './config/global';

import {
  Menu,
  Sidebar
} from "semantic-ui-react"

import Register from './pages/Register';
import Login from './pages/Login';
import errorPage from './pages/errorPage';
import Dashboard from './pages/Dashboard'
import ChangePassword from './pages/ChangePassword'
import ChangeEmail from './pages/ChangeEmail'
import LectureView from './pages/LectureView.js'
import DetailPage from './pages/Details';
import ClassPage from './pages/ClassPage';
import Confidence from './pages/ViewConfidence';
import DiscussionBoard from "./pages/DiscussionBoard";
import ClassNotifications from "./pages/ClassNotifications";
import ClassMessages from "./pages/ClassMessages";
import UserMessages from "./pages/UserMessages";
import UserNotifications from "./pages/UserNotifications";
import ClassDiscussionBoard from "./pages/ClassDiscussionBoard";
import EditQuiz from "./pages/EditQuiz";
import TakeQuiz from "./pages/TakeQuiz";
import StudentType from "./pages/StudentType";
import Quiz from "./pages/Quiz";
import Grades from "./pages/GradesView.js"




//TBH idk what that stuff above is ^^^ but i know what the stuff below this line is
export default class Routes extends React.Component {
    constructor(props) {
      super(props);
      this.handlePageJump = this.handlePageJump.bind(this);
      this.handleLogout = this.handleLogout.bind(this);
      this.handleSidebar = this.handleSidebar.bind(this);

      this.state = {
        menuVisible: true,
        sidebarVisible: false
      }
  
    } /* End constructor */

    render() {
      const {activeItem} = this.state;
      var iconName;
      if (localStorage.getItem('authenticated') === 'authenticated') {
        iconName = 'user';
      }
      else {
        iconName = 'align justify';
      }
      return( 
        <div>
          <GlobalStyles/>
              <div className="Routes">
                  {/* This is the menu bar */}
                  <BrowserRouter>
                        <Menu attached="top" size="massive">
                            <Menu.Item
                                  as={Link}
                                  //replace={false}
                                  to={{pathname: '/', state: {}}} //where we can pass values into state (access as this.props.state.____)
                                  name={"MainPage"}
                                  content="Dashboard"
                                  onClick={this.handlePageJump}
                                  active={activeItem === 'MainPage'}
                               />
                            {/* <Menu.Item
                                  as={Link}
                                  //replace={false}
                                  to={{pathname: '/confidence', state: {}}} //where we can pass values into state (access as this.props.state.____)
                                  name={"Confidence"}
                                  content="Confidence"
                                  onClick={this.handlePageJump}
                                  active={activeItem === 'Confidence'}
                              /> */}
                            <Menu.Item
                                  as={Link}
                                  //replace={false}
                                  to={{pathname: '/grades', state: {}}} //where we can pass values into state (access as this.props.state.____)
                                  name={"Grades"}
                                  content="Grades"
                                  onClick={this.handlePageJump}
                                  active={activeItem === 'Grades'}
                              />
                            <Menu.Item
                                  position='right'
                                  icon={iconName}
                                  //name={"Menu"}
                                  //content="Menu"
                                  //content="Sidebar"
                                  //floated='right'
                                  onClick={this.handleSidebar}
                                  active={activeItem === 'Menu'}
                              />
                        </Menu>

                        {/* This is the side menu bar */}

                              
                          <Sidebar.Pusher>
                            <Sidebar
                              as={Menu}
                              animation='overlay'
                              //icon='labeled'
                              inverted
                              onHide={() => this.setState({sidebarVisible: false})}
                              vertical
                              visible={this.state.sidebarVisible}
                              width='thin'
                              direction='right'
                            >
                              <Menu.Item
                                  as={Link}
                                  //replace={false}
                                  to={{pathname: '/changePassword', state: {}}} //where we can pass values into state (access as this.props.state.____)
                                  name={"ChangePassword"}
                                  content="Change Password"
                                  onClick={this.handlePageJump}
                                  active={activeItem === 'ChangePassword'}
                              />
                              <Menu.Item
                                  as={Link}
                                  //replace={false}
                                  to={{pathname: '/changeEmail', state: {}}} //where we can pass values into state (access as this.props.state.____)
                                  name={"ChangeEmail"}
                                  content="Change Email"
                                  onClick={this.handlePageJump}
                                  active={activeItem === 'ChangeEmail'}
                              />
                              <Menu.Item
                                  as={Link}
                                  //replace={false}
                                  to={{pathname: '/register', state: {}}} //where we can pass values into state (access as this.props.state.____)
                                  name={"Register"}
                                  content="Register"
                                  onClick={this.handlePageJump}
                                  active={activeItem === 'Register'}
                              />
                              <Menu.Item
                                  as={Link}
                                  //replace={false}
                                  to={{pathname: '/login', state: {}}} //where we can pass values into state (access as this.props.state.____)
                                  name={"Login"}
                                  content="Login"
                                  onClick={this.handlePageJump}
                                  active={activeItem === 'Login'}
                              />
                              <Menu.Item
                                  //replace={false}
                                  visible={localStorage.getItem('authenticated') !== 'authenticated'}
                                  name={"Logout"}
                                  content="Logout"
                                  onClick={this.handleLogout}
                                  active={activeItem === 'Logout'}
                              />
                            </Sidebar>
                          </Sidebar.Pusher>

                          {/* NEW PAGES ADD PATHNAMES HERE */}
                          <Switch>
                            <Route exact path ="/" component={Login} />
                            <Route exact path ="/404" component = {errorPage} />
                            <Route exact path ="/login" component = {Login} />
                            <Route exaxt path ="/register" component ={Register}/>
                            <Route exact path ="/dashboard" component ={Dashboard}/>
                            <Route exact path ="/changePassword" component ={ChangePassword}/>
                            <Route exact path ="/changeEmail" component ={ChangeEmail}/>
                            <Route path ="/LectureView/:lectureId" component={LectureView}/>
                            <Route path ="/DiscussionBoard/:lectureId" component={DiscussionBoard}/>
                            <Route path = "/ClassDiscussionBoard/:classId" component={ClassDiscussionBoard}/>
                            <Route exact path ="/detailPage" component={DetailPage}/>
                            <Route path ="/classPage/:className" exact component={ClassPage}/>
                            <Route path ="/confidence" exact component={Confidence}/>
                            <Route path ="/classNotifications/:classId" exact component={ClassNotifications}/>
                            <Route path ="/classMessages/:classId" exact component={ClassMessages}/>
                            <Route path ="/userNotifications" exact component={UserNotifications}/>
                            <Route path ="/userMessages" exact component={UserMessages}/>
                            <Route path ="/quizzes/:classId" exaxt component ={Quiz}/>
                            <Route path = "/editQuiz/:classId/:quizId" exact component ={EditQuiz}/>
                            <Route path = "/takeQuiz/:classId/:quizId" exact component ={TakeQuiz}/>
                            <Route path = "/studentType/:classId/:quizId" exact component ={StudentType}/>
                            <Route exact path ="/grades" exact component={Grades}/>
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

    handleSidebar(e, { name }) {
      this.setState({sidebarVisible: true, activeItem: name})
    }

    

    async handleLogout() {
      if (localStorage.getItem('authenticated') === 'authenticated'){ //make sure that
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
  