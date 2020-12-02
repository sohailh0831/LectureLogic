import React from 'react'
import { Button, Form, Grid, Header, Segment, List,Modal} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import QuizCard from './QuizCard';

class EditQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            userId: '',
            classId: '',
            response: '',
            type: '',
            testQuestions: ['Sample Question1', 'Sample Question2', 'John', 'George', 'Ringo'],
            questionInterval: '',
            openNewQuestionModal: false,
            quizId: '',
            quizName: '',
            quizStartDate: '',
            quizDueDate: '',
            quizShowAnswers: '',
            newQuestion: '',
            newQuestionAnswerA: '',
            newQuestionAnswerB: '',
            newQuestionAnswerC: '',
            newQuestionAnswerD: '',
            newQuestionCorrectAnswer: '',
            newQuestionPointValue: '',
            questionList: []
        };


        this.handlQuestionChange = this.handleQuestionChange.bind(this);
        this.handleQuestionAnswerA = this.handleQuestionAnswerA.bind(this);
        this.handleQuestionAnswerB = this.handleQuestionAnswerB.bind(this);
        this.handleQuestionAnswerC = this.handleQuestionAnswerC.bind(this);
        this.handleQuestionAnswerD = this.handleQuestionAnswerD.bind(this);
        this.handleQuestionCorrectAnswer = this.handleQuestionCorrectAnswer.bind(this);
        this.handleQuestionPointValue = this.handleQuestionPointValue.bind(this);
        this.handleCloseNewQuestionModal = this.handleCloseNewQuestionModal.bind(this);
        this.handleOpenNewQuestionModal = this.handleOpenNewQuestionModal.bind(this);
        this.handleSubmitNewQuestion = this.handleSubmitNewQuestion.bind(this);

    }






    async componentDidMount() { // this is function called before render() ... use it to fetch any info u need
        // Simple GET request using fetch

        if(localStorage.getItem("authenticated") !== "authenticated"){
            window.location.replace('/login'); //redirects to login if not already logged in
        }

        /* gets the ID in the path name of URL e.g /LectureView/ID*/
        let urlElements = window.location.pathname.split('/')
        this.setState({classId: urlElements[2]})
        this.setState({quizId: urlElements[3]})



        
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
                this.setState({ username: data.username , name: data.name, response: data, userId: data.id, type: data.type })
                console.log(data);
            }); // here's how u set variables u want to use later



        await fetch('http://localhost:9000/quiz/getQuizDetails' ,{
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                quizId : this.state.quizId,
            })
        }).then(response => response.json())
            .then(data => {
                this.setState({ quizName: data.quizName , quizStartDate: data.startDate, quizDueDate: data.dueDate, quizShowAnswers: data.showAnswers })
                console.log(data);
            });


    }


    render() {
        /* decided what popup message to present */

        if(this.state.type === '1'){ // if not instructor redirect them to dashboard
            window.location.replace("/");
        }

    
        return (
            <div>
            
            <Grid padded style={{height: '100vh'}} columns={2} >
                <Grid.Row style={{height: '70%'}} textAlign = 'left' >
                    <Grid.Column style={{width: 1000}}>  
                        {/* Question list component */}
                        <Segment>
                        <Header>
                            Quiz Questions
                        </Header>
                        <List>
                                {this.state.testQuestions.map((entry) =>{
                                        return(<QuizCard quizName={entry} quizStartDate={entry.startDate} quizDueDate={entry.dueDate} studentFlag={1} isAnswered={entry.isAnswered} answer={entry.answer} studentName={entry.studentName} time={entry.formattedTimestamp} questionId={entry.questionId} link={window.location.href} type={this.state.response.type}></QuizCard>) ;    
                                    })}
                        </List> 




                    </Segment>
                    </Grid.Column>

                                    
                                    
                    <Grid.Column style={{width: 400}}> 
                    <Segment>
                        <Header as='h2' color='grey' textAlign='center'>
                                Quiz Details
                        </Header>
                        <Segment>
                        <Header> Quiz Name: {this.state.quizName}</Header>
                        <Header> Quiz Start Date: {this.state.quizStartDate}</Header>
                        <Header> Quiz Due Date: {this.state.quizDueDate}</Header>
                        <Header> Show Answers for Quizzes?: {this.state.quizShowAnswers}</Header>
                        
                        </Segment>

                        {/* <List>
                                {this.state.testQuestions.map((entry) =>{
                                        return(<QuizCard quizName={entry} quizStartDate={entry.startDate} quizDueDate={entry.dueDate} studentFlag={1} isAnswered={entry.isAnswered} answer={entry.answer} studentName={entry.studentName} time={entry.formattedTimestamp} questionId={entry.questionId} link={window.location.href} type={this.state.response.type}></QuizCard>) ;    
                                    })}
                        </List>  */}
                    </Segment> 
                    <Segment>
                <Button onClick={this.handleOpenNewQuestionModal} color='green' fluid size='large'>
                        Add a new question
                </Button>
                <Modal
                                    onClose={() => this.setState({openNewQuestionModal: false})}
                                    onOpen={() => this.setState({openNewQuestionModal: true})}
                                    open={this.state.openNewQuestionModal}
                                >
                                <Modal.Header>New Question</Modal.Header>
                                <Modal.Content>
                                    <Modal.Description>
                                    Question
                                    <Form.Input
                                            placeholder='Enter Question Here'
                                            value={this.state.newQuestion}
                                            onChange={this.handlQuestionChange}
                                        />
                                    Answer Choice "A": 
                                     <Form.Input
                                            placeholder=''
                                            value={this.state.newQuestionAnswerA}
                                            onChange={this.handleQuestionAnswerA}
                                    />
                                    Answer Choice "B": 
                                     <Form.Input
                                            placeholder=''
                                            value={this.state.newQuestionAnswerB}
                                            onChange={this.handleQuestionAnswerB}
                                    />
                                    Answer Choice "C": 
                                     <Form.Input
                                            placeholder=''
                                            value={this.state.newQuestionAnswerC}
                                            onChange={this.handleQuestionAnswerC}
                                    />
                                    Answer Choice "D": 
                                     <Form.Input
                                            placeholder=''
                                            value={this.state.newQuestionAnswerD}
                                            onChange={this.handleQuestionAnswerD}
                                    />
                                    Correct Answer: 
                                     <Form.Input
                                            placeholder='Enter A,B,C,D'
                                            value={this.state.newQuestionCorrectAnswer}
                                            onChange={this.handleQuestionCorrectAnswer}
                                    />
                                    Question Point Value:
                                    <Form.Input
                                            placeholder='Enter point value here'
                                            value={this.state.newQuestionPointValue}
                                            onChange={this.handleQuestionPointValue}
                                    />



                                    </Modal.Description>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button
                                        content="Close"
                                        labelPosition='left'
                                        icon='x'
                                        onClick={this.handleCloseNewQuestionModal}
                                        negative
                                    />
                                    <Button
                                        content="Submit"
                                        labelPosition='right'
                                        icon='checkmark'
                                        onClick={this.handleSubmitNewQuestion}
                                        positive
                                    />
                                </Modal.Actions>
                            </Modal>
                
            </Segment>
                    </Grid.Column>
                
                </Grid.Row>
            </Grid>
        </div>

        ) //End return(...)
            //return(<ClassCard className={this.state.classList.name} classDesc={this.state.description} />);// -- ideally this works first shot but honestly prolly not lol
        
    } //End render{}(...)

    //new question




    handleOpenNewQuestionModal() {
        this.setState({openNewQuestionModal: true});
    }

    async handleCloseNewQuestionModal() {
        this.setState({openNewQuestionModal: false});
    }

    handleQuestionChange(event){
        this.setState({newQuestion: event.target.value});
    }
    handleQuestionAnswerA(event){
        this.setState({newQuestionAnswerA: event.target.value})
    }
    handleQuestionAnswerB(event){
        this.setState({newQuestionAnswerB: event.target.value})
    }
    handleQuestionAnswerC(event){
        this.setState({newQuestionAnswerC: event.target.value})
    }
    handleQuestionAnswerD(event){
        this.setState({newQuestionAnswerD: event.target.value})
    }

    handleQuestionCorrectAnswer(event){
        this.setState({newQuestionCorrectAnswer: event.target.value});
    }
    handleQuestionPointValue(event){
        this.setState({newQuestionPointValue: event.target.value});
    }

    async handleSubmitNewQuestion(){ 
        /*
            need to update for QUESTIONS!!!!!!
        */
        console.log(this.state.newQuizName,this.state.newQuizStartDate,this.state.newQuizDueDate,this.state.newQuizShowAnswers);
        this.setState({openNewQuizModal: false});
        var link = "http://localhost:9000/quiz/newQuizCreation";
        var sA = 0;
        if("True".localeCompare(this.state.showAnswers)){
            sA = 1;
        }
        console.log(sA)
        var body = JSON.stringify({
            quizName: this.state.newQuizName,
            classId: this.state.classId,
            instructorId: this.state.userId,
            quizStartDate: this.state.quizStartDate,
            quizDueDate: this.state.quizDueDate,
            showAnswers: sA
            
        })
        
        await fetch(link, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: body
        }).then(res => res.json()).then((data) => { 
            console.log(data);
            this.setState({newQuizName: '', newQuizStartDate: '', newQuizDueDate: '', newQuizShowAnswers: ''})
        }).catch(console.log)

        this.handleGetQuizzes();



    }

    // handleQuestionNameChange(event) {
    //     this.setState({newQuizName: event.target.value});
    // }
    // handleQuizStartDateChange(event) {
    //     this.setState({newQuizStartDate: event.target.value});
    // }
    // handleQuizDueDateChange(event) {
    //     this.setState({newQuizDueDate: event.target.value});
    // }
    // handleQuizShowAnswersChange(event){
    //     this.setState({newQuizShowAnswers: event.target.value})
    // }

    
} export default EditQuiz