import React from "react";
import { Link, NavLink } from "react-router-dom";
import './Navbar.css'
import { useDispatch, useSelector } from "react-redux";
import { LoginActions } from "../store/slices/login-slice";
import { useNavigate } from "react-router-dom";
import { BlurActions } from "../store/slices/blur_slice";
import { ErrorModalActions } from "../store/slices/errorModal_slice";
import { FiltersAppliedActions } from "../store/slices/filtersApplied-slice";
import { LoadingActions } from "../store/slices/loading-slice";
import { QueryActions } from "../store/slices/query_slice";
import { LogoutClickActions } from "../store/slices/logoutClick_slice";
import { AddTaskActions } from "../store/slices/addTask-slice";
import useStateReset from "../hooks/useStateReset";

const Navbar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isLogin = useSelector(state => state.Login.isLogin)
    const authToken = localStorage.getItem('task_auth_token')

    const logout = async () => {
        dispatch(LoadingActions.setLoading(true))
        dispatch(LogoutClickActions.setLogoutClick(true))
        if (authToken) {
            const url = `http://localhost:3001/user/logout`
            try {
                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                })
                if (!response.ok) {
                    throw new Error('Some error occured')
                }
                const data = await response.json()
                if (data.status === 'logged_out' || data.status === 'session_expired') {
                    localStorage.removeItem('task_auth_token')
                    navigate('/login_signUp', { replace: true })

                } else {
                    throw new Error('Some error occured')
                }
            } catch (error) {
                dispatch(LoadingActions.setLoading(false))
                dispatch(ErrorModalActions.setErrorModal({
                    isErrorModal: true,
                    message: 'Some error occured.'
                }))
                dispatch(BlurActions.setBlur(true))
            }
        } else {
            navigate('/login_signUp', { replace: true })
        }

    }

    const tasksClick = () => {
        dispatch(FiltersAppliedActions.setFiltersApplied(false))
        dispatch(AddTaskActions.setAddTask(false))
        dispatch(QueryActions.setQuery(''))
    }
    
    return (
        <React.Fragment>
            <nav className="nav-container">
                <div className="heading">
                    <Link to={authToken ? '/' : '/login_signUp'} onClick={authToken ? tasksClick : null}>Tasks</Link>
                </div>
                <div className="nav-elements">
                    <ul>
                        {!authToken && !isLogin && <li >
                            <NavLink to="/login_signUp" onClick={() => dispatch(LoginActions.setLogin(true))}>Login</NavLink>
                        </li>}
                        {!authToken && isLogin && <li>
                            <NavLink to="/login_signUp" onClick={() => dispatch(LoginActions.setLogin(false))}>Sign up</NavLink>
                        </li>}
                        {authToken && <li>
                            <NavLink onClick={logout}>Logout</NavLink>
                        </li>}
                    </ul>
                </div>
            </nav>
        </React.Fragment>
    )
}

export default Navbar