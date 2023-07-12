import React from "react";
import { Link, NavLink } from "react-router-dom";
import './Navbar.css'
import { useDispatch, useSelector } from "react-redux";
import { LoginActions } from "../store/slices/login-slice";
const Navbar = () => {
    const dispatch=useDispatch()
    const isLogin = useSelector(state => state.Login.isLogin)
    return (
        <React.Fragment>
            <nav className="nav-container">
                <div className="heading">
                    <Link to="/" >Tasks</Link>
                </div>
                <div className="nav-elements">
                    <ul>
                        {!isLogin ? <li >
                            <NavLink to="/login" onClick={()=>dispatch(LoginActions.setLogin(true))}>Login</NavLink>
                        </li> : <li>
                            <NavLink to="/signUp" onClick={()=>dispatch(LoginActions.setLogin(false))}>Sign up</NavLink>
                        </li>}
                    </ul>
                </div>
            </nav>
        </React.Fragment>
    )
}

export default Navbar