import React, { useReducer } from 'react';
import contextReducer from './contextReducer';
import Context from './context';
import axios from 'axios';
import Cookies from 'js-cookie';

import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAIL,
  GET_COURSES_REQUEST,
  GET_COURSES_SUCCESS,
  GET_COURSES_FAIL,
  GET_COURSE_DETAIL_REQUEST,
  GET_COURSE_DETAIL_SUCCESS,
  GET_COURSE_DETAIL_FAIL,
  USER_LOGOUT,
} from '../context/types';

const ContextState = (props) => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(contextReducer, initialState);

  // User Signup
  const userSignup = async (user) => {
    dispatch({
      type: CREATE_USER_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const { data } = axios.post('/api/users', user, config);

      dispatch({
        type: CREATE_USER_SUCCESS,
        payload: data,
      });

      Cookies.set('user', JSON.stringify(data), { expires: 1 });
    } catch (error) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

  // User Login
  const userLogin = async (username, password) => {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const encodedCredentials = btoa(`${username}:${password}`);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${encodedCredentials}`,
      },
    };

    try {
      const { data } = await axios.get('/api/users', config);

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });

      // Set Cookie here with user information
      Cookies.set('user', JSON.stringify(data), { expires: 1 });
    } catch (error) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

  // Logout
  const userLogout = () => {
    dispatch({
      type: USER_LOGOUT,
    });
  };

  return (
    <Context.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        userLogin,
        userSignup,
        userLogout,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default ContextState;
