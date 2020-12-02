import React from 'react'
import { Button, Form, Grid, Header, Segment, List,Modal} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import QuizQuestionCard from './QuizQuestionCard';
import { Test, QuestionGroup, Question, Option } from 'react-multiple-choice';

class TakeQuiz extends React.Component {
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
            questionList:[],
            sH: "False", // show answers boolean
            isPublished: 0,
            selectedOptions: {}
        };


       
        this.handleGetQuestions = this.handleGetQuestions.bind(this);
        this.handleSelections = this.handleSelections.bind(this);
        this.handleSaveQuestions = this.handleSaveQuestions.bind(this);
        this.handleSubmitQuiz = this.handleSubmitQuiz.bind(this);

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
                this.setState({ quizName: data.quizName , quizStartDate: data.startDate, quizDueDate: data.dueDate, quizShowAnswers: data.showAnswers, isPublished: data.isPublished })
                if(data.showAnswers == 1){
                    this.state.sH = "True";
                }
                console.log(data);
            });

        this.handleGetQuestions();


    }


    render() {
        /* decided what popup message to present */

        return (
            <div>
            
            <Grid padded style={{height: '100vh'}} columns={2} >
                <Grid.Row style={{height: '90%'}} textAlign = 'center' >
                    <Grid.Column style={{width: 1400}}>  
                        {/* Question list component */}
                        <Header>{this.state.quizName}</Header>
                        <Segment>
                            
                        <Test onOptionSelect={selectedOptions => this.setState({ selectedOptions })}>

                        {this.state.questionList.map((entry) =>{
                                        return(
                                            <QuestionGroup questionNumber={entry.quizQuestionId}>
                                            <Question>({entry.pointValue} pts) Question: {entry.quizQuestion} </Question>
                                            <Option value="A">{JSON.parse(entry.answerChoices)[0].A}</Option>
                                            <Option value="B">{JSON.parse(entry.answerChoices)[1].B}</Option>
                                            <Option value="C">{JSON.parse(entry.answerChoices)[2].C}</Option>
                                            <Option value="D">{JSON.parse(entry.answerChoices)[3].D}</Option>
                                        </QuestionGroup>     
                                        );
                                    })}

                        </Test>
                        </Segment>

                    </Grid.Column>
                    <Grid.Column style={{width: 200}}>
                        <Segment>
                                <Button onClick={this.handleSaveQuestions} color='purple' fluid size='large'>
                                    Save Quiz Responses
                                </Button>
                        </Segment>
                         
                        <Segment>
                        <Button onClick={this.handleSubmitQuiz} color='green' fluid size='large'>
                                    Submit Quiz Responses
                                </Button>
                        </Segment>
                        <Button onClick={this.handleSelections} color='green' fluid size='large'>
                                    Print Selections
                                </Button>
                    </Grid.Column>
                
                </Grid.Row>
            </Grid>
        </div>

        ) //End return(...)
        
    }//end render

    //new question




    async handleGetQuestions(){
        //TODO
        await fetch('http://localhost:9000/quiz/getAllQuizQuestions' ,{
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                quizId: this.state.quizId,
            })
            }).then(response => response.json())
            .then(data => {
               this.setState({questionList: data});
            }); 

    }


    async handleSelections(){
        console.log(this.state.selectedOptions);
    }

    async handleSaveQuestions(){ //will need to update to store selectedOptions in db
            // let selections = this.state.selectedOptions; // in JSON format ("questionId": "A")
            // let quizId = this.state.quizId;
            // let questionList = this.state.questionList;
            // let userId = this.state.userId;
            
            
            await fetch('http://localhost:9000/quiz/saveQuizScores' ,{
                method: 'POST',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    selections : JSON.stringify(this.state.selectedOptions),
                    questionList : JSON.stringify(this.state.questionList),
                    userId : this.state.userId,
                    quizId : this.state.quizId
                })
                }).then(response => response.json())
                .then(data => {
                }); 

    }
    async handleSubmitQuiz(){
            //TODO
            //Grade Quiz
            let selections = this.state.selectedOptions; // in JSON format ("questionId": "A")
            let questionList = this.state.questionList;
            let quizId = this.state.quizId;
            let userId = this.state.userId;

    }


    
} export default TakeQuiz