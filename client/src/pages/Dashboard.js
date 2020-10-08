import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal, Icon, Message, Popup } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { Redirect } from "react-router-dom";
import ClassCard from './ClassCard';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            userId: '',
            response: '',
            classList: '',
            newClassDesc: '',
            isInstructor: ''
        };
        this.handleAddClass = this.handleAddClass.bind(this);
        this.getClassList = this.getClassList.bind(this);

    }

    async componentDidMount() { // this is function called before render() ... use it to fetch any info u need
        // Simple GET request using fetch
        //console.log(localStorage.getItem("authenticated"))
        if(localStorage.getItem("authenticated") != "authenticated"){
            window.location.replace('/login'); //redirects to login if not already logged in
        }
        await fetch('http://localhost:9000/dashboard' ,{
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(response => response.json())
            .then(data => this.setState({ username: data.username , name: data.name, response: data, userId: data.id  })); // here's how u set variables u want to use later
        
        if (this.state.response.type == '1') {
            this.setState({isInstructor: false});
        }
        else {
            this.setState({isInstructor: true});
        }
    }



    render() {
        console.log(this.state.response);
        //this.getClassList();
        console.log(this.state.isInstructor);

        return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Form size='large'>

                        <Segment stacked textAlign="center" verticalAlign='middle'>
                            <Header as = 'h2' color = 'grey' textAlign = 'center'>
                                Dashboard Temp Header
                            </Header>

                            {/* <Button color='purple' icon='add' popup={'Add a New Class'} size='large' onClick={this.handleAddClass} /> */}
                            <Segment hidden={this.state.isInstructor}> 
                                <Popup content='Add a Class' trigger={<Button icon='add' color='purple' onClick={this.handleAddClass} />} />
                            </Segment>
                        </Segment>

                    </Form>
                </Grid.Column>
            </Grid>


            //<ClassCard> {this.state.classList, this.state.classDescList} </ClassCard> -- ideally this works first shot but honestly prolly not lol
        ) //End return(...)
    } //End redner{}(...)

    async handleAddClass() { //absolutely doesnt work dont try it and dont fuck with it
        console.log("Adding a Class");
        await fetch("http://localhost:9000/class/addClass", {
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                name: this.state.name,
                description: this.state.addClassDesc,
                instrucor_id: this.state.userId,
            })
        }).then(res => res.json()).then((data) => { 
            console.log(data);
            this.setState({response: data})
        }).catch(console.log)
    }

    async getClassList() { //dont fuck with this... doesnt work
        console.log("Getting classList");
        await fetch('http://localhost:9000/class/classlist' ,{
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({classList: data})
        }).catch(console.log);
        //parse classlist
    }


    
} export default Dashboard