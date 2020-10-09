import React from 'react'
import { Button, Form, Grid, Header, Segment, Popup, Modal } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import ClassDetailsCard from './ClassDetailsCard';

export default class Details extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            userId: '',
            response: '',
            classList: [],
            newClassDesc: '',
            type: '',
            school: '',
            listReceived: false,
            studentList: []
        };
        

    }

    async componentDidMount() { // this is function called before render() ... use it to fetch any info u need
        // Simple GET request using fetch
        //console.log(localStorage.getItem("authenticated"))
        if(localStorage.getItem("authenticated") !== "authenticated"){
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
            .then(data => {
                this.setState({ username: data.username , name: data.name, response: data, userId: data.id, type: data.type, school: data.school })
            }); // here's how u set variables u want to use later

        console.log("Class Id: " + this.props.classId);
        await fetch('http://localhost:9000/requestClass?class_id=' + this.props.classId ,{
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(response => response.json())
            .then(data => {
                console.log(data.student_list);
            }); // here's how u set variables u want to use later
    
    }



    render() {
            return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Form size='large'>

                        <Segment stacked textAlign="center" verticalAlign='middle'>
                            <Header as = 'h2' color = 'grey' textAlign = 'center'>
                                {/* display classId as header*/}
                                {this.props.classId};
                            </Header>
                        </Segment>

                <Grid.Column style={{width: "auto"}}>
                    {this.state.studentList.map((index) => {
                            return(<ClassDetailsCard studentName={this.state.studentList[index]} studentEmail={this.state.studentList[index]} />)
                        }
                    )}
                </Grid.Column>

                    </Form>
                </Grid.Column>
            </Grid>
    
    
            ) //End return(...)
                //return(<ClassCard className={this.state.classList.name} classDesc={this.state.description} />);// -- ideally this works first shot but honestly prolly not lol
    }//End redner{}(...)

    
} 