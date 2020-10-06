/* Register.js -- Handles registering a new user */
import React from "react";
import {Button, Form, Grid, Message, Segment, Icon, Header, Label, Radio, FormField} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import { Redirect } from "react-router-dom";


export default class Register extends React.Component {
    constructor(props) {
        super(props); //Helps to pass variables from Routes.jsx to all other pages (a.k.a. keep a user logged in)
        /* This is the format and location to handle declaring functions you are goinmg to use */
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleSchoolChange = this.handleSchoolChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
        this.handleRegister = this.handleRegister.bind(this);


        /* 
         * This is the area to declare global variables you are going to use.
         * To access, use this.state.variableName to access.
         */
        this.state = {
            email: '',
            name: '',
            phone: '',
            school: '',
            username: '',
            password: '',
            confirmPassword: '',
            //student: true,
            response: '' // I just set this variable to whatever is returned from the database... makes it easier then making new variables all the time
        };

    } /* End constructor() */


    //Main render method that is called on load or when the component's state changes
    render() { 
        return(
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Form size='large'>
                    <Segment stacked textAlign="center" verticalAlign='middle'>
                        <Header as = 'h2' color = 'grey' textAlign = 'center'>
                            Register for an Account
                        </Header>

                        {/* Need student/instructor  */}

                        {/* Email Input */}
                        <Form.Input
                            placeholder='Email'
                            required={true}
                            value={this.state.email}
                            onChange={this.handleEmailChange}
                        />

                        {/* Name Input */}
                        <Form.Input
                            placeholder='Name'
                            required={true}
                            value={this.state.name}
                            onChange={this.handleNameChange}
                        />

                        {/* Phone Input */}
                        <Form.Input
                            placeholder='Phone Number: 999-999-9999'
                            type='tel' pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
                            required={true}
                            value={this.state.phone}
                            onChange={this.handlePhoneChange}
                        />

                        {/* Username Input */}
                        <Form.Input
                            placeholder='Username'
                            required={true}
                            value={this.state.username}
                            onChange={this.handleUsernameChange}
                        />

                        {/* Password Input */}
                        <Form.Input
                            placeholder='Password'
                            required={true}
                            type='password'
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                        />

                        {/* Confirm Password Input -- Look at making sure passwords match*/}
                        <Form.Input
                            placeholder='Confirm Password'
                            required={true}
                            type='password'               //'match[password]'
                            value={this.state.confirmPassword}
                            onChange={this.handleConfirmPasswordChange}
                        />

                        {/* Student/Instructor Radio Input */}
                        <FormField>
                            Register as: <b>{this.state.value}</b>
                        </FormField>
                        <FormField>
                            <Radio
                             label='Student'
                                name='radioGroup'
                                value='Student'
                                checked={this.state.value === "Student"}
                                onChange={this.handleStudentChange}
                            />
                            <Radio
                                label='Instructor'
                                name='radioGroup'
                                value='Instructor'
                                checked={this.state.value === "Instructor"}
                                onChange={this.handleStudentChange}
                            />
                        </FormField>

                        <br/>

                        {/* Register Button */}
                        <Button color='purple' fluid size='large' active={this.state.enabled} onClick={this.handleRegister}>
                            Register
                        </Button>

                    </Segment>
                </Form>
        </Grid>
        ) /*End return(...) */
    } /* End render(){...} */



    /* FUNCTIONS */
    async handleNameChange(event) {
        const value = event.target.value;
        await this.setState({name: value});
        console.log(this.state.name);
    }
    async handleEmailChange(event) { 
        const value = event.target.value;           //All "change" function act to update the state variables with the information that the user is typing
        await this.setState({email: value});     //This makes it easier to give information to the backend
        console.log("Email Change");
    }
    async handleUsernameChange(event) {
        const value = event.target.value;
        await this.setState({username: value});
        console.log("Username Change");
    }
    async handlePhoneChange(event) {
        const value = event.target.value;
        await this.setState({phone: value});
        console.log(this.state.phone);
    }
    async handleSchoolChange(event) {
        const value = event.target.value;
        await this.setState({school: value});
        console.log(this.state.school);
    }
    async handlePasswordChange(event) {
        const value = event.target.value;
        await this.setState({password: value});
        console.log(this.state.password);
    }
    async handleConfirmPasswordChange(event) {
        const value = event.target.value;
        await this.setState({confirmPassword: value});
        console.log(this.state.confirmPassword);
    }
    
    handleStudentChange = (e, { value }) => this.setState({ value })

    
    async handleRegister() {
        console.log(this.state.value);
        //handle phonenumber shortening -- USE phone_tmp TO ACCESS PHONE NUMBER IN HERE
        let phone_tmp = this.state.phone;
        phone_tmp = phone_tmp.replace(/\D/g,'');

        console.log(phone_tmp);
        await fetch("http://localhost:9000/register", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username,
                phone_number: phone_tmp,
                password: this.state.password,
                name: this.state.name,
                email: this.state.email,
                type: this.state.value,
                school: this.state.school
            })
        }).then(res => res.json()).then((data) => { 
            console.log(data); //if it makes it here, it was succesful
            window.location.replace('/login'); //redirect to login page 
            this.setState({response: data})
        }).catch(console.log);

    }






} /* End default class Register{} */