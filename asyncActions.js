const redux = require("redux");
const reduxLogger = require("redux-logger");

const reduxThunk = require("redux-thunk").default;

const axios = require("axios");

const createStore = redux.createStore;
const applyMiddleware = redux.applyMiddleware;
const logger = reduxLogger.createLogger();

var initialState = {
  loading: false,
  users: [],
  error: "",
};

const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";

// Actions

const fetchUserRequest = () => {
  return {
    type: FETCH_USERS_REQUEST,
  };
};

const fetchUserSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users,
  };
};

const fetchUserFailure = (error) => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: error,
  };
};

// Reducers
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USERS_SUCCESS:
      return {
        loading: false,
        users: state.payload,
        error: "",
      };
    case FETCH_USERS_REQUEST:
      return {
        loading: false,
        users: [],
        error: state.payload,
      };
    default:
      return state;
  }
};

const fetchUsers = () => {
  return function (dispatch) {
    dispatch(fetchUserRequest());
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        // res.data
        const users = res.data.map((user) => user.id);
        dispatch(fetchUserSuccess(users));
      })
      .catch((err) => {
        //err.message
        const error = err.message;
        dispatch(fetchUserFailure(error));
      });
  };
};

// Store
var store = createStore(reducer, applyMiddleware(logger, reduxThunk));
store.subscribe(() => {});
store.dispatch(fetchUsers());
