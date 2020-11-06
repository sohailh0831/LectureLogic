import React from 'react'
import { Button, Form, Grid, Header, Segment, Popup, Label, Modal,FormField } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import ClassCard from './ClassCard';
import { Image, Embed, List, Accordion } from 'semantic-ui-react'
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import ReactPlayer from "react-player";
import QuestionCard from './QuestionCard';

class DiscussionBoard extends React.Component {
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
            fullTime: '',
            testQuestions: ['Sample Question1', 'Sample Question2', 'John', 'George', 'Ringo'],
            newQuestion: '',
            loadedQuestions: [],
            questionInterval: '',
            lectureName: '',
            lectureSections: '',
            lectureDescription: '',
            isLocked: false

        };
        this.handleChange = this.handleChange.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleNewQuestion = this.handleNewQuestion.bind(this);
        this.handleLectureView = this.handleLectureView.bind(this);
        this.handleLockDiscussion = this.handleLockDiscussion.bind(this)
        this.getLock = this.getLock.bind(this)

        this.player = React.createRef();

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
        if(this.player.current != null){
            var roundedCurrentTime = Math.floor(this.player.current.getCurrentTime()); //rounds to remove decimal from seconds
            this.setState({formattedTimestamp: this.convertSeconds(roundedCurrentTime)}); // formats in hr:min:sec format
            this.setState({currentTimestamp: roundedCurrentTime})
        }
      }


      componentDidUpdate(){
        window.onpopstate = e => {
            console.log("backbutton pressed");
            clearInterval(this.state.questionInterval)
        }

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



         this.setState({questionInterval: setInterval(() => {
            this.getQuestions()
          }, 1000) })

        
             
    }


    render() {
        /* decided what popup message to present */
        var discussionBoardLocked;
        if(this.state.isLocked){
            discussionBoardLocked = 
            <Segment>
                <Header>
                    Instructor has locked the discussion board
                </Header>
            </Segment>
        }
        else{
            discussionBoardLocked =
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
        }

        var lockDiscussionBoardQuestion;
        if(this.state.response.type === '0'){ //is instructor
            lockDiscussionBoardQuestion = 
                <Segment>
                    <Button onClick={this.handleLockDiscussion} color='purple' fluid size='large'>
                            Lock Question Board
                </Button>
                </Segment>
        }
        else{
        }

    
        return (
            <div>
            <Grid padded style={{height: '100vh'}} columns={2} >
                    <Grid.Row style={{height: '70%'}} textAlign = 'left' >
                        <Grid.Column style={{width: 1000}}>  
                                {/* Question list component */}
                                <Header as='h2' color='grey' textAlign='center'>
                                        Question Board 
                                    </Header>
                                <Segment stacked textAlign="left" verticalAlign='middle' style={{overflow: 'auto', maxHeight: 700 }}>
                                <List>
                                                {this.state.loadedQuestions.map((entry) =>{
                                                                return(<QuestionCard lectureId={this.state.lectureId} commenter={this.state.commenter} question={entry.question} studentFlag={1} isAnswered={entry.isAnswered} answer={entry.answer} studentName={entry.studentName} time={entry.formattedTimestamp} questionId={entry.questionId} link={window.location.href} type={this.state.response.type}></QuestionCard>);    
                                                                
                                                        })}
                                    </List> 

                                    </Segment>


                                        </Grid.Column>
                                        <Grid.Column style={{width: 400}}>
                                        {lockDiscussionBoardQuestion}
                                        <Segment>
                                            <Header>Class: sampleClass</Header>
                                            <Header>Instructor: sampleInt</Header>
                                            <Header>Lecture: sampleLecture</Header>
                                            <Header>Sections Covered: sampleSections</Header>
                                        </Segment>
                                        <Segment>
                                    <Header as='h2' color='grey' textAlign='center'>
                                        Ask a question:
                                    </Header>
                                    {discussionBoardLocked}
                                            </Segment> 
                                            <Segment>
                                            <Button onClick={this.handleLectureView} color='purple' fluid size='large'>
                                                Go to Lecture Discussion Board
                                            </Button>
                        </Segment>
                                        
                                      
                                        </Grid.Column>
                
                </Grid.Row>
            </Grid>
        </div>

        ) //End return(...)
            //return(<ClassCard className={this.state.classList.name} classDesc={this.state.description} />);// -- ideally this works first shot but honestly prolly not lol
        
    } //End render{}(...)

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
            timestamp: 0,
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
            // if (this.state.currentTimestamp < data[i].timestamp) { 
            //     data.splice(i, 1);
            // }
        }
        this.setState({loadedQuestions: data})
    }).catch(console.log)
}

async getLock(){
    await fetch('http://localhost:9000/getLectureMetadata' ,{
    method: 'POST',
    credentials: "include",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
        lectureId: this.state.lectureId
    })
    }).then(response => response.json())
    .then(data => {
        let l;
        if(data[0] != null){
         l = data[0].discussionLock;
        }
        else{
            l = 0;
        }
        console.log(data)
         
        if(l == 1){ // locked
                this.setState({isLocked: true})
        }
        else{ //unlocked
                this.setState({isLocked: false})
        }
        
    }); 
}

async handleLockDiscussion(){
await fetch('http://localhost:9000/lockDiscussion/' ,{
method: 'POST',
credentials: "include",
headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': true,
},
body: JSON.stringify({
    lectureId: this.state.lectureId,
    isLocked: this.state.isLocked
})
}).then(response => response.json())
.then(data => {
    
}); 
}

async handleLectureView() {
    var link = "/LectureView/" + this.state.lectureId
    window.location.replace(link);
}
    
} export default DiscussionBoard