import React from "react";
import {Card, Header, Modal, Button, Form, Popup, Dimmer, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import GradesCard from './GradesCard.js';
import ClassDetailsCard from './ClassDetailsCard';

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
            gradesList: [],
            avgGrade: '',
            studentList: []
        };
        this.handleGetGrades = this.handleGetGrades.bind(this);
        this.handleGetAverageGrade = this.handleGetAverageGrade.bind(this);
        this.handleGetStudentList = this.handleGetStudentList.bind(this);
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
        this.handleGetAverageGrade();
        this.handleGetStudentList();
    }

    render() {
        if (this.props.type == 1){ //student
            //this.handleGetAverageGrade();
            console.log("Avg grade: "+this.state.avgGrade);
            return (
                <Card background-color={'grey'} style={{width: "500px"}} centered >
                    <Card.Content >
                        <Header as="h4" textAlign="left" dividing>
                            <div quizName="left aligned">
                                <Header.Content>
                                    <div>
                                    {this.props.className}
                                    </div>
                                    <div>
                                        Average Grade: {this.state.avgGrade}
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
            console.log("Teacher");
            
            return (
                <Card background-color={'grey'} style={{width: "500px"}} centered >
                    <Card.Content >
                        <Header as="h4" textAlign="left" dividing>
                            <div quizName="left aligned">
                                <Header.Content>
                                    <div>
                                    {this.props.className}
                                    </div>
                                    {/* <div>
                                        Average Grade: {this.state.avgGrade}
                                    </div> */}
                                    <Modal         
                                        trigger={<Button color='blue' onClick={this.handleGetStudentList}>Quizzes</Button>}
                                        header={'Student List for ' + this.props.className}
                                        content={this.state.gradesList.map((gradesList, index) => {
                                            if(this.state.gradesList[index].classId == this.props.classId) {
                                                return(<GradesCard maxWidth='50vw' type={this.state.type} studentId={this.props.studentId} quizId={this.state.gradesList[index].quizId} classId={this.state.gradesList[index].classId} quizName={this.state.gradesList[index].quizName} grade={this.state.gradesList[index].score} />)
                                            }
                                        })}
                                        //content="hey"
                                        actions={['Close']}
                                    />
                                </Header.Content>
                            </div>
                            <Segment stacked textAlign="left" verticalAlign='middle' style={{overflow: 'auto'}}>
                                {this.state.studentList.map((index) => {
                                    return(<ClassDetailsCard studentId={this.state.results[index].studentId} studentName={this.state.results[index]} className={this.props.className} type={this.state.type} gradesList={this.state.gradesList} studentEmail={index} gradeFlag={1} classId={this.props.classId}/>)
                                })}                                
                            </Segment>
                        </Header>
                    </Card.Content>
                </Card>
            )
        }
    }

    async handleGetGrades() {
        //console.log("studentId: "+this.state.studentId);
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

    async handleGetAverageGrade() {
        await fetch(`http://localhost:9000/quiz/getStudentAverageClassGrade?classId=${this.props.classId}&studentId=${this.props.studentId}`, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(res => res.json()).then((data) => { 
            console.log("data",data);
            if (data[0]) this.setState({avgGrade: data[0].avgGrade+'%', hasGrades: true });
            else this.setState({avgGrade: 'N/A' });
            console.log(data);
            console.log("avg grade after thing: "+this.state.avgGrade);
            // window.location.replace('/dashboard');
        }).catch(console.log("ok"))
    }

    async handleGetStudentList(){
        //console.log("HERE");
        await fetch('http://localhost:9000/requests?classId=' + this.props.classId ,{
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(response => response.json())
            .then(data => {
                this.setState({studentList: Object.keys(data.results), results: data.results})
                console.log("HUH");
                console.log(data);
                console.log(Object.keys(data.results)[0]);
            }); // here's how u set variables u want to use later
    }
};