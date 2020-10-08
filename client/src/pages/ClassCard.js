import React from "react";
import {Button, Card, CardContent, Grid, GridRow, Header, Icon, Image, Modal, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";

import Register from './Register';


export class ClassCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {

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
                                    <Link to={Register}> {this.state.className} </Link>
                                    <div className="meta">
                                        <p style={{fontSize: "75%"}} data-testid={"Class Description"}>({this.state.classDesc})</p>
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