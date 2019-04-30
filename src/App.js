import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import classes from './App.module.css';

import Login from './containers/Login/Login';
import Signup from './containers/Signup/Signup';
import Home from './containers/Home/Home';

// actions
import * as actions from './store/actions/index';

class App extends Component {
    componentDidMount() {
      this.props.onTryAutoSignIn();
    }

    render() {
        let routes = null;
        if (!this.props.isAuthenticated) {
            routes = (
                <Switch>
                    <Route path='/login' component={Login} />
                    <Route path='/signup' component={Signup} />
                    <Redirect to='/login' />
                </Switch>
            );
        } else {
            routes = (
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Redirect to='/' />
                </Switch>
            );
        }

        return <div className={`container-small ${classes.App}`}>{routes}</div>;
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: !!state.auth.token
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignIn: () => dispatch(actions.authCheckState()),
        logout: () => dispatch(actions.logout())
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App)
);
