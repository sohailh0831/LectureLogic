import React from 'react'
import { Button, Form, Grid, Header, Segment} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

export default class ChangeEmail extends React.Component {
    constructor(props) {
        super(props);
        this.handleNewEmailChange = this.handleNewEmailChange.bind(this);
        this.handleReNewEmailChange = this.handleReNewEmailChange.bind(this);
        this.handleChangeEmailFunction = this.handleChangeEmailFunction.bind(this);
        this.state = {
            newEmail: '',
            reNewEmail: '',
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
                        Change Your Email
                    </Header>

                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='New Email'
                                type='email'
                                required={true}
                                value={this.state.newEmail}
                                onChange={this.handleNewEmailChange}
                            />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Re-enter New Email'
                                type='email'
                                required={true}
                                value={this.state.reNewEmail}
                                onChange={this.handleReNewEmailChange}
                            />

                            <Button onClick={this.handleChangeEmailFunction} color='green' fluid size='large'>
                                Change Email
                            </Button>
                            
                            
                        </Segment>
                    </Form>
                </Grid.Column>
                
            </Grid>
            
            
            
        ) //End Return
    } //End Render


    //When the user types in stuff in the username box, the username variable is updated
    async handleNewEmailChange(event) {
        const value = event.target.value;
        await this.setState({newEmail: value});
    };
    async handleReNewEmailChange(event) {
        const value = event.target.value;
        await this.setState({reNewEmail: value});
    };

    //when the "login" button is clicked
    async handleChangeEmailFunction() {
        await fetch("http://localhost:9000/reset-email", {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                newEmail: this.state.newEmail,
                reNewEmail: this.state.reNewEmail
            })
        }).then(res => res.json()).then((data) => { 
            if(data === "OK"){ //successfully logged in
                localStorage.setItem("authenticated", "authenticated");
                console.log("successfully changed email")
                window.location.replace('/');
            }
            else{
           //window.location.replace('/login'); // need to flash that authentication failed
           console.log("email change fail")
            }
            this.setState({response: data})
        }).catch(console.log)
    }
    
}