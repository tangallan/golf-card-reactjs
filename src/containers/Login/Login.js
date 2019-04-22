import React, { Component } from 'react';

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

    render() {
        return (
            <>
                <form
                    onSubmit={evt =>
                        this.props.onLogin(
                            evt,
                            this.state.email,
                            this.state.password
                        )
                    }
                >
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

                    <button type='submit' className='button-success'>
                        Login
                    </button>

                    <button type='button' className='button-warning' onClick={this.props.onTrySignUp}>
                        Signup
                    </button>
                </form>
            </>
        );
    }
}

export default Login;
