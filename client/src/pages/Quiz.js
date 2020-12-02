import React from 'react'
import { Button, Form, Grid, Header, Segment, List,Modal} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import QuizCard from './QuizCard';

class Quiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            userId: '',
            classId: '',
            response: '',
            type: '',
            classList: [],
            newClassDesc: '',
            changeFlag: false,
            formattedTimestamp: '',
            fullTime: '',
            testQuestions: ['Sample Question1', 'Sample Question2', 'John', 'George', 'Ringo'],
            questionInterval: '',
            lectureName: '',
            lectureSections: '',
            lectureDescription: '',
            openNewQuizModal: false,
            isLocked: false,
            newQuizName: '',
            newQuizStartDate: '',
            newQuizDueDate: '',
            newQuizShowAnswers: '',
            quizList: []

        };
        this.handleChange = this.handleChange.bind(this);
        this.handleGetQuizzes = this.handleGetQuizzes.bind(this);
        this.handleOpenNewQuizModal = this.handleOpenNewQuizModal.bind(this);
        this.handleCloseNewQuizModal = this.handleCloseNewQuizModal.bind(this);
        this.handleQuizNameChange = this.handleQuizNameChange.bind(this);
        this.handleQuizStartDateChange = this.handleQuizStartDateChange.bind(this);
        this.handleQuizDueDateChange = this.handleQuizDueDateChange.bind(this);
        this.handleQuizShowAnswersChange = this.handleQuizShowAnswersChange.bind(this);
        this.handleSubmitNewQuiz = this.handleSubmitNewQuiz.bind(this);

    }

    async handleChange(e) {
        await this.setState({ sliderData: e.target.value, changeFlag: true }); 
        console.log(this.state.sliderData); 
    }





    async componentDidMount() { // this is function called before render() ... use it to fetch any info u need
        // Simple GET request using fetch

        if(localStorage.getItem("authenticated") !== "authenticated"){
            window.location.replace('/login'); //redirects to login if not already logged in
        }

        /* gets the ID in the path name of URL e.g /LectureView/ID*/
        let urlElements = window.location.pathname.split('/')
        this.setState({classId: urlElements[2]})



        
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
                console.log(data);
            }); // here's how u set variables u want to use later


        this.handleGetQuizzes();
   
    }


    render() {
        /* decided what popup message to present */
        var addQuizSegment;  
        if(this.state.type === '0'){ //instructor 
                addQuizSegment = 
            <Segment>
                <Button onClick={this.handleOpenNewQuizModal} color='green' fluid size='large'>
                        Add a new quiz
                </Button>

                <Modal
                                    onClose={() => this.setState({openNewQuizModal: false})}
                                    onOpen={() => this.setState({openNewQuizModal: true})}
                                    open={this.state.openNewQuizModal}
                                    //close={!this.state.openModal}
                                >
                                <Modal.Header>New Quiz</Modal.Header>
                                <Modal.Content>
                                    <Modal.Description>
                                        Quiz Name
                                    <Form.Input
                                            placeholder='Enter Quiz Name Here'
                                            value={this.state.newQuizName}
                                            onChange={this.handleQuizNameChange}
                                        />
                                     Start Date
                                     <Form.Input
                                            placeholder='Enter Time (1/2/20 05:40:00'
                                            value={this.state.newQuizStartDate}
                                            onChange={this.handleQuizStartDateChange}
                                    />
                                    Due Date
                                     <Form.Input
                                            placeholder='Enter Time (1/2/20 05:40:00'
                                            value={this.state.newQuizDueDate}
                                            onChange={this.handleQuizDueDateChange}
                                    />
                                    Show Answers to Students
                                     <Form.Input
                                            placeholder='Enter True or False'
                                            value={this.state.newQuizShowAnswers}
                                            onChange={this.handleQuizShowAnswersChange}
                                    />

                                    </Modal.Description>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button
                                        content="Close"
                                        labelPosition='left'
                                        icon='x'
                                        onClick={this.handleCloseNewQuizModal}
                                        negative
                                    />
                                    <Button
                                        content="Submit"
                                        labelPosition='right'
                                        icon='checkmark'
                                        onClick={this.handleSubmitNewQuiz}
                                        positive
                                    />
                                </Modal.Actions>
                            </Modal>
                
            </Segment>
        }



    
        return (
            <div>
            <Grid padded style={{height: '100vh'}} columns={2} >
                <Grid.Row style={{height: '70%'}} textAlign = 'left' >
                    <Grid.Column style={{width: 1000}}>  
                        {/* Question list component */}
                        <Segment>
                        <Header as='h2' color='grey' textAlign='center'>
                                Quizzes
                        </Header>
                        <List>
                                {this.state.quizList.map((entry) =>{
                                        return(<QuizCard quizName={entry.quizName} quizStartDate={entry.startDate} quizDueDate={entry.dueDate} quizId={entry.quizId} link={window.location.href} type={this.state.response.type} classId={this.state.classId}></QuizCard>) ;    
                                    })}
                        </List> 



                    </Segment>      
                    </Grid.Column>
                                    
                                    
                    <Grid.Column style={{width: 400}}> 
                    {addQuizSegment}
                    </Grid.Column>
                
                </Grid.Row>
            </Grid>
        </div>

        ) //End return(...)
            //return(<ClassCard className={this.state.classList.name} classDesc={this.state.description} />);// -- ideally this works first shot but honestly prolly not lol
        
    } //End render{}(...)

    //new question



    handleOpenNewQuizModal() {
        console.log('Opening new quiz model: ' );
       // this.handleGetComments();
        this.setState({openNewQuizModal: true});
    }

    async handleCloseNewQuizModal() {
        console.log("Close quiz model");
        this.setState({openNewQuizModal: false});
    }

    handleQuizNameChange(event) {
        this.setState({newQuizName: event.target.value});
    }
    handleQuizStartDateChange(event) {
        this.setState({newQuizStartDate: event.target.value});
    }
    handleQuizDueDateChange(event) {
        this.setState({newQuizDueDate: event.target.value});
    }
    handleQuizShowAnswersChange(event){
        this.setState({newQuizShowAnswers: event.target.value})
    }

    async handleSubmitNewQuiz(){
        console.log(this.state.newQuizName,this.state.newQuizStartDate,this.state.newQuizDueDate,this.state.newQuizShowAnswers);
        this.setState({openNewQuizModal: false});
        var link = "http://localhost:9000/quiz/newQuizCreation";
        var sA = 0;
        if("True".localeCompare(this.state.showAnswers)){
            sA = 1;
        }
        console.log(sA)
        var body = JSON.stringify({
            quizName: this.state.newQuizName,
            classId: this.state.classId,
            instructorId: this.state.userId,
            quizStartDate: this.state.quizStartDate,
            quizDueDate: this.state.quizDueDate,
            showAnswers: sA
            
        })
        
        await fetch(link, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: body
        }).then(res => res.json()).then((data) => { 
            console.log(data);
            this.setState({newQuizName: '', newQuizStartDate: '', newQuizDueDate: '', newQuizShowAnswers: ''})
        }).catch(console.log)

        this.handleGetQuizzes();


    }



    async handleGetQuizzes(){
        await fetch('http://localhost:9000/quiz/getAllQuizzes' ,{
        method: 'POST',
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            classId: this.state.classId,
        })
        }).then(response => response.json())
        .then(data => {
            this.setState({quizList: data});
        }); 
    }




    
} export default Quiz