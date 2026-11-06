import React from 'react'
import { NavLink, Outlet } from "react-router-dom";
import "./Header.css"
import LoggedInOutlet from "../components/LoggedInOutlet"
import { clearUserInfo } from "../utils/Common";

function Header() {
    return (
        <>
            <header className='header'>
                <nav className='nav'>
                    <NavLink to='/'>Home</NavLink>
                    <NavLink to='users'>Users</NavLink>
                    <NavLink to='usage'>Usage</NavLink>
                    <NavLink to='settings'>Settings</NavLink>
                    <span className='nav-spacer' />
                    <NavLink to='login' className='nav-logout' onClick={() => clearUserInfo()}>Logout</NavLink>
                </nav>
            </header>
            <main className='main'>
                <LoggedInOutlet />
            </main>
        </>
    )
}

export default Header