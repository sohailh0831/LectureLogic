import React from 'react'
import { Button, Form, Grid, Header, Segment, List,Modal} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import QuizQuestionCard from './QuizQuestionCard';
import { Test, QuestionGroup, Question, Option } from 'react-multiple-choice';

class TakeQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            userId: '',
            classId: '',
            response: '',
            type: '',
            testQuestions: ['Sample Question1', 'Sample Question2', 'John', 'George', 'Ringo'],
            questionInterval: '',
            openNewQuestionModal: false,
            openNewSubmitButtonModal: false,
            quizId: '',
            quizName: '',
            quizStartDate: '',
            quizDueDate: '',
            quizShowAnswers: '',
            newQuestion: '',
            newQuestionAnswerA: '',
            newQuestionAnswerB: '',
            newQuestionAnswerC: '',
            newQuestionAnswerD: '',
            newQuestionCorrectAnswer: '',
            newQuestionPointValue: '',
            questionList:[],
            sH: "False", // show answers boolean
            isPublished: 0,
            selectedOptions: {},
            savedOptions: [],
            minGrade: ''
        };


       
        this.handleGetQuestions = this.handleGetQuestions.bind(this);
        this.handleSelections = this.handleSelections.bind(this);
        this.handleSaveQuestions = this.handleSaveQuestions.bind(this);
        this.handleSubmitQuiz = this.handleSubmitQuiz.bind(this);
        this.handleModalClick = this.handleModalClick.bind(this);

    }


    async componentDidMount() { // this is function called before render() ... use it to fetch any info u need
        // Simple GET request using fetch

        if(localStorage.getItem("authenticated") !== "authenticated"){
            window.location.replace('/login'); //redirects to login if not already logged in
        }

        /* gets the ID in the path name of URL e.g /LectureView/ID*/
        let urlElements = window.location.pathname.split('/')
        this.setState({classId: urlElements[2]})
        this.setState({quizId: urlElements[3]})



        
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



        await fetch('http://localhost:9000/quiz/getQuizDetails' ,{
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                quizId : this.state.quizId,
            })
        }).then(response => response.json())
            .then(data => {
                this.setState({ quizName: data.quizName , quizStartDate: data.startDate, quizDueDate: data.dueDate, quizShowAnswers: data.showAnswers, isPublished: data.isPublished,  minGrade: data.minGrade})
                if(data.showAnswers == 1){
                    this.state.sH = "True";
                }
                console.log(data);
            });

        this.handleGetQuestions();
            console.log("AYEEEEEEE", this.state.selectedOptions)

    }


    render() {
        /* decided what popup message to present */

        return (
            <div>
            
            <Grid padded style={{height: '100vh'}} columns={3} >
                <Grid.Row style={{height: '90%'}} textAlign = 'center' >
                    <Grid.Column style={{width: 400}}>
                        <Header>Saved Answers</Header>
                        <Segment>
                            {this.state.savedOptions.map((entry) => {
                                return(
                                <view>
                                    Question: {entry.question}
                                    <p>Answer: {entry.studentAnswer}</p>
                                    <p></p>
                                </view>)
                            })}
                        </Segment>
                        
                    </Grid.Column>  
                    <Grid.Column style={{width: 900}}>  
                        {/* Question list component */}
                        <Header>{this.state.quizName}</Header>
                        <Segment>
                            
                        <Test onOptionSelect={selectedOptions => this.setState({ selectedOptions })}>

                        {this.state.questionList.map((entry) =>{
                                        return(
                                            <QuestionGroup questionNumber={entry.quizQuestionId}>
                                            <Question>({entry.pointValue} pts) Question: {entry.quizQuestion} </Question>
                                            <Option value="A">{JSON.parse(entry.answerChoices)[0].A}</Option>
                                            <Option value="B">{JSON.parse(entry.answerChoices)[1].B}</Option>
                                            <Option value="C">{JSON.parse(entry.answerChoices)[2].C}</Option>
                                            <Option value="D">{JSON.parse(entry.answerChoices)[3].D}</Option>
                                        </QuestionGroup>     
                                        );
                                    })}

                        </Test>
                        </Segment>

                    </Grid.Column>
                    <Grid.Column style={{width: 200}}>
                        <Segment>
                                <Button onClick={this.handleSaveQuestions} color='purple' fluid size='large'>
                                    Save Quiz Responses
                                </Button>
                        </Segment>
                         
                        <Segment>
                        <Button onClick={this.handleSubmitQuiz} color='green' fluid size='large'>
                                    Submit Quiz Responses
                        </Button>
                        
                        <Modal
                                    onClose={() => this.setState({openNewSubmitButtonModal: false})}
                                    onOpen={() => this.setState({openNewSubmitButtonModal: true})}
                                    open={this.state.openNewSubmitButtonModal}
                                    //close={!this.state.openModal}
                                >
                                <Modal.Header>Successfully submitted Quiz.</Modal.Header>
                                <Modal.Content>
                                    <Modal.Description>
                                        You may now exit the page. Click here to continue back to dashboard page
                                    </Modal.Description>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button
                                        content="Back to Dashboard"
                                        labelPosition='right'
                                        icon='checkmark'
                                        onClick={this.handleModalClick}
                                        positive
                                    />
                                </Modal.Actions>
                            </Modal>


                        </Segment>
                    </Grid.Column>
                
                </Grid.Row>
            </Grid>
        </div>

        ) //End return(...)
        
    }//end render

    //new question




    async handleGetQuestions(){
        //TODO
        await fetch('http://localhost:9000/quiz/getAllQuizQuestions' ,{
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                quizId: this.state.quizId,
            })
            }).then(response => response.json())
            .then(data => {
               this.setState({questionList: data});
            }); 

        await fetch('http://localhost:9000/quiz/getAnsweredQuestions' ,{
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                quizId: this.state.quizId,
                userId: this.state.userId
            })
            }).then(response => response.json())
            .then(data => {
               let select = this.state.selectedOptions;
               data.forEach(element => {
                   select[element.questionId] = element.studentAnswer;
               });
               data.forEach(element => {
                   this.state.questionList.forEach(ele => {
                       if(ele.quizQuestionId === element.questionId){
                           element.question = ele.quizQuestion;
                       }
                   })
                   select[element.questionId] = element.studentAnswer;
               });
               this.setState({selectedOptions: select, savedOptions: data});
            }); 

    }


    async handleSelections(){
        console.log("BRUHHHHHHH",this.state.selectedOptions);
    }

    async handleSaveQuestions(){ //will need to update to store selectedOptions in db
            // let selections = this.state.selectedOptions; // in JSON format ("questionId": "A")
            // let quizId = this.state.quizId;
            // let questionList = this.state.questionList;
            // let userId = this.state.userId;
            //console.log("BRUHHHHHHH",this.state.selectedOptions);
            return new Promise(resolve => {
             fetch('http://localhost:9000/quiz/saveQuizScores' ,{
                method: 'POST',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    selections : JSON.stringify(this.state.selectedOptions),
                    questionList : JSON.stringify(this.state.questionList),
                    userId : this.state.userId,
                    quizId : this.state.quizId
                })
                }).then(response => response.json())
                .then(data => {
                }); 
                resolve();
                return;
            });

    }
    async handleSubmitQuiz(){
            //TODO
            //Grade Quiz
            await this.handleSaveQuestions();

            await fetch('http://localhost:9000/quiz/submitQuizScores' ,{
                method: 'POST',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    userId : this.state.userId,
                    quizId : this.state.quizId,
                    quizName: this.state.quizName,
                    classId : this.state.classId,
                    minGrade: this.state.minGrade
                })
                }).then(response => response.json())
                .then(data => {

                }); 

                this.setState({openNewSubmitButtonModal: true});

    }

    async handleModalClick(){
        window.location.replace("/");
    }


    
} export default TakeQuiz