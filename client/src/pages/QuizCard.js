import React from "react";
import {Card, Header, Modal, Button, Form, Checkbox, Input, List} from "semantic-ui-react";


export default class QuizCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            openModal: false,
            openCommentModel: false,
            answer: this.props.answer,
            commentList: [],
            comment: '',
            c: []
            
        }
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleAnswerChange = this.handleAnswerChange.bind(this);
        this.handleSubmitAnswer = this.handleSubmitAnswer.bind(this);
        this.handleResolve = this.handleResolve.bind(this);
        this.handleOpenCommentModal = this.handleOpenCommentModal.bind(this);
        this.handleGetComments = this.handleGetComments.bind(this);
        this.handleSubmitComment = this.handleSubmitComment.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.handleCloseCommentModal = this.handleCloseCommentModal.bind(this);

    }

    async componentDidMount(){
        //console.log(this.props.post);
        
    }

    render() {  
         
         //if (this.props.studentName === )
         // if current user is username of question asker or is instructor
            // show button to resolve
         // else
            // show resolved or not based on isAnsweredValue
            //console.log("RESOLVE "+this.props.isResolved);

            //instructor deleting answer

        var quizButton;
        if(this.props.type == "0"){
            
            quizButton =  <Button onClick={this.handleOpenCommentModal} >  Take Quiz </Button>
        }
        else{
           quizButton =  <Button onClick={this.handleOpenCommentModal} >  Take Quiz </Button>
        }

        return(           
            <div>
                    <Card style={{width: "500px"}} centered >
                        <Card.Content>
                            <div className="right aligned">
                            </div>

                            <div className="right aligned">
                                {/* Add variable to change name on button from Click to respond to Click to see responces */}
                                <Button onClick={this.handleOpenCommentModal} >  Take Quiz </Button>

                                <Modal
                                    onClose={() => this.setState({openCommentModal: false})}
                                    onOpen={() => this.setState({openCommentModal: true})}
                                    open={this.state.openCommentModal}
                                    //close={!this.state.openModal}
                                >
                                <Modal.Header>Question: {this.props.question}</Modal.Header>
                                <Modal.Content>
                                    <Modal.Description>
                                    <Header> Answer: {this.props.answer} </Header>
                                        Comments: 
                                        <div class="ui inverted segment">
                                        <div class="ui inverted relaxed divided list">
                                        {this.state.c.map((index) => { return (
                                                <div class="item">
                                                    <div class="content">
                                                        <div class="header">{index.comment}</div>
                                                        {index.commenter}
                                                    </div>
                                                    </div>
                                                     )})}
                                        </div>
                                        </div>

{/* 
                                        <List>
                                            {this.state.c.map((index) => { return (<List.Item>
                                                "{index.comment}" - {index.commenter}
                                                </List.Item>) })}
                                        </List> */}

                                    
                                        <Form.Input
                                            placeholder='Leave a Comment!'
                                            value={this.state.comment}
                                            onChange={this.handleCommentChange}
                                        />

                                    </Modal.Description>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button
                                        content="Close"
                                        labelPosition='left'
                                        icon='x'
                                        onClick={this.handleCloseCommentModal}
                                        negative
                                    />
                                    <Button
                                        content="Submit"
                                        labelPosition='right'
                                        icon='checkmark'
                                        onClick={this.handleSubmitComment}
                                        positive
                                    />
                                </Modal.Actions>
                            </Modal>


                            </div>
                            <Header as='h4' textAlign="left" dividing>
                                <div className="left aligned">
                                    <Header.Content>
                                        {this.props.quizName}
                                        <div className="meta">
                                            <p style={{fontSize: "75%"}} data-testid={"quizStartDate"}>Start Date: {this.props.quizStartDate}</p>
                                            <p style={{fontSize: "75%"}} data-testid={"quizDueDate"}>Due Date: {this.props.quizDueDate}</p>
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
        this.handleGetComments();
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
    
    handleCommentChange(event) {
        console.log(event.target.value);
        this.setState({comment: event.target.value});
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
        // await fetch(`http://localhost:9000/messages`, {
        //         method: 'POST',
        //         credentials: "include",
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json',
        //             'Access-Control-Allow-Credentials': true,
        //         },
        //         body: JSON.stringify({
        //             sender: this.props.userId,
        //             content: 'Your Instructor has answered a question!',
        //             id: this.props.classId
        //         })
        //     }).catch(console.log("ok"))


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
        //this.setState({openCommentModal: false});
        await fetch("http://localhost:9000/lecture/getComments?questionId=" + this.props.questionId, {
                method: 'GET',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                }
            }).then(res => res.json()).then((data) => { 
                console.log(data);
                this.setState({comments: data})
                this.setState({c: data})
                //window.location.replace(this.props.link);
            }).catch(console.log)
    }
    async handleCloseCommentModal() {
        console.log("Close comment");
        this.setState({openCommentModal: false, comment: ''});
    }

    async handleSubmitComment() {
        console.log('SubmitComment: ' + this.state.comment);
        console.log(this.props.lectureId);
        console.log(this.props.commenter);
        console.log(this.props.questionId);


        //this.setState({openModal: false, comment: ''});
        var link;
        var body;
        console.log(this.props.classId);
        if(this.props.lectureId == 0){ // it is a class type
            link = "http://localhost:9000/class/postComment";
            body = JSON.stringify({
                classId:this.props.classId,
                commenter: this.props.commenter,
                questionId: this.props.questionId,
                comment: this.state.comment
            })

        }
        else{
            link = "http://localhost:9000/lecture/postComment";
            body = JSON.stringify({
                lectureId:this.props.lectureId,
                commenter: this.props.commenter,
                questionId: this.props.questionId,
                comment: this.state.comment
            })
        }

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
                //window.location.replace(this.props.link);
                this.state.comment = "";
            }).catch(console.log)

        await this.handleGetComments()

    }

    async deleteQuestion(){
        await fetch("http://localhost:9000/deleteQuestion", {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    questionId: this.props.questionId
                })
            }).then(res => res.json()).then((data) => { 

            }).catch(console.log)
    }

    

}
