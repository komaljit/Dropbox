import React, {Component} from 'react';
import * as API from '../api/API';
import '../Login.css';
import PropTypes from 'prop-types';
import dropbox from "./dropboxplus.gif";
import {connect} from 'react-redux';
import {Row,Col,ListGroupItem} from 'react-bootstrap';
import {afterlogin} from "../actions/index";
import { Route, withRouter } from 'react-router-dom';
import Header from "./Header";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";


class UserLog extends Component {

    componentWillMount(){
        const data=localStorage.getItem("email")
        API.getState(data)
            .then((res) => {
                console.log(res)
                if (res.status == 201) {
                    this.props.afterlogin(res.userdetails);
                    console.log("Success...")

                }else if (res.status == 401) {
                    this.setState({

                        message: "Folder error"
                    });
                }
            });
    }

    render() {
        console.log(this.props.userdata.userLog)
        return (
            <div>
                <Header/>
            <div className="jumbotron">
                <div className="container-fluid row justify-content-md-center">

                    <div className="account-wall col-md-10">
                        <div className="col-md-12">

                            <h2>User Log</h2>

                            <ReactTable
                                data={this.props.userdata.userLog}
                                columns={[
                                    {
                                        Header: "File Name",
                                        columns: [
                                            {
                                                accessor: "filename"
                                            }
                                        ]
                                    },

                                    {
                                        Header: "File Path",
                                        columns: [
                                            {
                                                accessor: "filepath"
                                            }
                                        ]
                                    },

                                    {
                                        Header: "File Type",
                                        columns: [
                                            {
                                                accessor: "isfile"
                                            }
                                        ]
                                    },

                                    {
                                        Header: "Activity",
                                        columns: [
                                            {
                                                accessor: "action"
                                            }
                                        ]
                                    },

                                    {
                                        Header: "Activity Time",
                                        columns: [
                                            {
                                                accessor: "actiontime"
                                            }
                                        ]
                                    }

                                ]}
                                defaultPageSize={5}
                                className="-striped -highlight"
                            />


                    </div>
                        <br/>
                        <button className="btn btn-primary" type="submit"
                                onClick={() => this.props.history.push("/files")}>
                            Back
                        </button>
                    </div>

                </div>
            </div>
            </div>
        );
    }
}


function mapStateToProps(userdata) {
    console.log(userdata);
    return {userdata};
}

function mapDispatchToProps(dispatch) {
    return {
        // updateUser : (data) => dispatch(updateUser(data)),
        afterlogin : (data) => dispatch(afterlogin(data))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserLog));