import React from "react";
import {Card, Header, Modal, Button} from "semantic-ui-react";
import GradesCard from './GradesCard.js';


export default class ClassDetailsCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            // className: '',
            // classDesc: ''
            gradesList: [],
            studentId: ''
        }
        this.handleGetGrades = this.handleGetGrades.bind(this);
        this.handleGetStudentId = this.handleGetStudentId.bind(this);
    }

    async componentDidMount(){
        //console.log(this.props.post);
        // this.setState({
        //     className: this.props.className,
        //     classDesc: this.props.classDesc
        // });
        
    }

    render() {
        console.log(this.props.studentEmail);
        console.log(this.props.studentName);

        if(this.props.gradeFlag === 0 ) {
            return(
                <div>
                    
                    <Card style={{width: "500px"}} centered >
                        <Card.Content>
                            <Header as="h4" textAlign="left" dividing>
                                <div className="left aligned">
                                    <Header.Content>
                                        {this.props.studentName}
                                        <div studentName="meta">
                                            <p style={{fontSize: "75%"}} data-testid={"Email"}>Email: ({this.props.studentEmail})</p>
                                        </div>
                                    </Header.Content>

                                </div>
                            </Header>
                        </Card.Content>
                    </Card>
                </div>

            )//End return(...)
        } else {
            return(
                <div>
                    
                    <Card style={{width: "500px"}} centered >
                        <Card.Content>
                            <Header as="h4" textAlign="left" dividing>
                                <div className="left aligned">
                                    <Header.Content>
                                        {this.props.studentName}
                                        <div studentName="meta">
                                            <p style={{fontSize: "75%"}} data-testid={"Email"}>Email: ({this.props.studentEmail})</p>
                                        </div>
                                        <Modal         
                                            trigger={<Button color='blue' onClick={this.handleGetStudentId}>{this.props.studentName}'s Grades</Button>}
                                            header={this.props.studentName+'\'s grades for ' + this.props.className}
                                            content={this.state.gradesList.map((gradesList, index) => {
                                                console.log("class id prop: "+this.props.classId);
                                                console.log("classId from list: "+this.state.gradesList[index].classId);
                                                if(this.state.gradesList[index].classId == this.props.classId) {
                                                    return(<GradesCard maxWidth='50vw' type={this.props.type} studentId={this.state.studentId} quizId={this.state.gradesList[index].quizId} classId={this.state.gradesList[index].classId} quizName={this.state.gradesList[index].quizName} grade={this.state.gradesList[index].score} />)
                                                }
                                            })}
                                            //content="hey"
                                            actions={['Close']}
                                        />
                                    </Header.Content>

                                </div>
                            </Header>
                        </Card.Content>
                    </Card>
                </div>
            )
        }
    } //End render(){...}


    async handleGetGrades() {
        //console.log("Getting grades: "+this.state.studentId);
        await fetch(`http://localhost:9000/quiz/getStudentQuizResults?studentId=${this.state.studentId}`, {
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

    async handleGetStudentId() {
        //console.log("Getting username: "+this.props.studentName);
        await fetch(`http://localhost:9000/getStudentId?username=${this.props.studentName}`, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(res => res.json()).then((data) => { 
           // console.log("data",data);
            if (data[0]) this.setState({studentId: data[0].id});
            else this.setState({studentId: false });
            
            // window.location.replace('/dashboard');
            this.handleGetGrades();
        }).catch(console.log("ok"))
    } /* End handleGetNotifications(...) */
};