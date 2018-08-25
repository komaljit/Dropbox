import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
//import * as API from '../api/API';
import '../Login.css';
import PropTypes from 'prop-types';


class SignUp extends Component {
    static propTypes = {
        signUp: PropTypes.func.isRequired
    };

    state = {
        firstName:'',
        lastName:'',
        username: '',
        password: '',
        email:'',
        contactNo:''
    };

    render() {
        return (
            <div>
                <h2> Create an account</h2>
                <input type="text" className="form-control" placeholder="First Name" required autoFocus
                       onChange={(event) => {
                           this.setState({
                               firstName: event.target.value
                           });
                       }}/>
                <br/>
                <input type="text" className="form-control" placeholder="Last Name" required
                       onChange={(event) => {
                           this.setState({
                               lastName: event.target.value
                           });
                       }}/>

                <br/>
                <input type="email" className="form-control" placeholder="Email" required autoFocus
                       onChange={(event) => {
                           this.setState({
                               email: event.target.value
                           });
                       }}/>
                <br/>
                <input type="password" className="form-control" placeholder="Password" required
                       onChange={(event) => {
                           this.setState({
                               password: event.target.value
                           });
                       }}/>

                <br/>
                <button className="btn btn-primary btn-block" type="submit"
                        onClick={() => this.props.signUp(this.state)}>
                    Save
                </button>
                    <a href="#" className="text-center new-account" onClick={() => this.props.loginOrSignup("SI")}>Log In </a>
            </div>
        );
    }
}


export default SignUp;