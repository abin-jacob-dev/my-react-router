import React from 'react'
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div>
            <div>Sorry Page not found</div>
            <div>
                <Link to="/">Home</Link>
            </div>
        </div>
    )
}

export default NotFound