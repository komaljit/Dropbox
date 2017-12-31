import React, {Component} from 'react';
import * as API from '../api/API';
import '../Login.css';
import PropTypes from 'prop-types';
import dropbox from "./dropboxplus.gif";
import {connect} from 'react-redux';
import {Row,Col,ListGroupItem} from 'react-bootstrap';
import {afterlogin} from "../actions/index";
import {updateUser  } from "../actions/index";
import { Route, withRouter } from 'react-router-dom';
import Header from "./Header";

class UserDetails extends Component {

    componentWillMount(){
        const data=localStorage.getItem("email")
        API.getState(data)
            .then((res) => {
                console.log(res)
                if (res.status == 201) {
                    this.props.afterlogin(res.userdetails);
                    console.log("Success...")

                }else if (res.status == 401) {

                }
            });
    }


    updateUser=(data) => {
        console.log(data)
        data.email=this.props.userdata.email;
        API.updateUser(data)
            .then((status) => {

                if (status == 201) {

                    this.props.updateUser(data);
                    this.setState({
                        editClicked:false,
                        message: "User details update successfully!"
                    });


                }else if (status == 401) {
                    this.setState({
                        editClicked:false,
                        message: "Error in updating user details!"
                    });

                }
            });

    }

    state={firstname:'', lastname:'', email:this.props.userdata.email, contactno:'', interests:'', editClicked:false}

    render() {

        return (
            <div>
                <Header/>
            <div className="jumbotron">

            <div className="container-fluid row justify-content-md-center">

                <div className="account-wall col-md-7">
                    <div className="col-md-12">

                        <h2>User Details</h2>

                        <table className="table table-user-information ">
                            <tbody >
                            <tr>
                                <td>First Name:</td>

                                <td>
                                    {
                                    this.state.editClicked == false ? this.props.userdata.firstName :
                                        <input type="text" className="form-control" placeholder="First Name" required
                                               autoFocus
                                               onChange={(event) => {
                                                   this.setState({
                                                       firstname: event.target.value
                                                   });
                                               }}/>
                                } </td>

                            </tr>


                                <tr>
                                    <td>Last Name:</td>
                                    <td>
                                        {
                                            this.state.editClicked == false ? this.props.userdata.lastName :
                                                <input type="text" className="form-control" placeholder="Last Name" required
                                                       autoFocus
                                                       onChange={(event) => {
                                                           this.setState({
                                                               lastname: event.target.value
                                                           });
                                                       }}/>
                                        } </td>
                                </tr>
                                <tr>
                                    <td>Email:</td>
                                    <td>
                                        {this.props.userdata.email} </td>
                                </tr>
                                <tr>
                                    <td>Contact Number:</td>
                                    <td>
                                        {
                                            this.state.editClicked == false ? this.props.userdata.contactNo :
                                                <input type="tel" className="form-control" placeholder="Contact Number" required
                                                       autoFocus
                                                       onChange={(event) => {
                                                           this.setState({
                                                               contactno: event.target.value
                                                           });
                                                       }}/>
                                        } </td>
                                </tr>
                            <tr>
                                <td>Interests:</td>
                                <td>
                                    {
                                        this.state.editClicked == false ? this.props.userdata.interests :
                                            <textarea type="text" className="form-control" placeholder="Interests" required
                                                      onChange={(event) => {
                                                            this.setState({
                                                                interests: event.target.value
                                                            });
                                            }}/>
                                    } </td>

                            </tr>

                            </tbody>
                        </table>

                        <br/>

                        <div className="row justify-content-md-center">

                            <div className="col-md-5">
                                {this.state.editClicked == true ?

                                    <button className="btn btn-primary" type="submit"
                                            onClick={() => this.updateUser(this.state)}>
                                        Save
                                    </button> :
                                    <button className="btn btn-primary" type="submit"
                                            onClick={() => this.setState({
                                                editClicked: true
                                            })}>
                                        Edit
                                    </button>
                                }
                            </div>
                            <div className="col-md-5">
                                <button className="btn btn-primary" type="submit"
                                        onClick={() => this.props.history.push("/files")}>
                                    Back
                                </button>
                            </div>
                        </div>

                    </div>

                </div>



            </div>

            </div>
            </div>
        );
    }
}


function mapStateToProps(userdata) {
console.log(userdata)
    return {userdata};
}

function mapDispatchToProps(dispatch) {
    return {
        updateUser : (data) => dispatch(updateUser(data)),
        afterlogin : (data) => dispatch(afterlogin(data))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserDetails));