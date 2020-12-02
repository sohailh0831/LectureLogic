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
          this.handleEditQuiz = this.handleEditQuiz.bind(this);
          this.handleTakeQuiz = this.handleTakeQuiz.bind(this);

    }

    async componentDidMount(){
        
    }

    render() {  

        var quizButton;
        if(this.props.type == "0"){
            quizButton =  <Button onClick={this.handleEditQuiz} >  Edit Quiz </Button>
        }
        else{
            quizButton =  <Button onClick={this.handleTakeQuiz} >  Take Quiz </Button>
        }

        return(           
            <div>
                    <Card style={{width: "500px"}} centered >
                        <Card.Content>
                            <div className="right aligned">
                            </div>

                            <div className="right aligned">
                                {/* Add variable to change name on button from Click to respond to Click to see responces */}
                                {quizButton}

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
                            
                        </Card.Content>
                    </Card>
                {/* </Link> */}
            </div>

        )//End return(...)
    }//End render(...)

    // }


  async handleEditQuiz(){
      var link = "http://localhost:3000/editQuiz/" + this.props.classId +"/" + this.props.quizId;
      window.location.replace(link);
  } 
  async handleTakeQuiz(){
      //prbly a confirmation popup if they want to start quiz
      var link = "http://localhost:3000/takeQuiz/" + this.props.classId +"/" + this.props.quizId;
      window.location.replace(link);

  }


}
