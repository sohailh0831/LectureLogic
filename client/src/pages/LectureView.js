import React from 'react'
import { Button, Form, Grid, Header, Segment, Popup, Label, Modal,FormField } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import ClassCard from './ClassCard';
import { Image, Embed, List, Accordion } from 'semantic-ui-react'
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import ReactPlayer from "react-player";

class LectureView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            userId: '',
            response: '',
            classList: [],
            newClassDesc: '',
            sliderData: 5,
            lectureVideoLink: 'Test',
            lectureId: '',
            fulllectureVideoLink: '',
            currentTimestamp: '',
            changeFlag: false,
            formattedTimestamp: '',
            testQuestions: ['Sample Question1', 'Sample Question2', 'John', 'George', 'Ringo'],
            newQuestion: '',
            loadedQuestions: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.sendSliderData = this.sendSliderData.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleNewQuestion = this.handleNewQuestion.bind(this);
        this.player = React.createRef();
        
        // this.getClassList = this.getClassList.bind(this);

    }

    async handleChange(e) {
        await this.setState({ sliderData: e.target.value, changeFlag: true }); 
        console.log(this.state.sliderData); 
    }


     convertSeconds = function(sec) {
        var hrs = Math.floor(sec / 3600);
        var min = Math.floor((sec - (hrs * 3600)) / 60);
        var seconds = sec - (hrs * 3600) - (min * 60);
        seconds = Math.round(seconds * 100) / 100
       
        var result = (hrs < 10 ? "0" + hrs : hrs);
        result += ":" + (min < 10 ? "0" + min : min);
        result += ":" + (seconds < 10 ? "0" + seconds : seconds);
        return result;
     }

     handleGetCurrentTime = () => {
        var roundedCurrentTime = Math.floor(this.player.current.getCurrentTime()); //rounds to remove decimal from seconds
        this.setState({formattedTimestamp: this.convertSeconds(roundedCurrentTime)}); // formats in hr:min:sec format
        this.setState({currentTimestamp: roundedCurrentTime})
      }






    async sendSliderData(e) {
        const interval = setInterval( async () => {
            if ( this.state.changeFlag ) {
                console.log("SENDING SLIDER DATA");
                this.setState({changeFlag: false});
                await fetch("http://localhost:9000/confidence", {
            method: 'PUT',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                quizId: 1,
                question: 1,
                val: this.state.sliderData
            })
        }).then(res => res.json()).then((data) => {
            console.log(data) 
            if(data === "OK"){ //successfully logged in
                localStorage.setItem("authenticated", "authenticated");
                console.log("successfully changed email")
                window.location.replace('/');            }
            else{
           //window.location.replace('/login'); // need to flash that authentication failed
           console.log("email change fail")
            }
            this.setState({response: data})
        }).catch(console.log)
            }
            
        }, 30000);
        //console.log("clearing interval");
        //return () => clearInterval(interval);
    }

    async componentDidMount() { // this is function called before render() ... use it to fetch any info u need
        // Simple GET request using fetch

        if(localStorage.getItem("authenticated") !== "authenticated"){
            window.location.replace('/login'); //redirects to login if not already logged in
        }

        /* gets the ID in the path name of URL e.g /LectureView/ID*/
        let urlElements = window.location.pathname.split('/')
        this.setState({lectureId: urlElements[2]})


        await fetch('http://localhost:9000/getLectureVideoLink' ,{
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                lectureId: urlElements[2]
            })
        }).then(response => response.json())
            .then(data => {
                let fullVidLink = data.lectureVideoLink;
                let embedLink =data.lectureVideoLink.split("watch?v=")[1];
                this.setState({ lectureVideoLink: embedLink });
                this.setState({ fullLectureVideoLink: fullVidLink });
                console.log("lec " + this.state.lectureVideoLink)
                //console.log(data);
            }); // here's how u set variables u want to use later


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
                this.setState({ username: data.username , name: data.name, response: data, userId: data.id  })
                console.log(data);
                tmpId = data.id;
            }); // here's how u set variables u want to use later






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
                this.setState({ username: data.username , name: data.name, response: data, userId: data.id  })
                console.log(data);
                tmpId = data.id;
            }); // here's how u set variables u want to use later



            setInterval(() => {
                console.log('Interval triggered');
                this.getQuestions()
              }, 1000);
             
    
    }


    render() {
        /* decided what popup message to present */
        let popUpMessage;
        if (this.state.response.type === '1') { //if user is a student
            popUpMessage = 'Join a Class';
        }
        else { //else user is instructor
            popUpMessage = 'Create New Class';
        }

        
        this.sendSliderData();
        return (
            <div>
            <Grid padded style={{height: '100vh'}} columns={3} >
                    <Grid.Row style={{height: '70%'}} textAlign = 'left' >
                        <Grid.Column>  
                                {/* Question list component */}
                                <Header as='h2' color='grey' textAlign='center'>
                                        Question Board
                                    </Header>
                                <Segment stacked textAlign="left" verticalAlign='middle' style={{overflow: 'auto', maxHeight: 700 }}>
                                 <List>
                                {this.state.loadedQuestions.map(entry => (
                                            <List.Item>
                                            <List.Header>Question: {entry.question} </List.Header>
                                            <List.Header>Answer:  {entry.answer}</List.Header>
                                            <List.Header>Asked by: {entry.studentName}  ({entry.formattedTimestamp})  </List.Header>
                                            </List.Item>
                                        ))}
                                    </List> 

                                    </Segment>

                                    <Segment>
                                    <Header as='h2' color='grey' textAlign='center'>
                                        Ask a question:
                                    </Header>
                                    <Form size='large'>
                                        <Segment stacked>
                                            <Form.Input
                                                placeholder='Question'
                                                required={true}
                                                value={this.state.newQuestion}
                                                onChange={this.handleQuestionChange}
                                            />


                                            <Button onClick={this.handleNewQuestion} color='purple' fluid size='large'>
                                                Ask Question
                                            </Button>
                                            
                                            
                                        </Segment>
                                    </Form>
                                            </Segment>
                                        </Grid.Column>
                                        <Grid.Column >


                                                <Segment stacked textAlign="center" verticalAlign='middle'>
                                                    <Header as = 'h2' color = 'grey' textAlign = 'center'>
                                                        Dashboard Temp Header
                                                    </Header>

                                                    {/* Video component */}
                                                    {/* <Embed id={this.state.lectureVideoLink} placeholder='/images/image-16by9.png' source='youtube' /> */}
                                                    <ReactPlayer 
                                                    width='382px' height='214px' 
                                                    ref = {this.player} url={this.state.fullLectureVideoLink}
                                                    controls={true}
                                                    />                                    
                                                    {/* <Button color='purple' fluid size='large' active={this.state.enabled} onClick={this.handleGetCurrentTime}>
                                                    Get Current Time Stamp
                                                    </Button>
                                                    <Label fluid size='large'>
                                                    Time Stamp: {this.state.currentTimestamp}
                                                    </Label>
                                                    <Label fluid size='large'>
                                                    Formatted Time Stamp: {this.state.formattedTimestamp}
                                                    </Label> */}
                                                    
                                                    
                                        
                                                
                                                    </Segment>
                                {/* Class Card
                                <Grid.Column style={{width: "auto"}}>
                                    {this.state.classList.map((classList, index) => {
                                            return(<ClassCard className={this.state.classList[index].name} classDesc={this.state.classList[index].description} />)
                                        }
                                    )}
                                </Grid.Column> */}
                            {/* </Form> */}
                        </Grid.Column>
                  
                        <Grid.Column>
                            {/* Slider (level of engagement) component */} 
                            <Segment stacked textAlign="center" verticalAlign='middle'>
                                <Form.Input
                                    label={`Confidence Level:  `}
                                    min={1}
                                    max={10}
                                    name='Confidence Level'
                                    onChange={this.handleChange}
                                    step={1}
                                    type='range'
                                    value={this.state.sliderValue}
                                />
                            </Segment>
                        </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>

        ) //End return(...)
            //return(<ClassCard className={this.state.classList.name} classDesc={this.state.description} />);// -- ideally this works first shot but honestly prolly not lol
        
    } //End render{}(...)

    // async handleAddClass() { //absolutely doesnt work dont try it and dont fuck with it
    //     console.log("Adding a Class");
    //     await fetch("http://localhost:9000/class/addClass", {
    //         method: 'POST',
    //         credentials: "include",
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Access-Control-Allow-Credentials': true,
    //         },
    //         body: JSON.stringify({
    //             name: this.state.name,
    //             description: this.state.addClassDesc,
    //             instrucor_id: this.state.userId,
    //         })
    //     }).then(res => res.json()).then((data) => { 
    //         console.log(data);
    //         this.setState({response: data})
    //     }).catch(console.log)
    // } /* End handleAddClass(...) */

    // async getClassList() { //dont fuck with this... doesnt work
    //     console.log("Getting Student ClassList");
    //     if (this.state.type === '1') { //----------IF STUDENT----------
    //         await fetch('http://localhost:9000/class/studentClasses?user_id=' + this.state.userId ,{
    //             method: 'GET',
    //             credentials: "include",
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Access-Control-Allow-Credentials': true,
    //             },
    //             body: JSON.stringify({
    //                 id: this.state.userId
    //             })
    //         }).then(response => response.json())
    //         .then(data => {
    //             console.log(data);
    //             this.setState({classList: data, listReceived: true})
    //         }).catch(console.log);
    //         //parse classlist
    //     }
    //     else{ //----------IF INSTRUCTOR----------
    //         console.log("Getting Instructor Classlist")
    //         await fetch('http://localhost:9000/class/instructorClasses?user_id=' + this.state.userId ,{
    //             method: 'GET',
    //             credentials: "include",
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Access-Control-Allow-Credentials': true,
    //             }
    //         }).then(response => response.json())
    //         .then(data => {
    //             //console.log(data);
    //             this.setState({classList: data})
    //         }).catch(console.log);
    //         //parse classlist
    //     }
    // } /* End getClassList(...) */

    async handleQuestionChange(event) {
        const value = event.target.value;
        await this.setState({newQuestion: value});
        //console.log(event.target.value);
    }
    //new question


async handleNewQuestion() {
    await this.handleGetCurrentTime()
    await fetch("http://localhost:9000/postQuestionStudent", {
        method: 'POST',
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            question: this.state.newQuestion,
            lectureId: this.state.lectureId,
            timestamp: this.state.currentTimestamp,
            formattedTimestamp: this.state.formattedTimestamp
            
        })
    }).then(res => res.json()).then((data) => { 
        this.setState({newQuestion: ''})
    }).catch(console.log)
    // this.getQuestions()
}


async getQuestions(){
    await this.handleGetCurrentTime()
    await fetch("http://localhost:9000/getQuestionsStudent", {
        method: 'POST',
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            lectureId: this.state.lectureId, 
        })
    }).then(res => res.json()).then((data) => { 
        //need to remove based on timestamp
        //need to mark unanswered questions
        for (var i = data.length - 1; i >= 0; i--) {
            if(data[i].answer === '')
                    data[i].answer = '(Not Yet Answered)'
            if (this.state.currentTimestamp < data[i].timestamp) { 
                data.splice(i, 1);
            }
        }
        this.setState({loadedQuestions: data})
    }).catch(console.log)
}
    
} export default LectureView