import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import '../Login.css';
import FileUpload from "./FileUpload";
import Container from "./Container";
import UserDetails from "./UserDetails";
import UserLog from "./UserLog";
import dropbox from "./dropbox-img.png";
import dropboxtitle from "./Dropbox_Log.png";


class NewerHomePage extends Component {

    render() {
        return (
            <div>
                <Route exact path="/" render={() => (
                    <div className="jumbotron">
                       <div className="row justify-content-md-center">
                            <div className="col-md-6">

                                <img className="" src={dropboxtitle}
                                     alt="" height="70"/>

                                <br/><br/><br/>

                                <img className="" src={dropbox}
                                     alt="" />
                            </div>
                            <div className="col-md-4">
                                <Container/>
                            </div>
                       </div>
                    </div>
                )}/>

                <Route exact path="/files"
                       render={() => (
                           localStorage.getItem("email") ?
                            <FileUpload/> :
                           <Container />
                )}/>

                <Route exact path="/userdetails" render={() => (
                    localStorage.getItem("email") ?
                        <UserDetails/> :
                        <Container />
                )}/>

                <Route exact path="/userlog" render={() => (
                    localStorage.getItem("email") ?
                        <UserLog/> :
                        <Container />
                )}/>
            </div>
        );
    }
}

export default withRouter(NewerHomePage);