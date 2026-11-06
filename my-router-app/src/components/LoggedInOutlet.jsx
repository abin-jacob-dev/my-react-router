import React from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { getRolesForPath, isLoggedIn, isPathAllowed } from '../utils/Common'


function LoggedInOutlet() {
    const { pathname } = useLocation()
    console.log(pathname);
    const isAllowed = isPathAllowed(pathname)

    if (isLoggedIn() && isAllowed) {
        return (
            <Outlet />
        )
    } else {
        return <Navigate to='/login' />
    }
}

export default LoggedInOutlet