import React from "react";
import {Grid, Card, Header, Modal, Button, Form, Popup, Dimmer, Segment, Input} from "semantic-ui-react";
import {Link} from "react-router-dom";
import { Test, QuestionGroup, Question, Option } from 'react-multiple-choice';
import QuizQuestionCard from "./QuizQuestionCard";

export default class GradesCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            studentId: '',
            quizId: '',
            classId: '',
            quizName: '',
            grade: '',
            type: '',
            updatedGrade: '',
            questionList: []
        }
        this.handleUpdateGrade = this.handleUpdateGrade.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleGetQuestions = this.handleGetQuestions.bind(this);
    }

    async componentDidMount(){
        //console.log(this.props.post);
        this.setState({
            studentId: this.props.studentId,
            quizId: this.props.quizId,
            classId: this.props.classId,
            quizName: this.props.quizName,
            grade: this.props.grade,
            type: this.props.type
        });
        //console.log("QUIZZZZ IDD : "+this.props.quizId);
        this.handleGetQuestions();
    }

    render() {
        if (this.props.type == 1){ // if student, hide student list button
            return (
                <Card background-color={'grey'} style={{width: "400px"}} centered >
                    <Card.Content >
                        <Header as="h4" textAlign="left" dividing>
                            <div quizName="left aligned">
                                <Header.Content>
                                    <div>
                                    {this.state.quizName}
                                    </div>
                                    <div>
                                    Grade: {this.state.grade}%    
                                    </div>
                                    <div>                        
                                    <Modal                                                
                                        trigger={<Button color='blue' >See Quiz</Button>}
                                        header={'Quiz: ' + this.state.quizName}
                                        //TODO Content needs to have question, student answer, correct answer
                                        content={
                                            <Grid padded style={{height: '100vh'}} columns={2} >
                                                <Grid.Row style={{height: '90%'}} textAlign = 'center' >
                                                    <Grid.Column style={{width: 1400}}>  
                                                        {/* Question list component */}
                                                        {/* <Header>{this.state.quizName}</Header> */}
                                                        {/* <Segment> */}
                                                            
                                                        <Test onOptionSelect={selectedOptions => this.setState({ selectedOptions })}>

                                                        {this.state.questionList.map((entry) =>{
                                                                        
                                                                        return( <QuizQuestionCard maxWidth='50vw' type={0} quizQuestion={entry.quizQuestion} quizQuestionId={entry.quizQuestionId} quizQuestionAnswer={entry.quizQuestionAnswer} quizAnswerChoices={entry.answerChoices} quizPointValue={entry.pointValue}/> 
                                                                            
                                                                        //     <QuestionGroup questionNumber={entry.quizQuestionId}>
                                                                        //     <Question>({entry.pointValue} pts) Question: {entry.quizQuestion} </Question>
                                                                        //     <Option value="A">{JSON.parse(entry.answerChoices)[0].A}</Option>
                                                                        //     <Option value="B">{JSON.parse(entry.answerChoices)[1].B}</Option>
                                                                        //     <Option value="C">{JSON.parse(entry.answerChoices)[2].C}</Option>
                                                                        //     <Option value="D">{JSON.parse(entry.answerChoices)[3].D}</Option>
                                                                        // </QuestionGroup>     
                                                                        )
                                                                    })}
                                                            
                                                        </Test>
                                                        {/* </Segment> */}

                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        }//"NEED TO HAVE QUIZ QUESTIONS: question, student answer, correct answer"
                                        actions={['Close']}
                                    />
                                    </div>
                                </Header.Content>
                                
                            </div>
                        </Header>
                    </Card.Content>
                </Card>
            )
        } else { // if teacher
            return (
                <Card background-color={'grey'} style={{width: "400px"}} centered >
                    <Card.Content >
                        <Header as="h4" textAlign="left" dividing>
                            <div quizName="left aligned">
                                <Header.Content>
                                    <div>
                                    {this.state.quizName}
                                    </div>
                                    <div>
                                    Grade: {this.state.grade}%    
                                    </div>
                                    <div>                        
                                    <Modal                                                
                                        trigger={<Button color='blue' >See Student's Quiz</Button>}
                                        header={'Quiz: ' + this.state.quizName}
                                        //TODO Content needs to have question, student answer, correct answer
                                        content="NEED TO HAVE QUIZ QUESTIONS: question, student answer, correct answer"
                                        actions={['Close']}
                                    />
                                    <Modal                                                
                                        trigger={<Button color='red' >Edit Grade</Button>}
                                        header={'Quiz: ' + this.state.quizName}
                                        //TODO Content needs to have question, student answer, correct answer
                                        content={
                                            <Input action={{
                                                content: 'Submit Change',
                                                onClick: this.handleUpdateGrade
                                                }} 
                                                placeholder={this.state.grade}
                                                onChange = {this.handleInputChange}
                                            />
                                        }
                                        actions={['Close']}
                                    />
                                    </div>
                                </Header.Content>
                                
                            </div>
                        </Header>
                    </Card.Content>
                </Card>
            )
        }
    }

    async handleInputChange(event){
        const value = event.target.value;
        await this.setState({updatedGrade: value});
    }

    async handleUpdateGrade() {
            //console.log("Instructor adding class");
            await fetch("http://localhost:9000/quiz/updateGrade", {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    quizId: this.state.quizId,
                    studentId: this.state.studentId,
                    grade: this.state.updatedGrade,
                })
            }).then(res => res.json()).then((data) => { 
                this.setState({response: data});
                window.location.replace(window.location.href);
            }).catch(console.log)
    };

    async handleGetQuestions(){
        //TODO
        console.log("quizID: "+this.props.quizId);
        await fetch('http://localhost:9000/quiz/getAllQuizQuestions' ,{
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                quizId: this.props.quizId,
            })
            }).then(response => response.json())
            .then(data => {
                console.log("QUESTIONS");
                console.log(data);
               this.setState({questionList: data});
            }); 

    }

};