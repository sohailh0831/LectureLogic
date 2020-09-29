/* Register.jsx -- Handles registering a new user */
import React from "react";
import {Button, Form, Grid, Message, Segment, Icon, Header, Label} from "semantic-ui-react";


export default class Register extends React.Component {
    constructor(props) {
        super(props); //Helps to pass variables from Routes.jsx to all other pages (a.k.a. keep a user logged in)
        /* This is the format and location to handle declaring functions you are goinmg to use */
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfirmPasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


        /* 
         * This is the area to declare global variables you are going to use.
         * To access, use this.state.variableName to access.
         */
        this.state = {
            email: '',
            name: '',
            username: '',
            password: '',
            confirm_password: '',
            response: '' // I just set this variable to whatever is returned from the database... makes it easier then making new variables all the time
        };

    } /* End constructor() */


    //Main render method that is called on load or when the component's state changes
    render() { 
        return(
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Segment textAlign="center">
                    <Header as = 'h2' color = 'grey' textAlign = 'center'>
                        Register for an Account
                    </Header>
                    <Button color='yellow' fluid size='large' active={this.state.enabled} onClick={this.handleSubmit}>
                        Register
                    </Button>
                </Segment>
        </Grid>
        )


        
    } /* End render() */



    /* FUNCTIONS */
    async handleEmailChange() {
        console.log("Email Change");
    }
    async handleUsernameChange() {
        console.log("Username Change");

    }
    async handlePasswordChange() {
        console.log("Password Change");
    }
    async handleConfirmPasswordChange() {
        console.log("Password Conf Change");

    }
    async handleSubmit() {
        console.log("Submit Pressed");
    }






} /* End default class Register{} */