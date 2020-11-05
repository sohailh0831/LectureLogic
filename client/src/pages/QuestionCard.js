import React from "react";
import {Card, CardContent, Header, Modal, Button, Form} from "semantic-ui-react";
import {Link} from "react-router-dom";


export default class QuestionCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            openModal: false,
            answer: this.props.answer
            
        }
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleAnswerChange = this.handleAnswerChange.bind(this);
        this.handleSubmitAnswer = this.handleSubmitAnswer.bind(this);
    }

    async componentDidMount(){
        //console.log(this.props.post);
        
    }

    render() {       
        return(
            <div>
                <Link onClick={this.handleOpenModal} > {/*params={{className: this.state.className}} >*/}
                    <Card style={{width: "500px"}} centered >
                        <Card.Content>
                            <Header as="h4" textAlign="left" dividing>
                                <div className="left aligned">
                                    <Header.Content>
                                        {this.props.question}
                                        <div className="meta">
                                            <p style={{fontSize: "75%"}} data-testid={"Student"}>(Asked By: {this.props.studentName})</p>
                                            <p style={{fontSize: "75%"}} data-testid={"TimeStamp"}>Time Stamp: {this.props.time}</p>
                                            <p style={{fontSize: "75%"}} data-testid={"Answer"}>Answer: {this.props.answer}</p>
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
                                        //placeholder= {this.props.answer}
                                        value={this.state.answer}
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
                </Link>
            </div>

        )//End return(...)
    }//End render(...)

    handleOpenModal() {
        console.log('Opening Modal: ' + this.props.question);
        this.setState({openModal: true});
    }
    // handleCloseModal() {
    //     console.log('Opening Modal: ' + this.props.question);
    //     this.setState({openModal: false});
    // }

    handleAnswerChange(event) {
        console.log(event.target.value);
        this.setState({answer: event.target.value});
    }

    async handleSubmitAnswer() {
        console.log('Submit: ' + this.state.answer);
        this.setState({openModal: false});
        await fetch("http://localhost:9000/Lecture/answerQuestion", {
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
                this.setState({response: data})
                //window.location.replace(this.props.link);
            }).catch(console.log)

    }

    

}
