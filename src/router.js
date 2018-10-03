import React from "react";
import {
  BrowserRouter,
  Route,
  // Redirect,
  Switch
} from "react-router-dom";

import Login from "./container/login/login";
import Register from "./container/register/register";
import AuthRoute from "./components/authroute/authroute";
import BossInfo from "./container/bossinfo/bossinfo";
import GeniusInfo from "./container/geniusinfo/geniusinfo";
import Home from "./container/home/home";
import ChatDetails from "./container/chat-details/chat-details";

export default class Routers extends React.Component {
  render() {
    return (
      <div>
        <AuthRoute />
        {/* 登录验证组件 */}
        <Switch>
          <Route path="/geniusInfo" component={GeniusInfo} />
          <Route path="/bossinfo" component={BossInfo} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/chat/:id/:name" component={ChatDetails} />
          <Route component={Home} />
        </Switch>
      </div>
    );
  }
}
