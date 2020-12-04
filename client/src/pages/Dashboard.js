import React from 'react'
import { Button, Form, Grid, Header, Segment, Modal } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import ClassCard from './ClassCard';
import QuestionCard from './QuestionCard';
import QuizCard from './QuizCard';
import DashboardQuizCard from './DashboardQuizCard';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            userId: '',
            response: '',
            classList: [],
            newClassDesc: '',
            type: '',
            school: '',
            listReceived: false,
            studentList: [],
            studentQuestions:[],
            classQuizzes: []
        };
        this.handleAddClass = this.handleAddClass.bind(this);
        this.getClassList = this.getClassList.bind(this);
        this.handleClassNameChange = this.handleClassNameChange.bind(this);
        this.handleClassDescChange = this.handleClassDescChange.bind(this);
        this.handleGetStudentQuestions = this.handleGetStudentQuestions.bind(this);
        this.handleGetQuizzes = this.handleGetQuizzes.bind(this);
        

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
    
        this.getClassList();
        this.handleGetStudentQuestions();
        console.log('end of component did mount');
    }

    compo


    render() {
        /* decided what popup message to present */
        // let popUpMessage;
        // if (this.state.response.type === '1') { //if user is a student
        //     popUpMessage = 'Join a Class';
        // }
        // else { //else user is instructor
        //     popUpMessage = 'Create New Class';
        // }

        console.log(this.state.classList);
        console.log("SCHOOL "+this.state.school);
        if (this.state.response.type === '0') { //if instructor
            //console.log("DASH TYPE: "+this.state.response.type);

            return (
                <Grid style={{maxWidth: '100vw', maxHeight: '100vh'}} textAlign='center' rows={2}>
                    <Grid.Row style={{height: '10vh'}} textAlign='center'>     {/* Name of College */}
                        <br/>
                        <Header as = 'h2' color = 'grey' textAlign = 'center' horizontalAlign='center'>
                            {this.state.school}
                        </Header>
                    </Grid.Row>

                    <Grid.Row style={{height: '90vh'}} columns={3}>             {/* Main body of screen */}
                        <Grid.Column style={{width: '50vw'}}>
                            <Header as = 'h2' color = 'grey' textAlign = 'center' horizontalAlign='center'>
                                ClassList
                            </Header>
                            <Modal
                                trigger={<Button icon='add' color='purple' ></Button>}
                                header='Add New Class'
                                content={
                                    <Form>
                                        <Form.Input
                                            placeholder='Class Name'
                                            required={true}
                                            value={this.state.className}
                                            onChange={this.handleClassNameChange}
                                        />
                                        <Form.Input
                                            placeholder='Class Description'
                                            required={true}
                                            value={this.state.classDesc}
                                            onChange={this.handleClassDescChange}
                                        />
                                    </Form>
                                }
                                actions={['Close', <Button color='purple' onClick={this.handleAddClass}> done</Button>]}
                            />

                            <br/>   {/* Need two \n's to have a space after the modal and before the actual classlist */}
                            <br/>

                            {this.state.classList.map((classList, index) => {
                                    return(<ClassCard classId={this.state.classList[index].id} className={this.state.classList[index].name} classDesc={this.state.classList[index].description } type={this.state.response.type}/>)
                                }
                            )}
                        </Grid.Column >
                            
                            {/* use a column here to add another column like on the student page. Example below copied from student dashboard */}
                        {/* <Grid.Column style={{width: '50vw'}}>
                            <Header as = 'h2' color = 'grey' textAlign = 'center' horizontalAlign='center'>
                                Your Questions
                            </Header>

                            {yourQuestions}

                        </Grid.Column> */}
                    </Grid.Row>

                </Grid>


        ) //End return(...)
            //return(<ClassCard className={this.state.classList.name} classDesc={this.state.description} />);// -- ideally this works first shot but honestly prolly not lol
        
        } 
        else {  //if student
            //Sets up question list

            var yourQuestions;
            if (this.state.studentQuestions.length === 0) {
                //console.log("studentQuestions empty");
                yourQuestions=
                <Header as = 'h2' color = 'grey' textAlign = 'center' horizontalAlign='center'>
                    No Questions Asked
                </Header>
            }
            else {
                //console.log("studentQuestions not empty");
                yourQuestions=
                this.state.studentQuestions.map((entry) =>{
                    return(<QuestionCard lectureId={0} commenter={this.state.username} question={entry.question} studentFlag={1} isAnswered={entry.isAnswered} answer={entry.answer} studentName={entry.studentName} time={entry.formattedTimestamp} questionId={entry.questionId} link={window.location.href} type={this.state.response.type} classId={entry.classId}></QuestionCard>);                                 
                })
            }

            return (
                <Grid style={{maxWidth: '100vw', maxHeight: '100vh'}} textAlign='center' rows={2}>
                    <Grid.Row style={{height: '10vh'}} textAlign='center'>     {/* Name of College */}
                        <br/>
                        <Header as = 'h2' color = 'grey' textAlign = 'center' horizontalAlign='center'>
                            {this.state.school}
                        </Header>
                    </Grid.Row>

                    <Grid.Row style={{height: '90vh'}} columns={3}>             {/* Main body of screen */}
                        <Grid.Column style={{width: '50vw'}}>
                            <Header as = 'h2' color = 'grey' textAlign = 'center' horizontalAlign='center'>
                                ClassList
                            </Header>
                            <Modal
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
                            />

                            <br/>   {/* Need two \n's to have a space after the modal and before the actual classlist */}
                            <br/>

                            {this.state.classList.map((classList, index) => {
                                    return(<ClassCard classId={this.state.classList[index].id} className={this.state.classList[index].name} classDesc={this.state.classList[index].description } type={this.state.response.type}/>)
                                }
                            )}
                        </Grid.Column >
                            
                        <Grid.Column style={{width: '50vw'}}>
                            <Header as = 'h2' color = 'grey' textAlign = 'center' horizontalAlign='center'>
                                Your Questions
                            </Header>

                            {yourQuestions}

                        </Grid.Column>

                        <Grid.Column>
                            <Header as = 'h2' color = 'grey' textAlign = 'center' horizontalAlign='center'>
                                Upcoming Quizzes
                            </Header>

                            {this.state.classList.map((entry, x) =>{
                                console.log('DASHBOARD CLASSID: ');
                                console.log(entry);
                                console.log(this.state.classList);
                                return(<DashboardQuizCard className={entry.name} classId={entry.id} type={this.state.type}/>) ;        
                            })}
                        </Grid.Column>
                    </Grid.Row>

                </Grid>
    
    
            ) //End return(...)
                //return(<ClassCard className={this.state.classList.name} classDesc={this.state.description} />);// -- ideally this works first shot but honestly prolly not lol
            
            
        }
    }//End redner{}(...)

     //Code parts that need to be in here (if student)

