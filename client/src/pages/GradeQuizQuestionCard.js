import React from "react";
import {Card, Header} from "semantic-ui-react";


export default class GradeQuizQuestionCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            openModal: false,
            openCommentModel: false,
            answer: this.props.answer,
            commentList: [],
            comment: '',
            c: [],
            answerA: '',
            answerB: '',
            answerC: '',
            answerD: ''
            
        }
          this.handleDeleteQuestion = this.handleDeleteQuestion.bind(this);

    }

    async componentDidMount(){
        var listAnswers = JSON.parse(this.props.quizAnswerChoices)
        this.setState({answerA: listAnswers[0].A, answerB: listAnswers[1].B,answerC: listAnswers[2].C,answerD: listAnswers[3].D})


    }

    render() {  

        //var deleteButton;
        var points;
        if(this.props.correctFlag == 0){
            //deleteButton =  <Button onClick={this.handleDeleteQuestion} >  Delete Question </Button>
            points = <p style={{fontSize: "75%"}} data-testid={"answer"}>(Points: 0/{this.props.quizPointValue})</p>
        } else {
            points = <p style={{fontSize: "75%"}} data-testid={"answer"}>(Points: {this.props.quizPointValue}/{this.props.quizPointValue})</p>
        }

        var answer;
        if(this.props.type == 0) { //instructor
            answer = <p style={{fontSize: "75%"}} data-testid={"answer"}>(Student Answer: {this.props.quizStudentAnswer})</p>;
        } else {
            answer = <p style={{fontSize: "75%"}} data-testid={"answer"}>(Your Answer: {this.props.quizStudentAnswer})</p>;
        }

        console.log("Grade quiz question card");
        return(           
            <div>
                    <Card style={{width: "500px"}} centered >
                        <Card.Content>
                            <div className="right aligned">
                            </div>

                            <div className="right aligned">
                                {/* Add variable to change name on button from Click to respond to Click to see responces */}
                                {/* {deleteButton} */}

                            </div>
                            <Header as='h3' textAlign="left" dividing>
                                <div className="left aligned">
                                    <Header.Content>
                                        Question: {this.props.quizQuestion}
                                        <div className="meta">
                                            <p style={{fontSize: "100%"}} data-testid={"quizQuestionChoices"}>A: {this.state.answerA}</p>
                                            <p style={{fontSize: "100%"}} data-testid={"quizQuestionChoices"}>B: {this.state.answerB}</p>
                                            <p style={{fontSize: "100%"}} data-testid={"quizQuestionChoices"}>C: {this.state.answerC}</p>
                                            <p style={{fontSize: "100%"}} data-testid={"quizQuestionChoices"}>D: {this.state.answerD}</p>
                                            {/* {instructorShowAnswer} */}
                                            <p style={{fontSize: "75%"}} data-testid={"answer"}>(Correct Answer: {this.props.quizQuestionAnswer})</p>
                                            {answer}
                                            {/* <p style={{fontSize: "75%"}} data-testid={"quizQuestionPointValue"}>Point Value: {this.props.quizPointValue}</p> */}
                                            {points}
                                        </div>
                                    </Header.Content>

                                </div>
                            </Header>
                            
                        </Card.Content>
                    </Card>
                {/* </Link> */}
            </div>

        )//End return(...)
    }//End render(...)

    // }


  async handleDeleteQuestion(){
      //TODO
      await fetch('http://localhost:9000/quiz/deleteQuizQuestion' ,{
        method: 'POST',
        credentials: "include",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            questionId: this.props.quizQuestionId
        })
        }).then(response => response.json())
        .then(data => {
            console.log("Deleted question")
        });
        window.location.reload();

  } 


}
