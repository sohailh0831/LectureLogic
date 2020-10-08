import React from 'react'
import { Button, Form, Grid, Header, Segment, Popup } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
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

    componentDidMount() { // this is function called before render() ... use it to fetch any info u need
        // Simple GET request using fetch
        //console.log(localStorage.getItem("authenticated"))
        if(localStorage.getItem("authenticated") !== "authenticated"){
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
            .then(data => this.setState({ username: data.username , name: data.name, response: data, userId: data.id  })); // here's how u set variables u want to use later
        
        if (this.state.response.type === '1') { //if user is a student
            this.setState({isInstructor: false, popUpMessage: 'Join a Class'});
        }
        else { //else user is instructor
            this.setState({isInstructor: true, popUpMessage: 'Create New Class'});
        }
    }



    render() {
        if (this.state.popUpMessage !== undefined) {
            this.getClassList();
        }
        //console.log(this.state.isInstructor);

        return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Form size='large'>

                        <Segment stacked textAlign="center" verticalAlign='middle'>
                            <Header as = 'h2' color = 'grey' textAlign = 'center'>
                                Dashboard Temp Header
                            </Header>

                            <Popup content={this.state.popUpMessage} trigger={<Button icon='add' color='purple' onClick={this.handleAddClass} />} />
                            
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
    } /* End handleAddClass(...) */

    async getClassList() { //dont fuck with this... doesnt work
        console.log("Getting Student ClassList");
        if (this.state.type === '1') { //----------IF STUDENT----------
            await fetch('http://localhost:9000/class/studentClasses?user_id=' + this.state.userId ,{
                method: 'GET',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    id: this.state.userId
                })
            }).then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({classList: data})
            }).catch(console.log);
            //parse classlist
        }
        else{ //----------IF INSTRUCTOR----------
            console.log("Getting Instructor Classlist")
            await fetch('http://localhost:9000/class/instructorClasses?user_id=' + this.state.userId ,{
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
    } /* End getClassList(...) */


    
} export default Dashboard