import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import LectureCard from './LectureCard';
import QuestionCard from './QuestionCard';

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
            lectureVideoLink: '',
            loadedQuestions: [],
            classQuestionList: [],
            isLocked: false,
            newQuestion: '',
            message: ''
        };
        this.handleAddLecture = this.handleAddLecture.bind(this);
        // this.getClassList = this.getClassList.bind(this);
        this.getLectureList = this.getLectureList.bind(this);
        this.getQuestions = this.getQuestions.bind(this);
        this.handleLectureNameChange = this.handleLectureNameChange.bind(this);
        this.handleLectureDescriptionChange = this.handleLectureDescriptionChange.bind(this);
        this.handleLectureSectionChange = this.handleLectureSectionChange.bind(this);
        this.handleLectureVideoLinkChange = this.handleLectureVideoLinkChange.bind(this);
        this.handleGetNotifications = this.handleGetNotifications.bind(this);
        this.handleNotificationPage = this.handleNotificationPage.bind(this);
        this.handleMessagePage = this.handleMessagePage.bind(this);
        this.handleLockDiscussion = this.handleLockDiscussion.bind(this)
        this.getLock = this.getLock.bind(this)
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleNewQuestion = this.handleNewQuestion.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);

    }

    async componentDidMount() { // this is function called before render() ... use it to fetch any info u need
        // Simple GET request using fetch
        //console.log(localStorage.getItem("authenticated"))
        if(localStorage.getItem("authenticated") !== "authenticated"){
            window.location.replace('/login'); //redirects to login if not already logged in
        }
        //let tmpId;
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
        console.log("classID in class page: "+ classId);
        const {classDesc} = this.props.location.state;
        this.setState({classDesc: classDesc});
        console.log("class desc in class page: "+ classDesc);

        this.getLectureList();
        console.log(this.state.lectureList);
        this.handleGetNotifications();

        this.getQuestions();
        this.getLock()


        
    }



    render() {
        /* decided what popup message to present */
        // let popUpMessage;
        // if (this.state.response.type === '0') { //if user is a student
        //     popUpMessage = 'Create New Lecture';
        // }

        console.log(this.state.lectureList);
        console.log("CLASS ID: "+this.state.classId);
        var discussionBoardLocked;
        if(this.state.isLocked){
            discussionBoardLocked = 
            <Segment>
                <Header>
                    Instructor has locked the discussion board
                </Header>
            </Segment>
        }
        else{
            discussionBoardLocked =
            <Form size='large'>
            <Segment stacked>
                <Form.Input
                    placeholder='Question'
                    required={true}
                    value={this.state.newQuestion}
                    onChange={this.handleQuestionChange}
                />


                <Button onClick={this.handleNewQuestion} color='purple' fluid size='large'>
                    Ask Question
                </Button>
                
                
            </Segment>
        </Form>
        }

        var lockDiscussionBoardQuestion;    //use the state of isLocked to determine color of the button
        if(this.state.response.type === '0'){ //is instructor
           if (this.state.isLocked) {
                lockDiscussionBoardQuestion = 
                    <Segment>
                        <Button onClick={this.handleLockDiscussion} color='green' fluid size='large'>
                                UnLock Question Board
                        </Button>
                    </Segment>
            }
            else {
                lockDiscussionBoardQuestion = 
                <Segment>
                    <Button onClick={this.handleLockDiscussion} color='red' fluid size='large'>
                            Lock Question Board
                    </Button>
                </Segment>
            }
        }
        if (this.state.response.type === '0') {
            
            return (
            <Grid textAlign='center' style={{height: '100vh'}, {width: '100vw'}} divided='vertically' columns={2}>
                <Grid.Row verticalAlign='top'>
                    <Grid.Column style={{maxWidth: '50vw'}, {maxHeight: '100vh'}} verticalAlign='left'>

                            <Segment stacked maxWidth='50vw' textAlign="center" verticalAlign='middle' >
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
                                    actions={['Cancel', <Button color='purple' onClick={this.handleAddLecture}>Done</Button>]}
                                />
                                

                            {/* Class Card */}
                            <Segment stacked textAlign="left" verticalAlign='middle' style={{overflow: 'auto'}}>
                            {this.state.lectureList.map((lectureList, index) => { 
                                return(<LectureCard maxWidth='50vw' className={this.state.className} lectureId={this.state.lectureList[index].id} lectureName={this.state.lectureList[index].name} lectureDesc={this.state.lectureList[index].description} lectureSection={this.state.lectureList[index].section} lectureVideoLink={this.state.lectureList[index].video_link} type={this.state.response.type}/>)
                            })}
                            </Segment>
                        </Segment>
                    </Grid.Column>



                    <Grid.Column style={{maxWidth: '50vw'}} verticalAlign='top' textAlgin='center'>
                        {/* Column for Class Discussion Board */}
                        <Segment>
                            <Header as = 'h2' color = 'grey' textAlign = 'center'>
                                Class Discussion Board
                            </Header>

                            <Segment stacked textAlign="left" style={{overflow: 'auto'}}>
                                {this.state.classQuestionList.map((entry) =>{
                                        return(<QuestionCard lectureId={0} commenter={this.state.username} question={entry.question} studentFlag={1} isAnswered={entry.isAnswered} answer={entry.answer} studentName={entry.studentName} time={entry.formattedTimestamp} questionId={entry.questionId} link={window.location.href} type={this.state.response.type} classId={this.state.classId}></QuestionCard>);                                 
                                    })}
                            </Segment>

                            <Segment>
                                <Header as='h2' color='grey' textAlign='center'>
                                    Ask a question:
                                </Header>
                                {discussionBoardLocked}
                                {lockDiscussionBoardQuestion}
                            </Segment> 


                        </Segment>
                        
                    </Grid.Column>

                    <Grid.Column style={{maxWidth: 450}}>
                    <Button onClick={this.handleNotificationPage} color='purple' fluid size='large'>
                        {this.state.notifications} Notifications
                    </Button>
                    <Button onClick={this.handleMessagePage} color='purple' fluid size='large'>
                        All Messages
                    </Button>
                    <Segment stacked>
                        <Form.Input
                            placeholder='Message'
                            required={true}
                            value={this.state.message}
                            onChange={this.handleMessageChange}
                        />


                        <Button onClick={this.handleSendMessage} color='purple' fluid size='large'>
                            Send Message
                        </Button>
                        
                        
                    </Segment>
                </Grid.Column>
                </Grid.Row>
            </Grid>


        ) //End return(...)
            //return(<ClassCard className={this.state.classList.name} classDesc={this.state.description} />);// -- ideally this works first shot but honestly prolly not lol
        
        } 
        else {
            
            return (
                <Grid padded style={{height: '100vh'}} columns={3}>
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
                                        return(<LectureCard className={this.state.className} lectureId={this.state.lectureList[index].id} lectureName={this.state.lectureList[index].name} lectureDesc={this.state.lectureList[index].description} lectureSection={this.state.lectureList[index].section} lectureVideoLink={this.state.lectureList[index].video_link} type={this.state.response.type}/>)
                                    }
                                )}
                            </Grid.Column>

                        </Form>
                    </Grid.Column>
                    <Grid.Column style={{maxWidth: '50vw'}} verticalAlign='top' textAlgin='center'>
                        {/* Column for Class Discussion Board */}
                        <Segment>
                            <Header as = 'h2' color = 'grey' textAlign = 'center'>
                                Class Discussion Board
                            </Header>

                            <Segment stacked textAlign="left" style={{overflow: 'auto'}}>
                                {this.state.classQuestionList.map((entry) =>{
                                        return(<QuestionCard lectureId={0} commenter={this.state.username} question={entry.question} studentFlag={1} isAnswered={entry.isAnswered} answer={entry.answer} studentName={entry.studentName} time={entry.formattedTimestamp} questionId={entry.questionId} link={window.location.href} type={this.state.response.type} classId = {this.state.classId}></QuestionCard>);                                 
                                    })}
                            </Segment>

                            <Segment>
                                <Header as='h2' color='grey' textAlign='center'>
                                    Ask a question:
                                </Header>
                                {discussionBoardLocked}
                                {lockDiscussionBoardQuestion}
                            </Segment> 


                        </Segment>
                        
                    </Grid.Column>
                    <Grid.Column style={{maxWidth: '25vw'}}>
                    <Button onClick={this.handleNotificationPage} color='purple' fluid size='large'>
                        {this.state.notifications} Notifications
                    </Button>
                    <Button onClick={this.handleMessagePage} color='purple' fluid size='large'>
                        All Messages
                    </Button>
                    <Segment stacked>
                        <Form.Input
                            placeholder='Message'
                            required={true}
                            value={this.state.message}
                            onChange={this.handleMessageChange}
                            style = {{maxWidth: '25vw', maxHeight: '10vw' }}
                        />


                        <Button onClick={this.handleSendMessage} color='purple' fluid size='large'>
                            Send Message
                        </Button>
                        
                        
                    </Segment>
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

    async getLock(){
        await fetch('http://localhost:9000/getLectureMetadata' ,{
        method: 'POST',
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            lectureId: this.state.lectureId
        })
        }).then(response => response.json())
        .then(data => {
            let l;
            if(data[0] != null){
             l = data[0].discussionLock;
            }
            else{
                l = 0;
            }
            //console.log(data)
             
            if(l === 1){ // locked
                    this.setState({isLocked: true})
            }
            else{ //unlocked
                    this.setState({isLocked: false})
            }
            
        }); 
    }
    
    async handleLockDiscussion(){
        await fetch('http://localhost:9000/lockDiscussion/' ,{
        method: 'POST',
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            lectureId: this.state.lectureId,
            isLocked: this.state.isLocked
        })
        }).then(response => response.json())
        .then(data => {
            // if (this.state.isLocked) {
            //     this.setState({isLocked: false});
            // }
            // else {
            //     this.setState({isLocked: true});
            // }
            
        }); 
        }

    async handleQuestionChange(event) {
        const value = event.target.value;
        console.log(value);
        await this.setState({newQuestion: value});
        //console.log(event.target.value);
    }
    async handleMessageChange(event) {
        const value = event.target.value;
        console.log(value);
        await this.setState({message: value});
        //console.log(event.target.value);
    }
    //new question
    
    
    async handleNewQuestion() {
        console.log(this.state.newQuestion);
        console.log(this.state.classId);
        console.log(this.state.username);
        await fetch("http://localhost:9000/class/postClassQuestion", {
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                question: this.state.newQuestion,
                classId: this.state.classId,
                name: this.state.username
            })
        }).then(res => res.json()).then((data) => { 
            console.log(data)
            this.setState({newQuestion: ''})
            window.location.replace('/ClassPage/' + this.state.className);
        }).catch(console.log)
        // this.getQuestions()
    }

    async getQuestions() {
        console.log(this.state.classId);
    await fetch('http://localhost:9000/class/getClassQuestions?classId=' + this.state.classId ,{
                    method: 'GET',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Credentials': true,
                    }
                }).then(response => response.json())
                .then(data => {
                    console.log("ClassQuestionList");
                    for (var i = 0; i < data.length; i++) {
                        console.log(data[i]);
                        if (data[i].answer === '') {
                            data[i].answer = '(Not Yet Answered)';
                        }
                    }
                    this.setState({classQuestionList: data})
                }).catch(console.log);
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



    async handleNotificationPage(){
        var link = "/classNotifications/" + this.state.classId
        window.location.replace(link);
    }
    async handleMessagePage(){
        var link = "/classMessages/" + this.state.classId
        window.location.replace(link);
    }




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

    async handleGetNotifications() {
        await fetch(`http://localhost:9000/classnotifications?class=${this.state.classId}`, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(res => res.json()).then((data) => { 
            console.log("data",data);
            if (data) this.setState({notifications: data.length });
            else this.setState({notifications: 0 });
            
            // window.location.replace('/dashboard');
        }).catch(console.log("ok"))
    } /* End handleGetNotifications(...) */


    async handleSendMessage() {
        if (!this.state.type){
            console.log(this.state.userId, this.state.message, this.state.classId)
            await fetch(`http://localhost:9000/messages`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    sender: this.state.userId,
                    content: this.state.message,
                    id: this.state.classId
                })
            }).catch(console.log("ok"))
        }
        else {
            await fetch(`http://localhost:9000/studentmessages`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    sender: this.state.userId,
                    content: this.state.message,
                    id: this.state.classId
                })
            }).catch(console.log("ok"))
        } /* End handleGetNotifications(...) */
    }
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