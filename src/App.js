import React, { Component } from 'react';
import classes from './App.module.css';
import Home from './containers/Home/Home';

class App extends Component {
  render() {
    return (
        <div className={`container-small ${classes.App}`}>
            <Home />
        </div>
    );
  }
}

export default App;
