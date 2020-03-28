import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { rootReducer } from "./reducers";

const store = compose(
  applyMiddleware(thunk)
  //   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  //     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
)(createStore)(rootReducer);

export default store;
