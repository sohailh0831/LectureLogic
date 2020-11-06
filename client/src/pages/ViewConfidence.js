import React from 'react'
import {Form, Grid, Segment, List } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

class Confidence extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            userId: '',
            response: '',
            response2: '',
            response3: '',
            response4: '',
            classList: [],
            newClassDesc: '',
            type: '',
            school: '',
            listReceived: false,
            studentList: []
        };
        this.handleGetConfidence = this.handleGetConfidence.bind(this);
        this.handleGetAllConfidence = this.handleGetAllConfidence.bind(this);
        this.handleGetAvgConfidence = this.handleGetAvgConfidence.bind(this);
        // this.getClassList = this.getClassList.bind(this);
        // this.handleClassNameChange = this.handleClassNameChange.bind(this);
        // this.handleClassDescChange = this.handleClassDescChange.bind(this);
        

    }

    async componentDidMount() { // this is function called before render() ... use it to fetch any info u need
        // Simple GET request using fetch
        //console.log(localStorage.getItem("authenticated"))
        if(localStorage.getItem("authenticated") !== "authenticated"){
            window.location.replace('/login'); //redirects to login if not already logged in
        }
        //let tmpId;
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
    
        this.handleGetConfidence();
        this.handleGetAvgConfidence();
        this.handleGetAllConfidence();

    }



    render() {
        /* decided what popup message to present */
        //let popUpMessage;

        //popUpMessage = 'Create New Class';

       
        // console.log(this.state.classList);
        console.log("SCHOOL "+this.state.response);
            //console.log("DASH TYPE: "+this.state.response.type);
            return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Form size='large'>
                        <Grid.Column style={{width: "auto"}}>
                            <Segment stacked textAlign="left" verticalAlign='left'>
                                <p>Class Average Confidence: {this.state.response4}</p> 
                            </Segment>
                        </Grid.Column>
                        <Grid.Column style={{width: "auto"}}>
                            <Segment stacked textAlign="left" verticalAlign='left'>
                                <p>Confidence: {this.state.response2}</p> 
                            </Segment>
                        </Grid.Column>
                        {/* Class Card */}
                        <Grid.Column style={{width: "auto"}}>
                            <Segment stacked textAlign="left" verticalAlign='middle'>
                                    <List>
                                    {Object.keys(this.state.response3).map(index => (
                                        <List.Item>
                                        <List.Header>Time Stamp: {index} </List.Header> 
                                        <p>Confidence: {this.state.response3[index]}</p> 
                                        </List.Item>
                                    )
                                        )}
                                    </List>
                            </Segment>
                        </Grid.Column>
                        
                    </Form>
                               
                </Grid.Column>
            </Grid>


        ) //End return(...)
            //return(<ClassCard className={this.state.classList.name} classDesc={this.state.description} />);// -- ideally this works first shot but honestly prolly not lol
        
    }//End redner{}(...)





    async handleClassNameChange(event){
        const value = event.target.value;
        await this.setState({className: value});
    }
    async handleClassDescChange(event){
        const value = event.target.value;
        await this.setState({classDesc: value});
    }



    async handleGetConfidence() {
        console.log("Getting confidence");
        await fetch("http://localhost:9000/confidence?quizId=1", {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(res => res.json()).then((data) => { 
            console.log("data",data);
            this.setState({response3: data.record, response2: data.confidence})
            // window.location.replace('/dashboard');
        }).catch(console.log("ok"))
    } /* End handleAddClass(...) */
   
   
    async handleGetAvgConfidence() {
        console.log("Getting avg confidence");
        await fetch("http://localhost:9000/avgconfidence?quizId=1", {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(res => res.json()).then((data) => { 
            console.log("data",data);
            this.setState({response4: data.Average})
            // window.location.replace('/dashboard');
        }).catch(console.log("ok"))
    } /* End handleAddClass(...) */

    async handleGetAllConfidence() {
        console.log("Getting all confidence");
        await fetch("http://localhost:9000/allconfidence?quizId=1", {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(res => res.json()).then((data) => { 
            console.log("data",data);
            // window.location.replace('/dashboard');
        }).catch(console.log("ok"))
    } /* End handleAddClass(...) */








    
} export default Confidence