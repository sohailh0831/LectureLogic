import React from 'react'
import { Button, Form, Grid, Header, Segment, Popup, Modal } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
//import ClassCard from './ClassCard';
import LectureCard from './LectureCard';

class ClassPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            userId: '',
            response: '',
            lectureList: [],
            newClassDesc: '',
            type: '',
            school: '',
            listReceived: false,
            studentList: [],
            lectureName: '',
            classId: '',
            tempLectureName: '',
            tempLectureDesc: '',
            tempLectureSection: '',
            tmepLectureVideo: '',
            lectureDesc: '',
            lectureSection: '',
            lectureVideoLink: ''
        };
        this.handleAddLecture = this.handleAddLecture.bind(this);
        // this.getClassList = this.getClassList.bind(this);
        this.getLectureList = this.getLectureList.bind(this);
        this.handleLectureNameChange = this.handleLectureNameChange.bind(this);
        this.handleLectureDescriptionChange = this.handleLectureDescriptionChange.bind(this);
        this.handleLectureSectionChange = this.handleLectureSectionChange.bind(this);
        this.handleLectureVideoLinkChange = this.handleLectureVideoLinkChange.bind(this);
        

    }

    async componentDidMount() { // this is function called before render() ... use it to fetch any info u need
        // Simple GET request using fetch
        //console.log(localStorage.getItem("authenticated"))
        if(localStorage.getItem("authenticated") !== "authenticated"){
            window.location.replace('/login'); //redirects to login if not already logged in
        }
        let tmpId;
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
    

        const {className} = this.props.match.params;
        this.setState({className: className});
        console.log("class name in classpage with match: "+this.state.className);

        const {classId} = this.props.location.state;
        this.setState({classId: classId});
        console.log("classID in class page: "+classId);
        const {classDesc} = this.props.location.state;
        this.setState({classDesc: classDesc});
        console.log("class desc in class page: "+ classDesc);

        this.getLectureList();
        console.log(this.state.lectureList);

        
    }

    compo


    render() {
        /* decided what popup message to present */
        let popUpMessage;
        if (this.state.response.type === '0') { //if user is a student
            popUpMessage = 'Create New Lecture';
        }

        console.log(this.state.lectureList);
        console.log("CLASS ID: "+this.state.classId);
        if (this.state.response.type === '0') {
            
            return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Form size='large'>

                        <Segment stacked textAlign="center" verticalAlign='middle'>
                                <Header as = 'h2' color = 'grey' textAlign = 'center'>
                                    {this.state.className}
                                </Header>
                                <Header as = 'h3' color = 'grey' textAlign = 'center'>
                                    {this.state.classDesc}
                                </Header>   
                            <Modal
                                trigger={<Button icon='add' color='purple' ></Button>}
                                header='Add New Lecture'
                                content={
                                    <Form>
                                        <Form.Input
                                            placeholder='Lecture Name'
                                            required={true}
                                            value={this.state.tempLectureName}
                                            onChange={this.handleLectureNameChange}
                                        />
                                        <Form.Input
                                            placeholder='Lecture Description'
                                            required={true}
                                            value={this.state.tempLectureDesc}
                                            onChange={this.handleLectureDescriptionChange}
                                        />
                                        <Form.Input
                                            placeholder='Lecture Section'
                                            required={true}
                                            value={this.state.tempLectureSection}
                                            onChange={this.handleLectureSectionChange}
                                        />
                                        <Form.Input
                                            placeholder='Lecture Video Link'
                                            required={true}
                                            value={this.state.tempLectureVideoLink}
                                            onChange={this.handleLectureVideoLinkChange}
                                        />
                                    </Form>
                                }
                                actions={['Close', <Button color='purple' onClick={this.handleAddLecture}> done</Button>]}
                            />
                            

                        </Segment>

                        {/* Class Card */}
                        <Grid.Column style={{width: "auto"}}>
                            {this.state.lectureList.map((lectureList, index) => { 
                                    return(<LectureCard lectureId={this.state.lectureList[index].id} lectureName={this.state.lectureList[index].name} lectureDesc={this.state.lectureList[index].description} lectureSection={this.state.lectureList[index].section} type={this.state.response.type}/>)
                                }
                            )}
                        </Grid.Column>

                    </Form>
                </Grid.Column>
            </Grid>


        ) //End return(...)
            //return(<ClassCard className={this.state.classList.name} classDesc={this.state.description} />);// -- ideally this works first shot but honestly prolly not lol
        
        } 
        else {
            
            return (
                <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                    <Grid.Column style={{maxWidth: 450}}>
                        <Form size='large'>
    
                            <Segment stacked textAlign="center" verticalAlign='middle'>
                                <Header as = 'h2' color = 'grey' textAlign = 'center'>
                                    {this.state.className}
                                </Header>
                                    {this.state.classDesc}
                                {/* <Modal
                                    trigger={<Button icon='add' color='purple' ></Button>}
                                    header='Enter Class ID'
                                    content={
                                        <Form>
                                            <Form.Input
                                                placeholder='Class ID'
                                                required={true}
                                                value={this.state.className}
                                                onChange={this.handleClassNameChange}
                                            />
                                        </Form>
                                    }
                                    actions={['Close', <Button color='purple' onClick={this.handleAddClass}> Done</Button>]}
                                /> */}
                                
    
                            </Segment>
    
                            {/* Class Card */}
                            <Grid.Column style={{width: "auto"}}>
                                {this.state.lectureList.map((lectureList, index) => {
                                        return(<LectureCard lectureId={this.state.lectureList[index].id} lectureName={this.state.lectureList[index].name} lectureDesc={this.state.lectureList[index].description} lectureSection={this.state.lectureList[index].section} lectureVideoLink={this.state.lectureList[index].video_link} type={this.state.response.type}/>)
                                    }
                                )}
                            </Grid.Column>
    
                        </Form>
                    </Grid.Column>
                </Grid>
    
    
            ) //End return(...)
                //return(<ClassCard className={this.state.classList.name} classDesc={this.state.description} />);// -- ideally this works first shot but honestly prolly not lol
            
            
        }
    }//End redner{}(...)





    async handleLectureNameChange(event){
        const value = event.target.value;
        await this.setState({tempLectureName: value});
    }
    async handleLectureDescriptionChange(event){
        const value = event.target.value;
        await this.setState({tempLectureDesc: value});
    }
    async handleLectureSectionChange(event){
        const value = event.target.value;
        await this.setState({tempLectureSection: value});
    }
    async handleLectureVideoLinkChange(event){
        const value = event.target.value;
        await this.setState({tempLectureVideoLink: value});
    }


    async handleAddLecture() {
        console.log("name: "+this.state.tempLectureName);
        console.log("description: "+this.state.tempLectureDesc);
        console.log("class id:  "+this.state.classId);
        console.log("section: "+this.state.tempLectureSection);
        console.log("vid link: "+this.state.tempLectureVideoLink);
        console.log("adding lecture");
        await fetch("http://localhost:9000/lecture/addLecture", {
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                name: this.state.tempLectureName,
                description: this.state.tempLectureDesc,
                class_id: this.state.classId,
                section: this.state.tempLectureSection,
                video_link: this.state.tempLectureVideoLink
            })
        }).then(res => res.json()).then((data) => { 
            console.log(data);
            this.setState({response: data})
            window.location.replace('/ClassPage/'+this.state.className);
        }).catch(console.log)
        
    } /* End handleAddLecture(...) */








    //TODO getLectureList
    async getLectureList() {
        if (!this.state.listReceived) {
            
                console.log("Getting Instructor LectureList classId: "+this.state.classId);
                await fetch('http://localhost:9000/lecture/lectureList?class_id=' + this.state.classId ,{
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Credentials': true,
                    }
                }).then(response => response.json())
                .then(data => {
                    this.setState({lectureList: data, listReceived: true})
                }).catch(console.log);
            
        }
        console.log("LIST");
        console.log(this.state.lectureList);
    } /* End getLectureList(...) */
    // async getClassList() { //dont fuck with this... doesnt work
    //     if (!this.state.listReceived) {
    //         if (this.state.type === '1') { //----------IF STUDENT----------
    //             await fetch('http://localhost:9000/class/studentClasses?user_id=' + this.state.userId ,{
    //                 method: 'GET',
    //                 credentials: "include",
    //                 headers: {
    //                     'Accept': 'application/json',
    //                     'Content-Type': 'application/json',
    //                     'Access-Control-Allow-Credentials': true,
    //                   }
    //                   // ,
    //                 // body: JSON.stringify({
    //                 //     id: this.state.userId
    //                 // })
    //             }).then(response => response.json())
    //             .then(data => {
    //                 this.setState({classList: data, listReceived: true})
    //             }).catch(console.log);
    //         }
    //         else{ //----------IF INSTRUCTOR----------
    //             console.log("Getting Instructor Classlist")
    //             await fetch('http://localhost:9000/class/instructorClasses?user_id=' + this.state.userId ,{
    //                 method: 'GET',
    //                 credentials: "include",
    //                 headers: {
    //                     'Accept': 'application/json',
    //                     'Content-Type': 'application/json',
    //                     'Access-Control-Allow-Credentials': true,
    //                 }
    //             }).then(response => response.json())
    //             .then(data => {
    //                 this.setState({classList: data, listReceived: true})
    //             }).catch(console.log);
    //         }
    //     }
    // } /* End getClassList(...) */


    
} export default ClassPage