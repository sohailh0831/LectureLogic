import React from 'react'
import { Button, Form, Grid, Header, Segment} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.handleCurrentPasswordChange = this.handleCurrentPasswordChange.bind(this);
        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
        this.handleReNewPasswordChange = this.handleReNewPasswordChange.bind(this);
        this.handleChangePasswordFunction = this.handleChangePasswordFunction.bind(this);
        this.state = {
            currentPassword: '',
            newPassword: '',
            reNewPassword: '',
            response: '',
            loginError: false
        };
    }

    render() {
        if(localStorage.getItem("authenticated") !== "authenticated"){
               window.location.replace('/login'); 
        }
        const errorStatus = this.state.loginError;
        //console.log(errorStatus);
        return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                { errorStatus && <h1>Authentication Failed. Please Try Again</h1>}
                    <Header as='h2' color='grey' textAlign='center'>
                        Change Your Password
                    </Header>

                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='Current Password'
                                type='password'
                                required={true}
                                value={this.state.currentPassword}
                                onChange={this.handleCurrentPasswordChange}
                            />

                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='New Password'
                                type='password'
                                required={true}
                                value={this.state.newPassword}
                                onChange={this.handleNewPasswordChange}
                            />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Re-enter New Password'
                                type='password'
                                required={true}
                                value={this.state.reNewPassword}
                                onChange={this.handleReNewPasswordChange}
                            />

                            <Button onClick={this.handleChangePasswordFunction} color='purple' fluid size='large'>
                                Change Password
                            </Button>
                            
                            
                        </Segment>
                    </Form>
                </Grid.Column>
                
            </Grid>
            
            
            
        ) //End Return
    } //End Render


    //When the user types in stuff in the username box, the username variable is updated
    async handleCurrentPasswordChange(event) {
        const value = event.target.value;
        await this.setState({currentPassword: value});
    };
    async handleNewPasswordChange(event) {
        const value = event.target.value;
        await this.setState({newPassword: value});
    };
    async handleReNewPasswordChange(event) {
        const value = event.target.value;
        await this.setState({reNewPassword: value});
    };

    //when the "login" button is clicked
    async handleChangePasswordFunction() {
        await fetch("http://localhost:9000/changePassword", {
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                currentPassword: this.state.currentPassword,
                newPassword: this.state.newPassword,
                reNewPassword: this.state.reNewPassword
            })
        }).then(res => res.json()).then((data) => { 
            if(data === "OK"){ //successfully logged in
                localStorage.setItem("authenticated", "authenticated");
                console.log("successfully changed password")
                window.location.replace('/');
            }
            else{
           //window.location.replace('/login'); // need to flash that authentication failed
           console.log("password change fail")
            }
            this.setState({response: data})
        }).catch(console.log)
    }
    
}