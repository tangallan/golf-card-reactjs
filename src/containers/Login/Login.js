import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actionTypes from '../../store/actions/index';

class Login extends Component {
    state = {
        email: '',
        password: ''
    };

    onEmailChange = evt => {
        this.setState({
            email: evt.target.value
        });
    };

    onPasswordChange = evt => {
        this.setState({
            password: evt.target.value
        });
    };

    onLogin = evt => {
        evt.preventDefault();
        if(this.state.email && this.state.password) {
            this.props.login(this.state.email, this.state.password);
        }
    };

    goToSignUp = () => {
        this.props.history.push('/signup');
    };

    render() {
        let authError = null;
        if(this.props.authError) {
            authError = <div className='alert alert-danger'>
                <p>{this.props.authError.message ? this.props.authError.message : 'Unexpected error, please try again.'}</p>
            </div>
        }

        return (
            <>
                <form onSubmit={this.onLogin}>
                    <div className='form-control'>
                        <label>Email</label>
                        <input
                            type='text'
                            placeholder='Enter email'
                            value={this.state.email}
                            onChange={this.onEmailChange}
                        />
                    </div>
                    <div className='form-control'>
                        <label>Password</label>
                        <input
                            type='password'
                            placeholder='Enter password'
                            value={this.state.password}
                            onChange={this.onPasswordChange}
                        />
                    </div>
                    {authError}
                    
                    <button type='submit' className='button-success'
                        disabled={this.props.isLoggingIn}
                        >
                        Login
                    </button>

                    <button type='button' className='button-warning' 
                        onClick={this.goToSignUp}
                        >
                        Signup
                    </button>
                </form>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        email: state.auth.email,
        password: state.auth.password,
        isLoggingIn: state.auth.loading,
        authError: state.auth.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        login: (email, password) => dispatch(actionTypes.authStart(email, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
