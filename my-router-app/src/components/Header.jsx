import React from 'react'
import { NavLink, Outlet } from "react-router-dom";
import "./Header.css"


function Header() {
    return (
        <>
            <header className='header'>
                <nav className='nav'>
                    <NavLink to='/'>Home</NavLink>
                    <NavLink to='users'>Users</NavLink>
                    <NavLink to='usage'>Usage</NavLink>
                    <NavLink to='settings'>Settings</NavLink>
                </nav>
            </header>
            <main className='main'>
                <Outlet />
            </main>
        </>
    )
}

export default Header