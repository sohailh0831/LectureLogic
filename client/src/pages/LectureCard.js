import React from "react";
import {Card, CardContent, Header, Modal, Button, Form} from "semantic-ui-react";
import {Link} from "react-router-dom";
import { Dropdown } from 'semantic-ui-react';

import ClassDetailsCard from './ClassDetailsCard';


export default class LectureCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            className: '',
            studentList: [],
            results: {},
            tempLectureName: '',
            tempLectureDesc: '',
            tempLectureSection: '',
            tmepLectureVideo: ''
        }
        this.handleGetStudentList = this.handleGetStudentList.bind(this);
        this.handleEditLecture = this.handleEditLecture.bind(this);
        this.handleRemoveLecture = this.handleRemoveLecture.bind(this);
        this.handleLectureNameChange = this.handleLectureNameChange.bind(this);
        this.handleLectureDescriptionChange = this.handleLectureDescriptionChange.bind(this);
        this.handleLectureSectionChange = this.handleLectureSectionChange.bind(this);
        this.handleLectureVideoLinkChange = this.handleLectureVideoLinkChange.bind(this);
    }

    async componentDidMount(){
        //console.log(this.props.post);
        this.setState({
            className: this.props.className,
            lectureId: this.props.lectureId,
            lectureName: this.props.lectureName,
            lectureDesc: this.props.lectureDesc,
            lectureVideoLink: this.props.lectureVideoLink,
            temp: this.props.type
        });
    }

    render() {
        let temp = true;
        if (this.props.type == 1){ // if student, hide student list button            
            return(
                <div>
                     {/* <Link to = {'/LectureView'} >  */}
                     {/* <Link to ={{ pathname: './ClassPage/'+this.state.className, state: {classId: this.state.classId, classDesc: this.state.classDesc} }} ></Link> */}
                     <Link to ={{ pathname: '/LectureView/'+this.props.lectureId, state: {lectureId: this.props.lectureId, lectureDesc: this.props.lectureDesc, lectureSection: this.props.lectureSection, lectureVideoLink: this.props.lectureVideoLink} }} >
                        <Card style={{width: "500px"}} centered >
                            <Card.Content>
                                <Header as="h4" textAlign="left" dividing>
                                    <div lecturename="left aligned">
                                        <Header.Content>
                                            {this.props.lectureName}
                                            <div lecturename="meta">
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
                                            <Link to ={{ pathname: '/LectureView/'+this.props.lectureId, state: {lectureId: this.props.lectureId, lectureDesc: this.props.lectureDesc, lectureSection: this.props.lectureSection, lectureVideoLink: this.props.lectureVideoLink} }} >
                                                {this.props.lectureName}
                                            </Link>
                                            <div lectureName="meta">
                                                <p style={{fontSize: "75%"}} data-testid={"Lecture Description"}>({this.props.lectureDesc})</p>
                                                <p style={{fontSize: "75%"}} data-testid={"Lecture Section"}>Section: {this.props.lectureSection}</p>
                                                {/* <p style={{fontSize: "75%"}} data-testid={"Class Id"}>({this.props.classId})</p> */}
                                            </div>
                                        </Header.Content>
                                    </div> 
                                    
                                    {/* <Dropdown icon="list ul">
                                        <Dropdown.Menu>
                                            <Dropdown.Item>  */}
                                            {/* // onClick={() => {this.handleEditLecture(this.props.lectureId)}}>Edit */}
                                            
                                                <Modal
                                                    trigger={<Button content='Edit' ></Button>}
                                                    header='Edit Lecture'
                                                    content={
                                                        <Form>
                                                            <Form.Input
                                                                placeholder={this.props.lectureName}
                                                                required={false}
                                                                value={this.state.tempLectureName}
                                                                onChange={this.handleLectureNameChange}
                                                            />
                                                            <Form.Input
                                                                placeholder={this.props.lectureDesc}
                                                                required={false}
                                                                value={this.state.tempLectureDesc}
                                                                onChange={this.handleLectureDescriptionChange}
                                                            />
                                                            <Form.Input
                                                                placeholder={this.props.lectureSection}
                                                                required={false}
                                                                value={this.state.tempLectureSection}
                                                                onChange={this.handleLectureSectionChange}
                                                            />
                                                            <Form.Input
                                                                placeholder={this.props.lectureVideoLink}
                                                                required={false}
                                                                value={this.state.tempLectureVideoLink}
                                                                onChange={this.handleLectureVideoLinkChange}
                                                            />
                                                        </Form>
                                                    }
                                                    actions={['Close', <Button color='purple' onClick={this.handleEditLecture}>Done</Button>]}
                                                />
                                          
                                            {/* </Dropdown.Item> */}

                                            <Button basic color='red' onClick={() => {this.handleRemoveLecture(this.props.lectureId)}}>
                                                Delete
                                            </Button>
                                            {/* {<Button content='Delete' ></Button>} */}
                                        {/* </Dropdown.Menu> */}
                                    {/* </Dropdown> */}
                                    
                                </Header> 
                                                              
                            </Card.Content>
                        </Card>
           
                </div>

            )//End return(...)
        }
    } //End render(){...}

    async handleLectureNameChange(event){
        //const value = event.target.value;
        await this.setState({tempLectureName: event.target.value});
    }
    async handleLectureDescriptionChange(event){
        await this.setState({tempLectureDesc: event.target.value});
    }
    async handleLectureSectionChange(event){
        await this.setState({tempLectureSection: event.target.value});
    }
    async handleLectureVideoLinkChange(event){
        await this.setState({tempLectureVideoLink: event.target.value});
    }


    async handleEditLecture(lectureId) {
        console.log("lecture_id: "+lectureId);
        console.log("editing lecture");
        console.log("CLASSNAME:  "+this.props.className);
        console.log("lecName: "+this.state.tempLectureName);
        console.log("lecDesc: "+this.state.tempLectureDesc);
        console.log("lecSection: "+this.state.tempLectureSection);
        console.log("lecVidLink: "+this.state.tempLectureVideoLink);

        if ( this.state.tempLectureName === '' || this.state.tempLectureName === undefined) {
            //console.log("NEW NAME UNDEFd");
            this.state.tempLectureName = this.props.lectureName;
        }
        if ( this.state.tempLectureDesc === '' || this.state.tempLectureDesc === undefined) {
            //console.log("NEW NAME UNDEFd");
            this.state.tempLectureDesc = this.props.lectureDesc;
        }
        if ( this.state.tempLectureSection === '' || this.state.tempLectureSection === undefined ) {
            //console.log("NEW NAME UNDEFd");
            this.state.tempLectureSection = this.props.lectureSection;
        }
        if ( this.state.tempLectureVideoLink === '' || this.state.tempLectureVideoLink === undefined) {
            //console.log("NEW NAME UNDEFd");
            this.state.tempLectureVideoLink = this.props.lectureVideoLink;
        }
        console.log("LECTUREID: "+this.props.lectureId);
        console.log("edited lecName: "+this.state.tempLectureName);
        console.log("edited lecDesc: "+this.state.tempLectureDesc);
        console.log("edited lecSection: "+this.state.tempLectureSection);
        console.log("edited lecVidLink: "+this.state.tempLectureVideoLink);

        await fetch("http://localhost:9000/lecture/editLecture", {
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                lecture_id: this.props.lectureId,
                name: this.state.tempLectureName,
                description: this.state.tempLectureDesc,
                video_link: this.state.tempLectureVideoLink,
                section: this.state.tempLectureSection
            })
        }).then(res => res.json()).then((data) => { 
            console.log(data);
            this.setState({response: data});
            window.location.replace('/ClassPage/'+this.props.className);
        }).catch(console.log)



    }
    async handleRemoveLecture(lectureId) {
        console.log("levture_id: "+lectureId);
        console.log("removing lecture");
        await fetch("http://localhost:9000/lecture/removeLecture", {
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                lecture_id: lectureId
            })
        }).then(res => res.json()).then((data) => { 
            console.log(data);
            this.setState({response: data});
            window.location.replace('/ClassPage/'+this.props.className);
        }).catch(console.log)
        
    } /* End handleAddLecture(...) */

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