import './LoginSignUp.css'
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BlurActions } from "../store/slices/blur_slice";
import { LogoutClickActions } from "../store/slices/logoutClick_slice";
import { ErrorActions } from '../store/slices/error-slice';
import useStateReset from "../hooks/useStateReset";

function LoginSignUp() {
    const { stateReset } = useStateReset()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isEmailBlur, setIsEmailBlur] = useState(false)
    const [isPasswordBlur, setIsPasswordBlur] = useState(false)
    const isLogin = useSelector(state => state.Login.isLogin)
    const isLogoutClick = useSelector(state => state.LogoutClick.isLogoutClick)
    const authToken = localStorage.getItem('task_auth_token')

    useEffect(() => {
        setEmail('')
        setPassword('')
        setIsEmailBlur(false)
        setIsPasswordBlur(false)
        setErrorMessage(null)
    }, [isLogin])

    useEffect(() => {
        if (isLogoutClick) {
            stateReset()
        }
    }, [isLogoutClick, stateReset])

    useEffect(() => {
        if (authToken) {
            navigate('/', { replace: true })
        }
    }, [navigate, authToken])

    const formSubmit = async (e) => {
        e.preventDefault()
        if (password.length < 6 || password.length > 10) {
            setIsPasswordBlur(true)
        }
        if (email === '') {
            setIsEmailBlur(true)
        }
        if (validator.isEmail(email) && password.length >= 6 && password.length <= 10) {
            try {
                dispatch(ErrorActions.setError(false))
                dispatch(BlurActions.setBlur(true))
                const response = await fetch(`https://taskmanagar-backend.onrender.com/user/${isLogin ? 'login' : 'signup'}`, {
                    method: 'POST',
                    body: JSON.stringify({ email, password }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (!response.ok) {
                    throw new Error('Some error occured')
                }
                const data = await response.json()
                if (data.status && data.status === 'duplicate') {
                    setErrorMessage('User with this email already exists')
                } else if (data.status && data.status === 'not_found') {
                    setErrorMessage('Please enter valid credentials')
                } else if (data.status && data.status === 'ok') {
                    localStorage.setItem('task_auth_token', data.authToken)
                    navigate('/', { replace: true })
                    dispatch(BlurActions.setBlur(false))
                    dispatch(LogoutClickActions.setLogoutClick(false))
                } 
            } catch (error) {
                dispatch(ErrorActions.setError(true))
                navigate('/error', { replace: true })
                dispatch(BlurActions.setBlur(true))
            }
        }
    }

    return (
        <React.Fragment>
            <div className='loginSignUp_container'>
                {errorMessage && <h4>{errorMessage}</h4>}
                <form onSubmit={formSubmit}>
                    <label htmlFor='email'>Email</label>
                    <input className="email_input" type='text' name='email' value={email} onChange={(e) => {
                        setErrorMessage(null)
                        setIsEmailBlur(false)
                        setEmail(e.target.value)
                    }} onBlur={() => setIsEmailBlur(true)} autoComplete="on" />
                    {isEmailBlur && !validator.isEmail(email) && <p className="error_input">Enter valid email.</p>}
                    <label htmlFor='password'>Password</label>
                    <input className="password_input" type='text' name='password' value={password} onChange={(e) => {
                        setErrorMessage(null)
                        setIsPasswordBlur(false)
                        setPassword(e.target.value)
                    }} onBlur={() => setIsPasswordBlur(true)} autoComplete="off" />
                    {isPasswordBlur && (password.length < 6 || password.length > 10) && <p className="error_input" >Password should be of 6-10 digits </p>}
                    <div className="loginSignUpButton">
                        <button>{isLogin ? 'Login' : 'Sign Up'}</button>
                    </div>
                </form>
            </div>
        </React.Fragment>
    )
}

export default LoginSignUp