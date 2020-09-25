import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Form, Grid } from "react-router-dom";
import {Link} from 'react-router-dom';
import Register from "./pages/Register";


//TBH idk what that stuff above is ^^^ but i know what the stuff below this line is
export default class Routes extends React.Component {
    constructor(props) {
      this.state = {
        username = undefined
      }
  
    } /* End constructor */
    render() {
      console.log("ROUTES!"); //just testing to see when exactly i make it to routes
      window.location.href="/login"
    }
  
  }
  