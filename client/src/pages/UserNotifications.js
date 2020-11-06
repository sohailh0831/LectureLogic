import React from 'react'
import { Button, Form, Grid, Header, Segment, Popup, Modal, List } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

class UserNotifications extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            userId: '',
            response: '',
            notifications: [],
            classList: [],
            newClassDesc: '',
            type: '',
            school: '',
            listReceived: false,
            studentList: []
        };
        this.handleGetNotifications = this.handleGetNotifications.bind(this);
        this.handleClearNotifications = this.handleClearNotifications.bind(this);
        

    }

    async componentDidMount() { // this is function called before render() ... use it to fetch any info u need
        // Simple GET request using fetch
        //console.log(localStorage.getItem("authenticated"))
        if(localStorage.getItem("authenticated") !== "authenticated"){
            window.location.replace('/login'); //redirects to login if not already logged in
        }
        let tmpId;
        await fetch('http://localhost:9000/dashboard' ,{
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(response => response.json())
            .then(data => {
                this.setState({ username: data.username , name: data.name, response: data, userId: data.id, type: data.type, school: data.school });
                console.log(data.class_id);
            }); // here's how u set variables u want to use later
    
        this.handleGetNotifications();


    }



    render() {

        console.log("SCHOOL "+this.state.response);
            return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle' columns={2}>
                <Grid.Column style={{maxWidth: 450}}>
                    <Form size='large'>
                        {/* Class Card */}
                        <Grid.Column style={{width: "auto"}}>
                            <Segment stacked textAlign="left" verticalAlign='middle'> Notifications </Segment>
                            <Segment stacked textAlign="left" verticalAlign='middle'>
                                    <List>
                                    {this.state.notifications.map(index => (
                                        <List.Item>
                                        <List.Header>From: {index.class} </List.Header> 
                                        <p>Message: {index.content}</p> 
                                        <p>Timestamp: {index.time}</p> 
                                        </List.Item>
                                    )
                                        )}
                                    
                                    </List>
                            </Segment>
                            
                        </Grid.Column>
                        
                    </Form>
                               
                </Grid.Column>
                <Grid.Column style={{maxWidth: 450}}>                       
                <Button onClick={this.handleClearNotifications} color='purple' fluid size='large'>
                        Clear Notifications
                    </Button>
                </Grid.Column>                
            </Grid>


        ) //End return(...)
            //return(<ClassCard className={this.state.classList.name} classDesc={this.state.description} />);// -- ideally this works first shot but honestly prolly not lol
        
    }//End redner{}(...)


    async handleGetNotifications() {
        await fetch(`http://localhost:9000/Notifications`, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(res => res.json()).then((data) => { 
            console.log("data",data);
            this.setState({notifications: data || [] })
            // window.location.replace('/dashboard');
        }).catch(console.log("ok"))
    } /* End handleGetNotifications(...) */
   
    async handleClearNotifications() {
        await fetch(`http://localhost:9000/clearnotifications`, {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).catch(console.log("ok"))
    } /* End handleGetNotifications(...) */
   
   
} export default UserNotifications