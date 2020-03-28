import { combineReducers } from "redux";
import websiteDataReducer from "./websiteDataReducer";

export const rootReducer = combineReducers({
  website: websiteDataReducer
});
