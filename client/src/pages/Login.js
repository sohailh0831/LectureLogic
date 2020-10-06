import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal, Icon, Message } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Redirect } from "react-router-dom";

class Login extends React.Component {
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
        };
    }

    render() {
        return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>

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
        console.log("handle login");
        //THIS IS WHERE THE FETCH NEEDS TO GO---------------------------------------------
    }
    
}

export default Login