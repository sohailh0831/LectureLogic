import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal, Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import GradesCard from './GradesCard';
import ClassGradeCard from './ClassGradeCard';

class GradesView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            userId: '',
            response: '',
            type: '',
            school: '',
            classList: [],//[ {text: 'hi', value: 'hi'}, {value: 'hi2'}, {text: 'class3', value: 'class3'}],
            classId: '',
            quizId: '',
            quizName: '',
            quizGrade: '',
            hasGrades: '',
            gradesList: []
        };
        this.handleGetGrades = this.handleGetGrades.bind(this);
        this.handleClassSelect = this.handleClassSelect.bind(this);
        this.getClassList = this.getClassList.bind(this);
    }

    async componentDidMount() {
        if(localStorage.getItem("authenticated") !== "authenticated"){
            window.location.replace('/login'); //redirects to login if not already logged in
        }
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
                this.setState({ username: data.username , name: data.name, response: data, userId: data.id, type: data.type, school: data.school });
                console.log(data.class_id);
            }); // here's how u set variables u want to use later

        console.log("Student ID: "+this.state.userId);
        //this.handleGetGrades();
        this.getClassList();
    }

    render() {
        if(this.state.response.type === '0'){ //is instructor
            return (
                <Grid textAlign='center' style={{height: '100vh'}, {width: '100vw'}} divided='vertically' columns={2}>
                    <Grid.Row verticalAlign='top'>
                        Hi
                    </Grid.Row>
                </Grid>
            ) //end return
        } else {    //is student
            const {value} = this.state;
            return (
                <Grid>
                    <Grid.Row verticalAlign='top'>
                        <Grid.Column style={{maxWidth: '50vw'}, {maxHeight: '100vh'}} verticalAlign='left'>
                            <Segment stacked maxWidth='50vw' textAlign="center" verticalAlign='middle' >
                                    <Header as = 'h2' color = 'grey' textAlign = 'center'>
                                        Grades
                                    </Header>
            
                                    {/* Class Grades Card */}
                                    <Segment stacked textAlign="left" verticalAlign='middle' style={{overflow: 'auto'}}>
                                    {this.state.classList.map((classList, index) => { 
                                        return(<ClassGradeCard maxWidth='50vw' type={this.state.response.type} studentId={this.state.userId} className={this.state.classList[index].name} classId={this.state.classList[index].id}/>) //quizId={this.state.gradesList[index].quizId} classId={this.state.gradesList[index].classId} quizName={this.state.gradesList[index].quizName} grade={this.state.gradesList[index].score} />)
                                    })}
                                    </Segment>
                            </Segment>
                        </Grid.Column>

                    </Grid.Row>
                </Grid>
            ) //end return
        }
    }

    async handleGetGrades() {
        await fetch(`http://localhost:9000/quiz/getStudentQuizResults?studentId=${this.state.userId}`, {
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

    //DOES NOT WORK
    async handleClassSelect(event, value) {
        console.log("Clicked class: ");
        console.log(value.value);
        
        //TODO returning classname but need class id to compare to gradesList
        this.state.gradesList.map((gradesList, index) => { 
            //return(<GradesCard maxWidth='50vw' type={this.state.response.type} studentId={this.state.userId} quizId={this.state.gradesList[index].quizId} classId={this.state.gradesList[index].classId} quizName={this.state.gradesList[index].quizName} grade={this.state.gradesList[index].score} />)
            console.log(this.state.gradesList[index].classId);
            if ( value.value == this.state.gradesList[index].classId) {
                console.log("FOUNDDD");
            }
        })
        

    }

    async getClassList() { //dont fuck with this... doesnt work
        if (!this.state.listReceived) {
            if (this.state.type === '1') { //----------IF STUDENT----------
                await fetch('http://localhost:9000/class/studentClasses?user_id=' + this.state.userId ,{
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Credentials': true,
                      }
                      // ,
                    // body: JSON.stringify({
                    //     id: this.state.userId
                    // })
                }).then(response => response.json())
                .then(data => {
                    this.setState({classList: data, listReceived: true})
                }).catch(console.log);
            }
            else{ //----------IF INSTRUCTOR----------
                console.log("Getting Instructor Classlist")
                await fetch('http://localhost:9000/class/instructorClasses?user_id=' + this.state.userId ,{
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Credentials': true,
                    }
                }).then(response => response.json())
                .then(data => {
                    this.setState({classList: data, listReceived: true})
                }).catch(console.log);
            }
        }
    } /* End getClassList(...) */

} export default GradesView