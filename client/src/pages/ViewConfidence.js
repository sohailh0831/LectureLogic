import React from 'react'
import {Form, Grid, Segment, List, Progress, Header } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import ZingChart from 'zingchart-react'
import {zingchart, ZC} from 'zingchart/es6';
import 'zingchart/modules-es6/zingchart-pareto.min.js';

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
            avgConfidence: '',
            classList: [],
            newClassDesc: '',
            type: '',
            school: '',
            listReceived: false,
            studentConfList: [],
        };
        this.handleGetConfidence = this.handleGetConfidence.bind(this);
        this.handleGetAllConfidence = this.handleGetAllConfidence.bind(this);
        this.handleGetAvgConfidence = this.handleGetAvgConfidence.bind(this);
        this.getClassList = this.getClassList.bind(this);
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
        console.log('before setting vars');
        //this.handleGetConfidence();
        this.handleGetAvgConfidence();
        console.log(this.state.avgConfidence);
        this.handleGetAllConfidence();
        console.log('after setting vars');

    }



    render() {
        /* decided what popup message to present */
        //let popUpMessage;

        //popUpMessage = 'Create New Class';

       
        // console.log(this.state.classList);
        console.log('SCHOOL '+this.state.response);
        console.log('PAUL ADDED');
        console.log(this.state.studentConfList);
            //console.log("DASH TYPE: "+this.state.response.type);

            let listX = [];
            let listY = [];
            for (let i = 0; i < this.state.studentConfList.length; i++) {
                console.log("In LOOP: " + this.state.studentConfList[i]);
                listX.push(this.state.studentConfList[i].name);
                listY.push(parseInt(JSON.parse(this.state.studentConfList[i].confidence), 10));
            }
            console.log("listxandy:", listX, listY);
            let myConfig = {
                type: 'bar',
                title: {
                  text: 'Confidence Levels for Quiz 1 Lecture 1',
                  fontSize: 24,
                },
                scaleX: {
                  // Set scale label
                  label: { text: 'Student Names' },
                  // Convert text on scale indices
                  labels: listX //change to student names
                },
                scaleY: {
                  // Scale label with unicode character
                  label: { text: 'Confidence Levels' }
                },
                series: [
                  {
                    // plot 1 values, linear data
                    values: listY,
                  }
                //   {
                //     // plot 2 values, linear data
                //     values: [35,42,33,49,35,47,35],
                //     text: 'Week 2'
                //   },
                //   {
                //     // plot 2 values, linear data
                //     values: [15,22,13,33,44,27,31],
                //     text: 'Week 3'
                //   }
                ]
              };
              console.log(this.state.results3);
              console.log(this.state.results4);
              console.log(this.state.studentConfList);
              console.log(myConfig);

            return (
                <Grid textAlign='center' style={{height: '100vh'}, {_width: '100vw'}} verticalAlign='middle' columns={2}>
                    <ZingChart data={myConfig}/>

                    <Grid.Column style={{width: "auto"}}>
                        <Segment stacked textAlign="left" verticalAlign='left'>
                            <p>Class Average Confidence: {this.state.response4}</p> 
                        </Segment>
                    </Grid.Column>

                    <Grid.Column style={{width: "auto"}}>
                        <Segment stacked textAlign="left" verticalAlign='middle'>
                                    {Object.keys(this.state.response3).map(index => (
                                        <List.Item>
                                        <List.Header>Time Stamp: {index} </List.Header> 
                                        <p>Confidence: {this.state.response3[index]}</p>
                                        </List.Item>
                                    ))}
                        </Segment>
                    </Grid.Column>
                </Grid>
    
    


        ) //End return(...)
            //return(<ClassCard className={this.state.classList.name} classDesc={this.state.description} />);// -- ideally this works first shot but honestly prolly not lol
        
    }//End redner{}(...)




    async handleGetConfidence() {
        console.log("Getting confidence");
        await fetch("http://localhost:9000/confidence?quizId=1?id=6e820d18-a523-4ea1-b987-c6b59b9f94de", {
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
        }).catch(console.log("not working here"))
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
            this.setState({avgConfidence: data.Average})
            // window.location.replace('/dashboard');
        }).catch(console.log("ok"))
    } /* End handleAddClass(...) */

    async handleGetAllConfidence() {
        console.log('Getting all confidence');
        await fetch("http://localhost:9000/allconfidence?quizId=1", {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(res => res.json()).then((data) => { 
            this.setState({studentConfList: data});
            // window.location.replace('/dashboard');
        }).catch(console.log("ok"))
    } /* End handleAddClass(...) */

    async getClassList() { //dont fuck with this... doesnt work
        if (!this.state.listReceived) {
            if (this.state.type === '1') { //----------IF STUDENT----------
                await fetch('http://localhost:9000/class/studentClasses?user_id=' + this.state.userId ,{
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Credentials': true,
                      }
                      // ,
                    // body: JSON.stringify({
                    //     id: this.state.userId
                    // })
                }).then(response => response.json())
                .then(data => {
                    this.setState({classList: data, listReceived: true})
                }).catch(console.log);
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
                    this.setState({classList: data, listReceived: true})
                }).catch(console.log);
            }
        }
    } /* End getClassList(...) */






    
} export default Confidence