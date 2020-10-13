import React from "react";
import {Card, CardContent, Header, Modal, Button} from "semantic-ui-react";
import {Link} from "react-router-dom";

import ClassDetailsCard from './ClassDetailsCard';


export default class LectureCard extends React.Component{

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
            lectureName: this.props.lectureName,
            lectureDesc: this.props.lectureDesc,
            temp: this.props.type
        });
    }

    render() {
        let temp = true;
        if (this.props.type == 1){ // if student, hide student list button            
            return(
                <div>
                     <Link to = {'./LectureView'} > {/*<Link to ={{ pathname: './ClassPage/'+this.state.className, state: {classId: this.state.classId, classDesc: this.state.classDesc} }} ></Link> */}
                        <Card style={{width: "500px"}} centered >
                            <Card.Content>
                                <Header as="h4" textAlign="left" dividing>
                                    <div lectureName="left aligned">
                                        <Header.Content>
                                            {this.props.lectureName}
                                            <div lectureName="meta">
                                                <p style={{fontSize: "75%"}} data-testid={"Lecture Description"}>({this.props.lectureDesc})</p>
                                                <p style={{fontSize: "75%"}} data-testid={"Lecture Section"}>Section: {this.props.lectureSection}</p>
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
                                    <div lectureName="left aligned">
                                        <Header.Content>
                                            <Link to = {'./LectureView'} > {/* <Link to ={{ pathname: './ClassPage/'+this.state.className, state: {classId: this.state.classId, classDesc: this.state.classDesc} }} >*/}
                                                {this.props.lectureName}
                                            </Link>
                                            <div lectureName="meta">
                                                <p style={{fontSize: "75%"}} data-testid={"Lecture Description"}>({this.props.lectureDesc})</p>
                                                <p style={{fontSize: "75%"}} data-testid={"Lecture Section"}>Section: {this.props.lectureSection}</p>
                                                {/* <p style={{fontSize: "75%"}} data-testid={"Class Id"}>({this.props.classId})</p> */}
                                            </div>
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