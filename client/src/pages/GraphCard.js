import React from "react";
import {Card, Header, Modal, Button} from "semantic-ui-react";
import {Link} from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import ZingChart from 'zingchart-react'
import {zingchart, ZC} from 'zingchart/es6';
import 'zingchart/modules-es6/zingchart-pareto.min.js';


export default class GraphCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            avgConfidence: '',
        }
        this.handleGetAvgConfidence = this.handleGetAvgConfidence.bind(this);
    }

    async componentDidMount(){

    }

    render() {
        //setup for graph using values from props
        let listX = [];
        let listY = [];
        for (let i = 0; i < this.props.studentConfList.length; i++) {
            // console.log("In LOOP: " + this.state.studentConfList[i]);
            listX.push(this.props.studentConfList[i].name);
            listY.push(parseInt(JSON.parse(this.props.studentConfList[i].confidence), 10)); //2nd param is base for the number system to parse the int in
        }
        // console.log("listxandy:", listX, listY);
        let myConfig = {
            type: 'bar',
            title: {
                text: '' + this.props.studentName + '\'s Confidence Level for ' + this.props.className,
                fontSize: 24,
            },
            scaleX: {
                // Set scale label
                label: { text: 'Lecture Name' },
                // Convert text on scale indices
                labels: listX //change to student names
            },
            scaleY: {
                // Scale label with unicode character
                label: { text: 'Confidence Levels' }
            },
            series: [
                {
                // plot 1 values, linear data
                values: listY,
                }
            //   {
            //     // plot 2 values, linear data
            //     values: [35,42,33,49,35,47,35],
            //     text: 'Week 2'
            //   },
            //   {
            //     // plot 2 values, linear data
            //     values: [15,22,13,33,44,27,31],
            //     text: 'Week 3'
            //   }
            ]
        };

        //display the chart with the data
        return(
            <ZingChart data={myConfig}/>
        )
    }
    


    async handleGetAvgConfidence() {
        console.log("Getting avg confidence");
        await fetch("http://localhost:9000/avgconfidence?quizId=" + this.props.quizId, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(res => res.json()).then((data) => { 
            console.log("data",data);
            this.setState({avgConfidence: data.Average})
            // window.location.replace('/dashboard');
        }).catch(console.log("ok"))
    } /* End handleAddClass(...) */




};