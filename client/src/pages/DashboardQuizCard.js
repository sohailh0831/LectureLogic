import React from "react";
import {Header} from "semantic-ui-react"
import QuizCard from "./QuizCard";


export default class DashboardQuizCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            quizList: []
        }

        this.handleGetQuizzes = this.handleGetQuizzes.bind(this);

    }

    async componentDidMount(){
        //componentDidMount
        this.handleGetQuizzes();
    }

    render() {
        //this.handleGetQuizzes();
        if (this.state.quizList.length > 0){
            return(
                <div>
                    <br/>
                    <Header> {this.props.className} </Header>
                    {this.state.quizList.map((entry) =>{
                        return(<QuizCard quizName={entry.quizName} quizStartDate={entry.startDate} quizDueDate={entry.dueDate} quizId={entry.quizId} link={this.props.link} type={this.props.type} classId={this.props.classId} userId={this.props.userId}></QuizCard>);       
                    })}
                </div>
            )
        }
        else {
            return(null);
        }
    }


    async handleGetQuizzes(){
        var link;
        console.log("in handle get quizzes");
        console.log(this.props.type);
        console.log(this.props.classId);        
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
            classId: this.props.classId,
            type: this.props.type
        })
        }).then(response => response.json())
        .then(data => {
            this.setState({quizList: data})
        }).catch(console.log); 

    }

};