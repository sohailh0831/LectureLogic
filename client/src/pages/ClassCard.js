import React from "react";
import {Card, CardContent, Header} from "semantic-ui-react";
import {Link} from "react-router-dom";

import Register from './Register';


export default class ClassCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            className: '',
            classDesc: ''
        }
        
    }

    async componentDidMount(){
        //console.log(this.props.post);
        this.setState({
            className: this.props.className,
            classDesc: this.props.classDesc
        });
    }

    render() {

        return(
            <div>
                
                <Card style={{width: "500px"}} centered >
                    <Card.Content>
                        <Header as="h4" textAlign="left" dividing>
                            <div className="left aligned">
                                <Header.Content>
                                    {this.props.className}
                                    <div className="meta">
                                        <p style={{fontSize: "75%"}} data-testid={"Class Description"}>({this.props.classDesc})</p>
                                    </div>
                                </Header.Content>

                            </div>
                        </Header>
                    </Card.Content>
                </Card>
            </div>

        )//End return(...)
    } //End render(){...}
};