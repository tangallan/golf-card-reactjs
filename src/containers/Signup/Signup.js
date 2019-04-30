import React, { Component } from 'react';

class SignUp extends Component {
    state = {
        email: '',
        password: ''
    };

    onEmailChange = evt => {
        // this.setState({
        //     email: evt.target.value
        // });
    };

    onPasswordChange = evt => {
        // this.setState({
        //     password: evt.target.value
        // });
    };

    render() {
        return (
            <>
                <form
                    // onSubmit={evt =>
                    //     this.props.onSignUp(
                    //         evt,
                    //         this.state.email,
                    //         this.state.password
                    //     )
                    // }
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
                        Sign Up
                    </button>
                    {/* onClick={this.props.onCancelSignup} */}
                    <button type='button' className='button-danger'>
                        Cancel
                    </button>
                </form>
            </>
        );
    }
}

export default SignUp;
