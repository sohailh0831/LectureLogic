/* MainPage.js -- Handles registering a new user */
import React from "react";
import {Button, Form, Grid, Message, Segment, Icon, Header, Label, Radio, FormField} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import { Redirect } from "react-router-dom";


export default class MainPage extends React.Component {
    constructor(props) {
        super(props); //Helps to pass variables from Routes.jsx to all other pages (a.k.a. keep a user logged in)
        /* This is the format and location to handle declaring functions you are goinmg to use */


        /* 
         * This is the area to declare global variables you are going to use.
         * To access, use this.state.variableName to access.
         */
        this.state = {
            response: '' // I just set this variable to whatever is returned from the database... makes it easier then making new variables all the time
        };
    } /* End Constructor */

    render() {
        return(
            <Header as = 'h2' color = 'grey' textAlign = 'center'>
                Main Page w/ Semantic UI
            </Header>

        ) /* End return */
    } /* End render(){...} */


} /* End default class MainPage */