import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import {
  BrowserRouter,
  Route,
  // Redirect,
  Switch
} from "react-router-dom";
import reducers from "./reducer";
import Routers from './router';
import registerServiceWorker from "./registerServiceWorker";
import "./http";

import "./static/fronts/iconfont.css";
import "./static/css/main.css";

//从window对象中获取redux谷歌浏览器插件对象如果存在就使用
const reduxDevTools =
  (window.devToolsExtension && window.devToolsExtension()) || (f => f);
const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    reduxDevTools
  )
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routers />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
