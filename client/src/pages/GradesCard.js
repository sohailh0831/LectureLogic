import React from "react";
import {Card, Header, Modal, Button, Form, Popup, Dimmer, Segment} from "semantic-ui-react";
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
            type: ''
        }

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
        console.log("type: "+this.props.type);
        if (this.props.type == 1){ // if student, hide student list button
            return (
                <Card background-color={'grey'} style={{width: "500px"}} centered >
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
                <Card>
                    {this.state.quizName}
                </Card>
            )
        }
    }
};