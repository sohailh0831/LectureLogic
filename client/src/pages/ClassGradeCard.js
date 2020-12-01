import React from "react";
import {Card, Header, Modal, Button, Form, Popup, Dimmer, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import GradesCard from './GradesCard.js';

export default class ClassGradeCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            studentId: '',
            quizId: '',
            classId: '',
            quizName: '',
            grade: '',
            type: '',
            className: '',
            gradesList: []
        };
        this.handleGetGrades = this.handleGetGrades.bind(this);
    }

    async componentDidMount(){
        //console.log(this.props.post);
        this.setState({
            studentId: this.props.studentId,
            quizId: this.props.quizId,
            classId: this.props.classId,
            quizName: this.props.quizName,
            grade: this.props.grade,
            type: this.props.type,
            className: this.props.className
        });
        this.handleGetGrades();
    }

    render() {
        if (this.props.type == 1){ //student
            return (
                <Card background-color={'grey'} style={{width: "500px"}} centered >
                    <Card.Content >
                        <Header as="h4" textAlign="left" dividing>
                            <div quizName="left aligned">
                                <Header.Content>
                                    <div>
                                    {this.props.className}
                                    </div>
                                </Header.Content>
                            </div>
                            <Segment stacked textAlign="left" verticalAlign='middle' style={{overflow: 'auto'}}>
                                {this.state.gradesList.map((gradesList, index) => {
                                    if(this.state.gradesList[index].classId == this.props.classId) {
                                        return(<GradesCard maxWidth='50vw' type={this.state.type} studentId={this.props.studentId} quizId={this.state.gradesList[index].quizId} classId={this.state.gradesList[index].classId} quizName={this.state.gradesList[index].quizName} grade={this.state.gradesList[index].score} />)
                                    }
                                })}
                            </Segment>
                        </Header>
                    </Card.Content>
                </Card>
            )
        } else { //teacher

        }
    }

    async handleGetGrades() {
        console.log("studentId: "+this.state.studentId);
        await fetch(`http://localhost:9000/quiz/getStudentQuizResults?studentId=${this.props.studentId}`, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(res => res.json()).then((data) => { 
            console.log("data",data);
            if (data) this.setState({gradesList: data, hasGrades: true });
            else this.setState({hasGrades: false });
            
            // window.location.replace('/dashboard');
        }).catch(console.log("ok"))
    } /* End handleGetNotifications(...) */
};