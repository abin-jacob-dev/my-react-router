import React from 'react'
import { NavLink, Outlet } from "react-router-dom";
import "./Header.css"
import LoggedInOutlet from "../components/LoggedInOutlet"
import { clearUserInfo } from "../utils/Common";
import PrivateLink from './link/PrivateLink';

function Header() {
    return (
        <>
            <header className='header'>
                <nav className='nav'>
                    <PrivateLink to='/'>Home</PrivateLink>
                    <PrivateLink to='users'>Users</PrivateLink>
                    <PrivateLink to='usage'>Usage</PrivateLink>
                    <PrivateLink to='settings'>Settings</PrivateLink>
                    <span className='nav-spacer' />
                    <PrivateLink to='login' className='nav-logout' onClick={() => clearUserInfo()}>Logout</PrivateLink>
                </nav>
            </header>
            <main className='main'>
                <LoggedInOutlet />
            </main>
        </>
    )
}

export default Header