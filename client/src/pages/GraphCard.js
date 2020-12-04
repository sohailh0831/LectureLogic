import React from "react";
import {} from "semantic-ui-react";
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
        console.log("RESUlts");
        console.log(this.props.studentConfList[0]);

        let data = [];
        data = JSON.parse(this.props.studentConfList[0].record);
        console.log("TT");
        console.log(data);
        console.log(Object.keys(data));
        console.log(Object.values(data));


        let listX = Object.keys(data);
        let listY = Object.values(data);
        // for (let i = 0; i < listX.length; i++) {
        //     console.log("In LOOP: ");// + Object.keys(data)[i]);
        //     listX.push(Object.keys(data)[i]);
        //     listY.push(parseInt(Object.values(data)[i], 10)); //2nd param is base for the number system to parse the int in
        // }
        for(let i = 0; i< listY.length; i++){
            listY[i] = parseInt(listY[i], 10);
        }
        console.log("listxandy:", listX, listY);
        let myConfig = {
            type: 'bar',
            title: {
                text: 'Confidence Levels for ' + this.props.studentName,
                fontSize: 24,
            },
            scaleX: {
                // Set scale label
                label: { text: 'Lecture TimeStamp' },
                // Convert text on scale indices
                labels: listX //change to student names
            },
            scaleY: {
                // Scale label with unicode character
                label: { text: 'Confidence Levels' },
                //labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            },
            series: [
                {
                // plot 1 values, linear data
                values: listY,
                }
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