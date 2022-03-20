import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Loadable from "react-loadable";
import { Spin } from "antd";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route
            path="/home"
            component={Loadable({
              loader: () => import("./pages/home"),
              loading: () => <Spin spinning />
            })}
          />
          <Route
            path="/profile"
            exact
            component={Loadable({
              loader: () => import("./pages/profile"),
              loading: () => <Spin spinning />
            })}
          />
          <Route
            path="/profile/drop-history"
            component={Loadable({
              loader: () => import("./pages/profile/drop-history"),
              loading: () => <Spin spinning />
            })}
          />
          <Redirect from={"/profile/*"} to={"/profile"} />
          <Redirect from={"/*"} to={"/home"} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
