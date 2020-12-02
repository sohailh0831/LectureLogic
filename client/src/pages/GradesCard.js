import React from "react";
import {Card, Header, Modal, Button, Form, Popup, Dimmer, Segment, Input} from "semantic-ui-react";
import {Link} from "react-router-dom";

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
            updatedGrade: ''
        }
        this.handleUpdateGrade = this.handleUpdateGrade.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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
                                        content="NEED TO HAVE QUIZ QUESTIONS: question, student answer, correct answer"
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

};