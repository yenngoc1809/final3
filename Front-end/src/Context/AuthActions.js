// AuthActions.js
import { LOGIN_START, LOGIN_SUCCESS, LOGIN_FAILURE } from './actionTypes';

// Đăng nhập
export const LoginStart = (userCredentials) => ({
    type: LOGIN_START,
    payload: userCredentials
});

export const LoginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    payload: user
});

export const LoginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error
});

// Đăng ký
export const RegisterStart = () => ({
    type: "REGISTER_START"
});

export const RegisterSuccess = (user) => ({
    type: "REGISTER_SUCCESS",
    payload: user
});

export const RegisterFailure = (error) => ({
    type: "REGISTER_FAILURE",
    payload: error
});
