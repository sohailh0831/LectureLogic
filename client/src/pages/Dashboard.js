import React from 'react'
import { Button, Form, Grid, Header, Segment, Popup, Modal } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import ClassCard from './ClassCard';

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
            listReceived: false
        };
        this.handleAddClass = this.handleAddClass.bind(this);
        this.getClassList = this.getClassList.bind(this);
        this.handleClassNameChange = this.handleClassNameChange.bind(this);
        this.handleClassDescChange = this.handleClassDescChange.bind(this);
        

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
                this.setState({ username: data.username , name: data.name, response: data, userId: data.id, type: data.type })
            }); // here's how u set variables u want to use later
    
        this.getClassList();
    }

    compo


    render() {
        /* decided what popup message to present */
        let popUpMessage;
        if (this.state.response.type === '1') { //if user is a student
            popUpMessage = 'Join a Class';
        }
        else { //else user is instructor
            popUpMessage = 'Create New Class';
        }

        console.log(this.state.classList);

        if (this.state.response.type === '0') {
            return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Form size='large'>

                        <Segment stacked textAlign="center" verticalAlign='middle'>
                            <Header as = 'h2' color = 'grey' textAlign = 'center'>
                                {popUpMessage}
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
                            

                        </Segment>

                        {/* Class Card */}
                        <Grid.Column style={{width: "auto"}}>
                            {this.state.classList.map((classList, index) => {
                                    return(<ClassCard className={this.state.classList[index].name} classDesc={this.state.classList[index].description} />)
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
                                    {popUpMessage}
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
                                
    
                            </Segment>
    
                            {/* Class Card */}
                            <Grid.Column style={{width: "auto"}}>
                                {this.state.classList.map((classList, index) => {
                                        return(<ClassCard className={this.state.classList[index].name} classDesc={this.state.classList[index].description} />)
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





    async handleClassNameChange(event){
        const value = event.target.value;
        await this.setState({className: value});
    }
    async handleClassDescChange(event){
        const value = event.target.value;
        await this.setState({classDesc: value});
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
                    },
                    body: JSON.stringify({
                        id: this.state.userId
                    })
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