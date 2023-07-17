import './LoginSignUp.css'
import validator from "validator";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingActions } from "../store/slices/loading-slice";
import { BlurActions } from "../store/slices/blur_slice";
import { ErrorModalActions } from "../store/slices/errorModal_slice";
import { LogoutClickActions } from "../store/slices/logoutClick_slice";
import useStateReset from "../hooks/useStateReset";

function LoginSignUp() {
    const { stateReset } = useStateReset()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isEmailBlur, setIsEmailBlur] = useState(false)
    const [isPasswordBlur, setIsPasswordBlur] = useState(false)
    const isLogin = useSelector(state => state.Login.isLogin)
    const isBlur = useSelector(state => state.Blur.isBlur)
    const isLoading = useSelector(state => state.Loading.isLoading)
    const isLogoutClick = useSelector(state => state.LogoutClick.isLogoutClick)
    const authToken = localStorage.getItem('task_auth_token')

    useEffect(() => {
        setEmail('')
        setPassword('')
        setIsEmailBlur(false)
        setIsPasswordBlur(false)
    }, [isLogin])

    useEffect(() => {
        if (isLogoutClick) {
            stateReset()
        }
    }, [isLogoutClick])

    useEffect(() => {
        if (authToken) {
            navigate('/', { replace: true })
        }
    }, [stateReset])

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
                    dispatch(LoadingActions.setLoading(true))
                    dispatch(BlurActions.setBlur(true))
                    const response = await fetch(`http://localhost:3001/user/${isLogin ? 'login' : 'signup'}`, {
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
                        dispatch(LoadingActions.setLoading(false))
                        dispatch(ErrorModalActions.setErrorModal({
                            isErrorModal: true,
                            message: 'User with this email already exists. Please use another email.'
                        }))
                    } else if (data.status && data.status === 'not_found') {
                        console.log('not_found')
                        dispatch(LoadingActions.setLoading(false))
                        dispatch(ErrorModalActions.setErrorModal({
                            isErrorModal: true,
                            message: 'User credentials are incorrect. Please try again.'
                        }))
                    } else if (data.status && data.status === 'ok') {
                        localStorage.setItem('task_auth_token', data.authToken)
                        navigate('/', { replace: true })
                        dispatch(BlurActions.setBlur(false))
                        dispatch(LogoutClickActions.setLogoutClick(false))
                    }
                } catch (error) {
                    dispatch(LoadingActions.setLoading(false))
                    dispatch(ErrorModalActions.setErrorModal({
                        isErrorModal: true,
                        message: 'Some error occured.'
                    }))
                    dispatch(BlurActions.setBlur(true))
                }
        }
    }

    return (
        <React.Fragment>
            <div className={`loginSignUp_container ${isBlur ? 'blur' : null}`}>
                <form onSubmit={formSubmit}>
                    <label htmlFor='email'>Email</label>
                    <input className="email_input" type='text' name='email' value={email} onChange={(e) => {
                        setIsEmailBlur(false)
                        setEmail(e.target.value)
                    }} onBlur={() => setIsEmailBlur(true)} autoComplete="on" />
                    {isEmailBlur && !validator.isEmail(email) && <p className="error_input">Enter valid email.</p>}
                    <label htmlFor='password'>Password</label>
                    <input className="password_input" type='text' name='password' value={password} onChange={(e) => {
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