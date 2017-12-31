import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import '../Login.css';
import dropboxtitle from "./Dropbox_Log.png";


class Header extends Component {

    logout=() => {

        API.logout()
            .then((status) => {

                if (status == 201) {

                    console.log("logout success")
                    localStorage.setItem("email", "");
                    this.props.history.push("/")
                }else if (status == 401) {


                        console.log("logout issue")

                }
            });

    }
    render() {
        return (
            <div>
                <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <img className="" src={dropboxtitle}
                                 alt="" height="50" onClick={() => this.props.history.push("/files")}/>
                        </div>
                        <ul className="nav navbar-nav">
                            <div className="row">

                                <li className="active">Welcome <a href="#" onClick={() => this.props.history.push("/userdetails")}>
                                     {localStorage.getItem("email").split('@')[0]}</a>,</li>
                                <div className="col-md-1" ></div>
                                <li className="active"><a href="#" onClick={() => this.props.history.push("/files")}>
                                    Home</a></li>

                                <div className="col-md-1" ></div>
                                <li className="active"><a href="#" onClick={() => this.logout()}>
                                Logout</a></li>
                            </div>
                        </ul>
                    </div>
                </nav>
            </div>

        );

    }
}

export default withRouter(Header);