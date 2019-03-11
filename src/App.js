import React, { Component } from 'react';
import classes from './App.module.css';
import Game from './containers/Game/Game';

class App extends Component {
  render() {
    return (
        <div className={classes.App}>
            <Game />
        </div>
    );
  }
}

export default App;
