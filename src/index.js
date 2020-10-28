import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./reducers/rootReducer";
import { BrowserRouter as Router } from "react-router-dom";

//导入antd样式
// import 'antd/dist/antd.less';
// // import '../src/assets/antd.less'

// import 'antd/lib/style/themes/default.less';
//import 'antd/dist/antd.css';

import App from "./App";
import * as serviceWorker from "./serviceWorker";

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
