import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';

class SignUp extends Component {
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

    cancelSignUp = () => {
        this.props.history.push('/login');
    };

    onSignUpSubmit = evt => {
        evt.preventDefault();
        if (this.state.email && this.state.password) {
            this.props.onStartSignUp(this.state.email, this.state.password);
        }
    };

    render() {
        if(this.props.signUpToken && this.props.signUpUserId) {
            return <Redirect to='/login' />
        }

        let signUpErr = null;
        if (this.props.signUpError) {
            signUpErr = (
                <div className='alert alert-danger'>
                    <p>
                        {this.props.signUpError.message
                            ? this.props.signUpError.message
                            : 'Unexpected error, please try again.'}
                    </p>
                </div>
            );
        }

        return (
            <>
                <form onSubmit={this.onSignUpSubmit}>
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
                    {signUpErr}

                    <button type='submit' className='button-success' disabled={this.props.isSigningUp}>
                        Sign Up
                    </button>
                    <button
                        type='button'
                        className='button-danger'
                        onClick={this.cancelSignUp}
                    >
                        Cancel
                    </button>
                </form>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        isSigningUp: state.signup.loading,
        signUpError: state.signup.error,
        signUpToken: state.signup.token,
        signUpUserId: state.signup.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onStartSignUp: (email, password) =>
            dispatch(actions.signUpStart(email, password))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUp);
