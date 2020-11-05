import React from "react";
import {Card, CardContent, Header, Modal, Button, Form, Checkbox, Input} from "semantic-ui-react";
import {Link} from "react-router-dom";


export default class QuestionCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            openModal: false,
            openCommentModel: false,
            answer: this.props.answer
            
        }
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleAnswerChange = this.handleAnswerChange.bind(this);
        this.handleSubmitAnswer = this.handleSubmitAnswer.bind(this);
        this.handleResolve = this.handleResolve.bind(this);
        this.handleOpenCommentModal = this.handleOpenCommentModal.bind(this);
        this.handleGetComments = this.handleGetComments.bind(this);
    }

    async componentDidMount(){
        //console.log(this.props.post);
        
    }

    render() {  
         let temp; 
         if ( this.props.answer === '(Not Yet Answered)' )  {   // && this.props.studentFlag === 0
            temp = <Input placeholder='Click to answer question' onClick={this.handleOpenModal}/>;
         }  else {
            temp = this.props.answer;
         }
         
         //if (this.props.studentName === )
         // if current user is username of question asker or is instructor
            // show button to resolve
         // else
            // show resolved or not based on isAnsweredValue
            //console.log("RESOLVE "+this.props.isResolved);
            let temp2;
            if ( this.props.isAnswered == 1) {
                //checked=true;
                temp2 = <Checkbox label='Mark as unresolved' onClick={this.handleResolve} checked={this.props.isAnswered==1} />;
            } else {
                //checked=false;
                temp2 = <Checkbox label='Mark as resolved' onClick={this.handleResolve} checked={this.props.isAnswered==1}/>
            }
        return(           
            <div>
                {/* <Link onClick={this.handleOpenModal} >  */}
                    <Card style={{width: "500px"}} centered >
                        <Card.Content>
                            <div className="right aligned">
                            {/* <Checkbox label='Mark as resolved' onClick={this.handleResolve} /> */}
                            {temp2}
                            </div>
                            <div className="right aligned">
                                {/* Add variable to change name on button from Click to respond to Click to see responces */}
                                <Button onClick={this.handleOpenCommentModal} > Click to respond. </Button>

                                <Modal
                                onClose={() => this.setState({openCommentModal: false})}
                                onOpen={() => this.setState({openCommentModal: true})}
                                open={this.state.openCommentModal}
                                //close={!this.state.openModal}
                                >
                                <Modal.Header>Leave a comment:</Modal.Header>
                                <Modal.Content>
                                    <Modal.Description>
                                    <Header> {this.props.question} </Header>
                                    <Form.Input
                                        placeholder=''
                                        //value={this.state.answer}
                                        //onChange={this.handleAnswerChange}
                                    />
                                    </Modal.Description>
                                </Modal.Content>
                                <Modal.Actions>
                                    
                                    <Button
                                        content="Submit"
                                        labelPosition='right'
                                        icon='checkmark'
                                        onClick={this.handleGetComments}
                                        positive
                                    />
                                </Modal.Actions>
                            </Modal>


                            </div>
                            <Header as='h4' textAlign="left" dividing>
                                <div className="left aligned">
                                    <Header.Content>
                                        {this.props.question}
                                        <div className="meta">
                                            <p style={{fontSize: "75%"}} data-testid={"Student"}>(Asked By: {this.props.studentName})</p>
                                            <p style={{fontSize: "75%"}} data-testid={"TimeStamp"}>Time Stamp: {this.props.time}</p>
                                            <p style={{fontSize: "75%"}} data-testid={"Answer"}>Answer: {temp}</p>
                                            {/* <p style={{fontSize: "75%"}} data-testid={"QuestionId"}>QID: {this.props.questionId}</p> */}

                                        </div>
                                    </Header.Content>

                                </div>
                            </Header>

                            <Modal
                                onClose={() => this.setState({openModal: false})}
                                onOpen={() => this.setState({openModal: true})}
                                open={this.state.openModal}
                                //close={!this.state.openModal}
                                >
                                <Modal.Header>Answer a Question</Modal.Header>
                                <Modal.Content>
                                    <Modal.Description>
                                    <Header> {this.props.question} </Header>
                                    <Form.Input
                                        placeholder=''
                                        //value={this.state.answer}
                                        onChange={this.handleAnswerChange}
                                    />
                                    </Modal.Description>
                                </Modal.Content>
                                <Modal.Actions>
                                    
                                    <Button
                                        content="Submit"
                                        labelPosition='right'
                                        icon='checkmark'
                                        onClick={this.handleSubmitAnswer}
                                        positive
                                    />
                                </Modal.Actions>
                            </Modal>
                            
                        </Card.Content>
                    </Card>
                {/* </Link> */}
            </div>

        )//End return(...)
    }//End render(...)

    handleOpenModal() {
        console.log('Opening Modal: ' + this.props.question);
        this.setState({openModal: true});
    }

    handleOpenCommentModal() {
        console.log('Opening comment model: ' );
        this.setState({openCommentModal: true});
    }
    // handleCloseModal() {
    //     console.log('Opening Modal: ' + this.props.question);
    //     this.setState({openModal: false});
    // }

    handleAnswerChange(event) {
        console.log(event.target.value);
        this.setState({answer: event.target.value});
    }

    async handleResolve() {
        if ( this.props.isAnswered === 1){ //call unresolve
            console.log('unresolving');
            await fetch("http://localhost:9000/Lecture/unresolveQuestion", {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    questionId: this.props.questionId,
                })
            }).then(res => res.json()).then((data) => { 
                console.log(data);
                this.setState({response: data, answer: ''})
                //window.location.replace(this.props.link);
            }).catch(console.log)

        } else {                            // call resolve
            console.log('resolving');
            await fetch("http://localhost:9000/lecture/resolveQuestion", {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    questionId: this.props.questionId,
                })
            }).then(res => res.json()).then((data) => { 
                console.log(data);
                this.setState({response: data, answer: ''})
                //window.location.replace(this.props.link);
            }).catch(console.log)
        }

    }

    async handleSubmitAnswer() {
        console.log('Submit: ' + this.state.answer);
        this.setState({openModal: false});
        await fetch("http://localhost:9000/lecture/answerQuestion", {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    questionId: this.props.questionId,
                    answer: this.state.answer
                })
            }).then(res => res.json()).then((data) => { 
                console.log(data);
                this.setState({response: data, answer: ''})
                //window.location.replace(this.props.link);
            }).catch(console.log)

    }

    async handleGetComments() {
        console.log('Getting comments for question: '+this.state.questionId);
        this.setState({openCommentModal: false});
        await fetch("http://localhost:9000/lecture/responses?questionId=" + this.props.questionId, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                }
            }).then(res => res.json()).then((data) => { 
                console.log(data);
                //this.setState({response: data, answer: ''})
                //window.location.replace(this.props.link);
            }).catch(console.log)

    }

    

}
