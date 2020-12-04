import React from 'react'
import { Button, Form, Grid, Header, Segment, List,Modal} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import QuizQuestionCard from './QuizQuestionCard';
import { Test, QuestionGroup, Question, Option } from 'react-multiple-choice';

class StudentType extends React.Component {
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
            openNewSubmitButtonModal: false,
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
            selectedOptions: {},
            savedOptions: [],
            minGrade: '',
            studentList: [[],[],[]]
        };


       
        this.handleGetStudentType = this.handleGetStudentType.bind(this);

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



        // await fetch('http://localhost:9000/quiz/getQuizDetails' ,{
        //     method: 'POST',
        //     credentials: "include",
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'Access-Control-Allow-Credentials': true,
        //     },
        //     body: JSON.stringify({
        //         quizId : this.state.quizId,
        //     })
        // }).then(response => response.json())
        //     .then(data => {
        //         this.setState({ quizName: data.quizName , quizStartDate: data.startDate, quizDueDate: data.dueDate, quizShowAnswers: data.showAnswers, isPublished: data.isPublished,  minGrade: data.minGrade})
        //         if(data.showAnswers == 1){
        //             this.state.sH = "True";
        //         }
        //         console.log(data);
        //     });

        this.handleGetStudentType();
            console.log("AYEEEEEEE", this.state.selectedOptions)

    }


    render() {
        /* decided what popup message to present */

        return (
            <div>
            
            <Grid padded style={{height: '100vh'}} columns={3} >
                <Grid.Row style={{height: '90%'}} textAlign = 'center' >
                    <Grid.Column style={{width: 400}}>
                        <Header>Completed</Header>
                        <Segment>
                            {this.state.studentList[0].map((entry) => {
                                return(
                                <view>
                                    Name: {entry.name}
                                    <p>Id: {entry.id}</p>
                                    <p></p>
                                </view>)
                            })}
                        </Segment>
                    </Grid.Column>  
                    <Grid.Column style={{width: 400}}>
                        <Header>Started</Header>
                        <Segment>
                            {this.state.studentList[1].map((entry) => {
                                return(
                                <view>
                                    Name: {entry.name}
                                    <p>Id: {entry.id}</p>
                                    <p></p>
                                </view>)
                            })}
                        </Segment>
                    </Grid.Column>  
                    <Grid.Column style={{width: 400}}>
                        <Header>Not Started</Header>
                        <Segment>
                            {this.state.studentList[2].map((entry) => {
                                return(
                                <view>
                                    Name: {entry.name}
                                    <p>Id: {entry.id}</p>
                                    <p></p>
                                </view>)
                            })}
                        </Segment>
                        
                    </Grid.Column>  
                </Grid.Row>
            </Grid>
        </div>

        ) //End return(...)
        
    }//end render

    //new question




    async handleGetStudentType(){
        //TODO
        await fetch('http://localhost:9000/quiz/getStudentStatus' ,{
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
               this.setState({studentList: data});
            }); 

        
    }


    
} export default StudentType