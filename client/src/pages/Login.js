import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal, Icon, Message } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Redirect } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.state = {
            username: '',
            password: '',
            email_reset: '',
            response: '',
            loginError: false
        };
    }

    render() {
        //console.log("local in login: " + localStorage.getItem("authenticated"))
        if(localStorage.getItem("authenticated") == "authenticated"){
               window.location.replace('/dashboard'); //redirects to dashboard if already logged in
        }
        const errorStatus = this.state.loginError;
        //console.log(errorStatus);
        return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                { errorStatus && <h1>Authentication Failed. Please Try Again</h1>}
                    <Header as='h2' color='grey' textAlign='center'>
                        Log-in to your account
                    </Header>

                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='Username'
                                required={true}
                                value={this.state.username}
                                onChange={this.handleUserChange}
                            />

                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                required={true}
                                value={this.state.password}
                                onChange={this.handlePasswordChange}
                            />

                            <Button onClick={this.handleLogin} color='purple' fluid size='large'>
                                Login
                            </Button>
                            
                            
                        </Segment>
                    </Form>
                </Grid.Column>
                
            </Grid>
            
            
            
        ) //End Return
    } //End Render


    //When the user types in stuff in the username box, the username variable is updated
    async handleUserChange(event) {
        const value = event.target.value;
        await this.setState({username: value});
    };

    //When the user types in stuff in the password box, the password variable is updated
    async handlePasswordChange(event) {
        const value = event.target.value;
        await this.setState({password: value});
    };

    //when the "login" button is clicked
    async handleLogin() {
        await fetch("http://localhost:9000/login", {
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            })
        }).then(res => res.json()).then((data) => { 
            if(data == "OK"){ //successfully logged in
                localStorage.setItem("authenticated", "authenticated");
            }
            else{
           //window.location.replace('/login'); // need to flash that authentication failed
           this.setState.loginError = true;
           localStorage.setItem("authenticated", "not");
            }
            this.setState({response: data})
        }).catch(console.log)
    }
    
}

//export default Login