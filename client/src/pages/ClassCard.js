import React from "react";
import {Card, CardContent, Header, Modal, Button} from "semantic-ui-react";
import {Link} from "react-router-dom";

import ClassDetailsCard from './ClassDetailsCard';


export default class ClassCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            studentList: []
        }
        this.handleGetStudentList = this.handleGetStudentList.bind(this);
    }

    async componentDidMount(){
        //console.log(this.props.post);
        this.setState({
            className: this.props.className,
            classDesc: this.props.classDesc
        });
    }

    render() {

        return(
            <div>
                
                <Card style={{width: "500px"}} centered >
                    <Card.Content>
                        <Header as="h4" textAlign="left" dividing>
                            <div className="left aligned">
                                <Header.Content>
                                    {this.props.className}
                                    <div className="meta">
                                        <p style={{fontSize: "75%"}} data-testid={"Class Description"}>({this.props.classDesc})</p>
                                        {/* <p style={{fontSize: "75%"}} data-testid={"Class Id"}>({this.props.classId})</p> */}
                                    </div>
                                    <Modal
                                        trigger={<Button color='blue' onClick={this.handleGetStudentList}>Students</Button>}
                                        header={'Student List for ' + this.props.className}
                                        content={this.state.studentList.map((index) => {
                                                    return(<ClassDetailsCard classId={this.state.classList[index].id} className={this.state.classList[index].name} classDesc={this.state.classList[index].description} />)
                                                })}
                                        actions={['Close']}
                                    />
                                </Header.Content>

                            </div>
                        </Header>
                    </Card.Content>
                </Card>
            </div>

        )//End return(...)
    } //End render(){...}

    async handleGetStudentList(){
        console.log("HERE");
        await fetch('http://localhost:9000/requestClass?classId=' + this.props.classId ,{
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(response => response.json())
            .then(data => {
                console.log(data.student_list);
            }); // here's how u set variables u want to use later
    }
};