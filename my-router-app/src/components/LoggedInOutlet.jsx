import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { isLoggedIn } from '../utils/Common'


function LoggedInOutlet() {
    if (isLoggedIn()) {
        return (
            <Outlet />
        )
    } else {
        return <Navigate to='/login' />
    }
}

export default LoggedInOutlet