// </Grid>
        //1. Name of college
            // <Header as = 'h2' color = 'grey' textAlign = 'center' horizontalAlign='center'>
            //  {this.state.school}
            // </Header>
        //2. ClassList
            // {this.state.classList.map((classList, index) => {
            //         return(<ClassCard classId={this.state.classList[index].id} className={this.state.classList[index].name} classDesc={this.state.classList[index].description } type={this.state.response.type}/>)
            //     }
            // )}
        //3. List of Asked Questions
            // NEED TO CODE






    async handleClassNameChange(event){
        const value = event.target.value;
        await this.setState({className: value});
    }
    async handleClassDescChange(event){
        const value = event.target.value;
        await this.setState({classDesc: value});
    }

    async handleGetStudentQuestions() {
        await fetch('http://localhost:9000/userQuestions?username=' + this.state.username ,{
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                }
        }).then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({studentQuestions: data, listReceived: true})
        }).catch(console.log);
    }

    async handleGetQuizzes(x){
        var link;
        var toReturn;
        if(this.state.type == 0){ // if instructor
            link = "http://localhost:9000/quiz/getAllQuizzes";
        }
        else{ //if student .. only showing published quizzes and not already taken quizzes
            link = "http://localhost:9000/quiz/getAllQuizzesStudent"
        }
        await fetch(link ,{
        method: 'POST',
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            classId: x,
            type: this.state.type
        })
        }).then(response => response.json())
        .then(data => {
            toReturn = data
            console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEE");
            console.log(data);
            return(data);
        }).catch(console.log); 

    }


    async handleAddClass() {
        if (this.state.type === '0') {
            console.log("Instructor adding class");
            await fetch("http://localhost:9000/class/addClass", {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    name: this.state.className,
                    description: this.state.classDesc,
                    instructor_id: this.state.userId,
                })
            }).then(res => res.json()).then((data) => { 
                console.log(data);
                this.setState({response: data})
                window.location.replace('/dashboard');
            }).catch(console.log)
        }
        else {
            //JOE PLACE STUDENT JOINING CLASS HERE
            //if (this.state.type === '0') {
                console.log("Student Adding Class");
                await fetch(`http://localhost:9000/reqestClass?classId=${this.state.className}`, {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({

                    })
                }).then(res => res.json()).then((data) => { 
                    console.log(data);
                    this.setState({response: data})
                    window.location.replace('/dashboard');
                }).catch(console.log)

                //JOE PUT THE CODE BELOW HERE WHERE YOU HAVE TEACHERS ACCEPTING CLASS REQUESTS
                console.log("ADDING STUDENT TO CLASS");
                await fetch(`http://localhost:9000/class/addStudentToClass`, {
                    method: 'POST',
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({
                        'student_id': this.state.userId,
                        'class_id': this.state.className
                    })
                }).then(res => res.json()).then((data) => { 
                    console.log(data);
                    this.setState({response: data})
                    window.location.replace('/dashboard');
                }).catch(console.log)
            //}
        }
    } /* End handleAddClass(...) */









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


    



    
} export default Dashboard