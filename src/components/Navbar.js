import React from "react";
import { Link, NavLink } from "react-router-dom";
import './Navbar.css'
import { useDispatch, useSelector } from "react-redux";
import { LoginActions } from "../store/slices/login-slice";
import { useNavigate } from "react-router-dom";
import { BlurActions } from "../store/slices/blur_slice";
import { DeleteTasksActions } from "../store/slices/deleteTasks";
import { ErrorModalActions } from "../store/slices/errorModal_slice";
import { FiltersActions } from "../store/slices/filters-slice";
import { FiltersAppliedActions } from "../store/slices/filtersApplied-slice";
import { LoadingActions } from "../store/slices/loading-slice";
import { QueryActions } from "../store/slices/query_slice";
import { ResetCheckboxActions } from "../store/slices/resetCheckbox-slice";
import { TaskDataActions } from "../store/slices/taskData-slice";

const Navbar = () => {
    const navigate= useNavigate()
    const dispatch = useDispatch()
    const isLogin = useSelector(state => state.Login.isLogin)
    const authToken = localStorage.getItem('task_auth_token')
    
    const logout = async () => {
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
            if (data.status === 'logged_out') {
                localStorage.removeItem('task_auth_token')
                navigate('/login_signUp', { replace: true })
                dispatch(BlurActions.setBlur(false))
                dispatch(DeleteTasksActions.setDeleteTasks(false))
                dispatch(ErrorModalActions.setErrorModal({
                    isErrorModal: false,
                    message: ''
                }))
                dispatch(FiltersActions.setFilters({
                    sort: null,
                    year: null,
                    month: null,
                    date: null,
                    status: null
                }))
                dispatch(FiltersAppliedActions.setFiltersApplied(false))
                dispatch(LoadingActions.setLoading(false))
                dispatch(LoginActions.setLogin(true))
                dispatch(QueryActions.setQuery(''))
                dispatch(ResetCheckboxActions.setResetCheckbox(false))
                dispatch(TaskDataActions.setTaskData(false))
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <React.Fragment>
            <nav className="nav-container">
                <div className="heading">
                    <Link to="/" >Tasks</Link>
                </div>
                <div className="nav-elements">
                    <ul>
                        {!authToken && !isLogin && <li >
                            <NavLink to="/login" onClick={() => dispatch(LoginActions.setLogin(true))}>Login</NavLink>
                        </li>}
                        {!authToken && isLogin && <li>
                            <NavLink to="/signUp" onClick={() => dispatch(LoginActions.setLogin(false))}>Sign up</NavLink>
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