import React from 'react'
import { Button, Form, Grid, Header, Segment, List } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import QuestionCard from './QuestionCard';

class ClassDiscussionBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            userId: '',
            response: '',
            loadedQuestions: [],
            classId: '',
            isLocked: false

        };
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleNewQuestion = this.handleNewQuestion.bind(this);
        this.handleLectureView = this.handleLectureView.bind(this);
        this.handleLockDiscussion = this.handleLockDiscussion.bind(this)
        this.getLock = this.getLock.bind(this)

        this.player = React.createRef();

    }


    async componentDidMount() { // this is function called before render() ... use it to fetch any info u need
        // Simple GET request using fetch

        if(localStorage.getItem("authenticated") !== "authenticated"){
            window.location.replace('/login'); //redirects to login if not already logged in
        }

        /* gets the ID in the path name of URL e.g /LectureView/ID*/
       let urlElements = window.location.pathname.split('/')
       this.setState({classId: urlElements[2]})
        console.log("KSFALSFKJASKJFASLFKJALKSFJALSFASKLF: " + urlElements[2]);


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
            }); // here's how u set variables u want to use later


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

        var lockDiscussionBoardQuestion;    //use the state of isLocked to determine color of the button
        if(this.state.response.type === '0'){ //is instructor
           if (this.state.isLocked) {
                lockDiscussionBoardQuestion = 
                    <Segment>
                        <Button onClick={this.handleLockDiscussion} color='green' fluid size='large'>
                                UnLock Question Board
                        </Button>
                    </Segment>
            }
            else {
                lockDiscussionBoardQuestion = 
                <Segment>
                    <Button onClick={this.handleLockDiscussion} color='red' fluid size='large'>
                            Lock Question Board
                    </Button>
                </Segment>
            }
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
                                    return(<QuestionCard lectureId={this.state.lectureId} commenter={this.state.commenter} question={entry.question} studentFlag={1} isAnswered={entry.isAnswered} answer={entry.answer} studentName={entry.studentName} time={entry.formattedTimestamp} questionId={entry.questionId} link={window.location.href} type={this.state.response.type} classId = {this.state.classId}></QuestionCard>);                                 
                                })}
                            </List> 
                        </Segment>

                    </Grid.Column>
                                    
                                    
                    <Grid.Column style={{width: 400}}> 
                        {/* */}
                        {lockDiscussionBoardQuestion}
                        <Segment>
                            <Header>Class: sampleClass</Header>
                            <Header>Instructor: sampleInt</Header>
                        </Segment>
                        <Segment>
                            <Header as='h2' color='grey' textAlign='center'>
                                Ask a question:
                            </Header>
                            {discussionBoardLocked}
                        </Segment> 
                    </Grid.Column>
                
                </Grid.Row>
            </Grid>
        </div>

        ) //End return(...)
            //return(<ClassCard className={this.state.classList.name} classDesc={this.state.description} />);// -- ideally this works first shot but honestly prolly not lol
        
    } //End render{}(...)

    async handleQuestionChange(event) {
        await this.setState({newQuestion: event.target.value});
    }


async handleNewQuestion() {
    await this.handleGetCurrentTime()
    await fetch("http://localhost:9000/postQuestionStudent", {  //ASK LEUER FOR THE LINK
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
}


async getQuestions(){
    await this.handleGetCurrentTime()
    await fetch("http://localhost:9000/getQuestionsStudent", { //ASK LEUER FOR THE LINK
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
        //set all unanswered questions to a default answer
        for (var i = data.length - 1; i >= 0; i--) {
            if(data[i].answer === '')
                    data[i].answer = '(Not Yet Answered)'
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
         
        if(l === 1){ // locked
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
        if (this.state.isLocked) {
            this.setState({isLocked: false});
        }
        else {
            this.setState({isLocked: true});
        }
        
    }); 
}
    
} export default ClassDiscussionBoard