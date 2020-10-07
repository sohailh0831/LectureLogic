import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal, Icon, Message } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Redirect } from "react-router-dom";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            username: '',
            password: '',
            email_reset: '',
            response: '',
        };
    }

    componentDidMount() { // this is function called before render() ... use it to fetch any info u need
        // Simple GET request using fetch
        //console.log(localStorage.getItem("authenticated"))
        if(localStorage.getItem("authenticated") != "authenticated"){
            window.location.replace('/login'); //redirects to login if not already logged in
        }
        fetch('http://localhost:9000/dashboard' ,{
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(response => response.json())
            .then(data => this.setState({ username: data.username , name: data.name  })); // here's how u set variables u want to use later
    }



    render() {
        return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>

                    <Header as='h2' color='grey' textAlign='center'>
                        Welcome {this.state.name}
                    </Header>
                    <p>{this.state.testResponse}</p>
                    <Form size='large'>
                        <Segment stacked>
                            <Button onClick={this.handleLogout} color='purple' fluid size='large'>
                                Logout
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

    async handleLogout() {
        await fetch("http://localhost:9000/logout", {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(res => res.text()).then((data) => { 
           // console.log(data); //if it makes it here, it was succesful
            localStorage.setItem("authenticated", "false");
                window.location.replace('/login');
            // if(data == "OK"){ //successfully logged in
            //     localStorage.setItem("authenticated", "false");
            //     window.location.replace('/login');
            // }
            // else{
            //     localStorage.setItem("authenticated", "false");
            //     window.location.replace('/login');
            // }
            this.setState({response: data})
        }).catch(console.log)
    }
    
}

export default Dashboard