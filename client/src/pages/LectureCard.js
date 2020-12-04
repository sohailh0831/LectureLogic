import React from "react";
import {Card, Header, Modal, Button, Form, Dimmer, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import GraphCard from './GraphCard';


export default class LectureCard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            className: '',
            studentList: [],
            results: {},
            tempLectureName: '',
            tempLectureDesc: '',
            tempLectureSection: '',
            tmepLectureVideo: '',
            dimmed: true,
            studentConfList: [],
            tempMinConfidence: '',
            minConf: '',
            individualConfList: [],
            studentId: '',
            lectureId: ''
        }
        this.handleLectureMinConfidence = this.handleLectureMinConfidence.bind(this);
        this.handleGetStudentList = this.handleGetStudentList.bind(this);
        this.handleEditLecture = this.handleEditLecture.bind(this);
        this.handleRemoveLecture = this.handleRemoveLecture.bind(this);
        this.handleLectureNameChange = this.handleLectureNameChange.bind(this);
        this.handleLectureDescriptionChange = this.handleLectureDescriptionChange.bind(this);
        this.handleLectureSectionChange = this.handleLectureSectionChange.bind(this);
        this.handleLectureVideoLinkChange = this.handleLectureVideoLinkChange.bind(this);
        this.handleDimmer = this.handleDimmer.bind(this);
        this.handleUpdateHideFlag = this.handleUpdateHideFlag.bind(this);
        this.handleGetAllConfidence = this.handleGetAllConfidence.bind(this);
        this.handleGetConfidence = this.handleGetConfidence.bind(this);
    }

    async componentDidMount(){
        //console.log(this.props.post);
        this.setState({
            className: this.props.className,
            lectureId: this.props.lectureId,
            lectureName: this.props.lectureName,
            lectureDesc: this.props.lectureDesc,
            lectureVideoLink: this.props.lectureVideoLink,
            lectureViewedFlag: this.props.lectureViewedFlag,
            minConf: this.props.minConf,
            studentId: this.props.studentId,
            temp: this.props.type
        });

        //this.handleGetConfidence();
        //this.handleGetConfidence(this.props.lectureId, this.props.studentId);
    }

    render() {
        console.log("USER TPYE: "+this.props.type);
        if (this.props.type == 1){ // if student, hide student list button
            console.log("SHOWING STUDENT LECTURE CARD");
            if ( this.props.lectureViewedFlag == 1 ) {
                console.log("NEED TO GREY OUT LECTURE");
                
                console.log("lecID: "+this.props.lectureId);
                console.log("studentId: "+this.props.studentId);
                return(
                    <div>
                        {/* <Link to = {'/LectureView'} >  */}
                        {/* <Link to ={{ pathname: './ClassPage/'+this.state.className, state: {classId: this.state.classId, classDesc: this.state.classDesc} }} ></Link> */}
                        {/* <Popup trigger={ */}
                        <Dimmer.Dimmable as={Segment} dimmed={this.state.dimmed}>
                            <Link to ={{ pathname: '/LectureView/'+this.props.lectureId, state: {lectureId: this.props.lectureId, lectureDesc: this.props.lectureDesc, lectureSection: this.props.lectureSection, lectureVideoLink: this.props.lectureVideoLink} }} >
                                <Card background-color={'grey'} style={{width: "500px"}} centered >
                                    <Card.Content >
                                        <Header as="h4" textAlign="left" dividing>
                                            <div lecturename="left aligned">
                                                <Header.Content>
                                                    {this.props.lectureName}
                                                    <div lecturename="meta">
                                                        <p style={{fontSize: "75%"}} data-testid={"Lecture Description"}>({this.props.lectureDesc})</p>
                                                        <p style={{fontSize: "75%"}} data-testid={"Lecture Section"}>Section: {this.props.lectureSection}</p>
                                                        {/* <p style={{fontSize: "75%"}} data-testid={"Class Id"}>({this.props.classId})</p> */}
                                                    </div>
                                                    
                                                
                                                </Header.Content>
                                            </div>
                                        </Header>
                                        
                                    </Card.Content>
                                </Card>
                            </Link>
                            <Dimmer active={this.state.dimmed} onClickOutside={this.handleDimmer}>
                                Viewed!
                            </Dimmer>
                        </Dimmer.Dimmable>

                        <Modal
                            
                            trigger={<Button onClick={this.handleGetAllConfidence}>Stats</Button>}
                            header={'Confidence for ' + this.state.lectureName}
                            content={this.state.studentConfList.map((entry, index) => {
                                    console.log(this.props.studentName);
                                        if (this.state.studentConfList[index].id == this.props.studentId ){
                                            return(<GraphCard studentConfList={this.state.studentConfList[index]} studentName={this.state.studentConfList[index].name} studentId={this.props.studentId} classname={this.props.className} lectureName={this.state.lectureName}/>);
                                        }
                                    })}
                            // content={null}//<GraphCard studentConfList={this.state.studentConfList} studentName={this.props.studentName} studentId={this.props.studentId} classname={this.props.className} lectureName={this.props.lectureName}></GraphCard>}
                            actions={['Close']}
                        />
                        {/* }>Viewed</Popup> */}
                    </div>

                )//End return(...)
            } else {
                return(
                    <div>
                        {/* <Link to = {'/LectureView'} >  */}
                        {/* <Link to ={{ pathname: './ClassPage/'+this.state.className, state: {classId: this.state.classId, classDesc: this.state.classDesc} }} ></Link> */}
                        <Link to ={{ pathname: '/LectureView/'+this.props.lectureId, state: {lectureId: this.props.lectureId, lectureDesc: this.props.lectureDesc, lectureSection: this.props.lectureSection, lectureVideoLink: this.props.lectureVideoLink} }} >
                            <Card style={{width: "500px"}} centered >
                                <Card.Content>
                                    <Header as="h4" textAlign="left" dividing>
                                        <div lecturename="left aligned">
                                            <Header.Content>
                                                {this.props.lectureName}
                                                <div lecturename="meta">
                                                    <p style={{fontSize: "75%"}} data-testid={"Lecture Description"}>({this.props.lectureDesc})</p>
                                                    <p style={{fontSize: "75%"}} data-testid={"Lecture Section"}>Section: {this.props.lectureSection}</p>
                                                    {/* <p style={{fontSize: "75%"}} data-testid={"Class Id"}>({this.props.classId})</p> */}
                                                </div>
                                                
                                            
                                            </Header.Content>
                                        </div>
                                    </Header>
                                    
                                </Card.Content>
                            </Card>
                        </Link>
                    </div>

                )//End return(...)
            }
        } else {    // if instructor, show student list button
            console.log("SHOWING INSTRUCTOR LECTURE CARD\n");
            //hide button logic
            var hideButton;
            if (this.props.hidden == 0) { //if lecture is supposed to be visible
                hideButton=
                <Button color='blue' onClick={this.handleUpdateHideFlag}>
                    Hide
                </Button>
            }
            else {
                hideButton=
                <Button color='red' onClick={this.handleUpdateHideFlag}>
                    Make Visible
                </Button>
            }

            return(
                <div>
                        <Card style={{width: "500px"}} centered >                
                            <Card.Content>
                                <Header as="h4" textAlign="left" dividing> 
                                    <div lectureName="left aligned">
                                        <Header.Content>
                                            <Link to ={{ pathname: '/LectureView/'+this.props.lectureId, state: {lectureId: this.props.lectureId, lectureDesc: this.props.lectureDesc, lectureSection: this.props.lectureSection, lectureVideoLink: this.props.lectureVideoLink} }} >
                                                {this.props.lectureName}
                                            </Link>
                                            <div lectureName="meta">
                                                <p style={{fontSize: "75%"}} data-testid={"Lecture Description"}>({this.props.lectureDesc})</p>
                                                <p style={{fontSize: "75%"}} data-testid={"Lecture Section"}>Section: {this.props.lectureSection}</p>
                                                {/* <p style={{fontSize: "75%"}} data-testid={"Class Id"}>({this.props.classId})</p> */}
                                            </div>
                                        </Header.Content>
                                    </div> 
                                    
                                    {/* <Dropdown icon="list ul">
                                        <Dropdown.Menu>
                                            <Dropdown.Item>  */}
                                            {/* // onClick={() => {this.handleEditLecture(this.props.lectureId)}}>Edit */}
                                            
                                                <Modal
                                                    trigger={<Button content='Edit' ></Button>}
                                                    header='Edit Lecture'
                                                    content={
                                                        <Form>
                                                            <Form.Input
                                                                placeholder={this.props.lectureName}
                                                                required={false}
                                                                value={this.state.tempLectureName}
                                                                onChange={this.handleLectureNameChange}
                                                            />
                                                            <Form.Input
                                                                placeholder={this.props.lectureDesc}
                                                                required={false}
                                                                value={this.state.tempLectureDesc}
                                                                onChange={this.handleLectureDescriptionChange}
                                                            />
                                                            <Form.Input
                                                                placeholder={this.props.lectureSection}
                                                                required={false}
                                                                value={this.state.tempLectureSection}
                                                                onChange={this.handleLectureSectionChange}
                                                            />
                                                            <Form.Input
                                                                placeholder={this.props.lectureVideoLink}
                                                                required={false}
                                                                value={this.state.tempLectureVideoLink}
                                                                onChange={this.handleLectureVideoLinkChange}
                                                            />
                                                            <Form.Input
                                                                placeholder={this.props.minConf}
                                                                required={false}
                                                                value={this.state.tempMinConfidence}
                                                                onChange={this.handleLectureMinConfidence}
                                                            />
                                                        </Form>
                                                    }
                                                    actions={['Cancel', <Button color='purple' onClick={this.handleEditLecture}>Done</Button>]}
                                                />
                                          
                                            {/* </Dropdown.Item> */}

                                            <Button basic color='red' onClick={() => {this.handleRemoveLecture(this.props.lectureId)}}>
                                                Delete
                                            </Button>

                                            {hideButton} {/* See functionality above... if the object is supposed to be hidden, it should have a make visible button, else a hide button */}

                                            <Modal
                                                trigger={<Button onClick={this.handleGetAllConfidence}>Stats</Button>}
                                                header={'Confidence for ' + this.state.lectureName}
                                                content={this.state.studentConfList.map((entry, index) => {
                                                            //console.log("STuDEnT ConF LiST)");
                                                            //console.log(this.state.studentConfList[index]);
                                                            //console.log("listID: "+this.state.studentConfList[index].id+" propID: "+this.props.studentId);
                                                            return(<GraphCard studentConfList={this.state.studentConfList[index]} studentName={this.state.studentConfList[index].name} studentId={this.props.studentId} classname={this.props.className} lectureName={this.state.lectureName}/>);
                                                        })}
                                                // content={null}//<GraphCard studentConfList={this.state.studentConfList} studentName={this.props.studentName} studentId={this.props.studentId} classname={this.props.className} lectureName={this.props.lectureName}></GraphCard>}
                                                actions={['Close']}
                                            />
                                            {/* {<Button content='Delete' ></Button>} */}
                                        {/* </Dropdown.Menu> */}
                                    {/* </Dropdown> */}
                                    
                                </Header> 
                                                              
                            </Card.Content>
                        </Card>
           
                </div>

            )//End return(...)
        }
    } //End render(){...}

    async handleLectureNameChange(event){
        //const value = event.target.value;
        await this.setState({tempLectureName: event.target.value});
    }
    async handleLectureDescriptionChange(event){
        await this.setState({tempLectureDesc: event.target.value});
    }
    async handleLectureSectionChange(event){
        await this.setState({tempLectureSection: event.target.value});
    }
    async handleLectureVideoLinkChange(event){
        await this.setState({tempLectureVideoLink: event.target.value});
    }
    async handleLectureMinConfidence(event){
        const value = event.target.value;
        await this.setState({tempMinConfidence: value});
    }

    async handleDimmer(event){
        await this.setState({dimmed: false});
    }


    async handleEditLecture(lectureId) {
        console.log(this.props.type);
        if ( this.state.tempLectureName === '' || this.state.tempLectureName === undefined) {
            //console.log("NEW NAME UNDEFd");
            this.state.tempLectureName = this.props.lectureName;
        }
        if ( this.state.tempLectureDesc === '' || this.state.tempLectureDesc === undefined) {
            //console.log("NEW NAME UNDEFd");
            this.state.tempLectureDesc = this.props.lectureDesc;
        }
        if ( this.state.tempLectureSection === '' || this.state.tempLectureSection === undefined ) {
            //console.log("NEW NAME UNDEFd");
            this.state.tempLectureSection = this.props.lectureSection;
        }
        if ( this.state.tempLectureVideoLink === '' || this.state.tempLectureVideoLink === undefined) {
            //console.log("NEW NAME UNDEFd");
            this.state.tempLectureVideoLink = this.props.lectureVideoLink;
        }
        if ( this.state.tempMinConfidence === '' || this.state.tempMinConfidence === undefined) {
            //console.log("NEW NAME UNDEFd");
            this.state.tempMinConfidence = this.props.minConf;
        }
        console.log("LECTUREID: "+this.props.lectureId);
        console.log("edited lecName: "+this.state.tempLectureName);
        console.log("edited lecDesc: "+this.state.tempLectureDesc);
        console.log("edited lecSection: "+this.state.tempLectureSection);
        console.log("edited lecVidLink: "+this.state.tempLectureVideoLink);

        await fetch("http://localhost:9000/lecture/editLecture", {
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                lecture_id: this.props.lectureId,
                name: this.state.tempLectureName,
                description: this.state.tempLectureDesc,
                video_link: this.state.tempLectureVideoLink,
                section: this.state.tempLectureSection,
                minConf: this.state.tempMinConfidence
            })
        }).then(res => res.json()).then((data) => { 
            console.log(data);
            this.setState({response: data});
            window.location.replace('/ClassPage/'+this.props.className);
        }).catch(console.log)



    }
    async handleRemoveLecture(lectureId) {
        console.log("levture_id: "+lectureId);
        console.log("removing lecture");
        await fetch("http://localhost:9000/lecture/removeLecture", {
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                lecture_id: lectureId
            })
        }).then(res => res.json()).then((data) => { 
            console.log(data);
            this.setState({response: data});
            window.location.replace('/ClassPage/'+this.props.className);
        }).catch(console.log)
        
    } /* End handleAddLecture(...) */

    async handleGetStudentList(){
        console.log("HERE");
        await fetch('http://localhost:9000/requests?classId=' + this.props.classId ,{
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(response => response.json())
            .then(data => {
                this.setState({studentList: Object.keys(data.results), results: data.results})
                console.log(Object.keys(data.results)[0]);
            }); // here's how u set variables u want to use later
    }

    async handleGetAllConfidence() {
        console.log('Getting all confidence');
        console.log(this.props.lectureId);
        await fetch("http://localhost:9000/allconfidence?quizId=" + this.props.lectureId, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(res => res.json()).then((data) => {
            console.log('STUDENT CONF LIST: ');
            console.log(data);
            //console.log(data[0].record);
            //var tmp = JSON.stringify(data[0].record);
            // Object.keys(data.record)
            this.setState({studentConfList: data});
            // window.location.replace('/dashboard');
        }).catch(console.log("ok"))
    } /* End handleAddClass(...) */

    async handleUpdateHideFlag(){
        let tmpHide = this.props.hidden;
        if (tmpHide === 1) {
            tmpHide = 0;
        }
        else {
            tmpHide = 1;
        }
        await fetch("http://localhost:9000/lecture/updateHideFlag", {
            method: 'POST',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                lectureId: this.props.lectureId,
                hideFlag: tmpHide
            })
        }).then(res => res.json()).then((data) => { 
            console.log(data);
            this.setState({response: data});
            window.location.replace('/ClassPage/'+this.props.className);
        }).catch(console.log)
    }

    async handleGetConfidence() {
        console.log("Getting confidence-----------------------------");
        console.log(this.props.studentId);
        console.log(this.props.lectureId);
        await fetch("http://localhost:9000/confidence?quizId=" + this.props.lectureId + "&id=" + this.props.studentId, {
            method: 'GET',
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        }).then(res => res.json()).then((data) => { 
            
            if(data.length != 0){
                console.log("data",data);
                this.setState({individualConfList: data})
                
            }// window.location.replace('/dashboard');
        }).catch(console.log("not working here"))
    } /* End handleAddClass(...) */

};