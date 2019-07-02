import React, { createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null
};

if(localStorage.getItem('jwtToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));

  if(decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
  } else {
    initialState.user = decodedToken;
  }
}

const authContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {}
});

function authReducer(state, action) {
  switch(action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}

function AuthContextProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    localStorage.setItem("jwtToken", userData.token);
    dispatch({
      action: 'LOGIN',
      payload: userData
    });
  }

  function logout() {
    localStorage.removeItem("jwtToken");
    dispatch({
      action: 'LOGOUT'
    });
  }

  return (
    <AuthContext.Provider 
      value={{ user: state.user, login, logout }}
      {...props}
    />
  )
}

export { AuthContext, AuthProvider }