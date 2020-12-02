import React from "react";
import {Card, Header, Modal, Button} from "semantic-ui-react";
import {Link} from "react-router-dom";

import ClassDetailsCard from './ClassDetailsCard';


export default class ClassCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            studentList: [],
            results: {}
        }
        this.handleGetStudentList = this.handleGetStudentList.bind(this);
    }

    async componentDidMount(){
        //console.log(this.props.post);
        this.setState({
            className: this.props.className,
            classId: this.props.classId,
            classDesc: this.props.classDesc,
            temp: this.props.type
        });
    }

    render() {
        // console.log("CLAS NAME IN CLASS CARD: "+this.state.className);
        // console.log("CLAS ID IN CLASS CARD "+this.state.classId);
        // console.log("CLAS DESCRIPTION IN CLASS CARD "+this.state.classDesc);
        if (this.props.type === 1){ // if student, hide student list button            
            return(
                <div>
                    <Link to ={{ pathname: './ClassPage/'+this.state.className, state: {classId: this.state.classId, classDesc: this.state.classDesc} }} > {/*params={{className: this.state.className}} >*/}
                        <Card style={{width: "500px"}} centered >
                            <Card.Content>
                                <Header as="h4" textAlign="left" dividing>
                                    <div className="left aligned">
                                        <Header.Content>
                                            {this.props.className}
                                            <div className="meta">
                                                <p style={{fontSize: "75%"}} data-testid={"Class Description"}>{this.props.classDesc}</p>
                                                {/* <p style={{fontSize: "75%"}} data-testid={"Class Id"}>({this.props.classId})</p> */}
                                            </div>
                                        </Header.Content>

                                    </div>
                                </Header>
                            </Card.Content>
                        </Card>
                    </Link>
                </div>

            )//End return(...)
        } else {    // if instructor, show student list button
            return(
                <div>
                    
                       <Card style={{width: "500px"}} centered >
                            <Card.Content>
                                <Header as="h4" textAlign="left" dividing>
                                    <div className="left aligned">
                                        <Header.Content>
                                        <Link to ={{ pathname: './ClassPage/'+this.state.className, state: {classId: this.state.classId, classDesc: this.state.classDesc} }} > {/*params={{className: this.state.className}} >*/}
                                            {this.props.className}
                                            </Link>
                                            <div className="meta">
                                                <p style={{fontSize: "75%"}} data-testid={"Class Description"}>{this.props.classDesc}</p>
                                                {/* <p style={{fontSize: "75%"}} data-testid={"Class Id"}>({this.props.classId})</p> */}
                                            </div>
                                            <Modal
                                                
                                                trigger={<Button color='blue' onClick={this.handleGetStudentList}>Students</Button>}
                                                header={'Student List for ' + this.props.className}
                                                content={this.state.studentList.map((index) => {
                                                            return(<ClassDetailsCard studentName={this.state.results[index]} studentEmail={index} gradeFlag={0}/>)
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

            )//End return(...)
        }
    } //End render(){...}

    async handleGetStudentList(){
        console.log("HERE");
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
                console.log(Object.keys(data.results)[0]);
            }); // here's how u set variables u want to use later
    }
};