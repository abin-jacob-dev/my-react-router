import React from 'react'
import { NavLink, useResolvedPath } from 'react-router-dom'
import { isPathAllowed } from '../../utils/Common'

function PrivateLink(props) {

    const to = props.to
    const path = useResolvedPath(to)
    console.log(path.pathname);

    const pathAllowed = isPathAllowed(path.pathname)

    return (
        pathAllowed && <NavLink {...props} />
    )
}

export default PrivateLink