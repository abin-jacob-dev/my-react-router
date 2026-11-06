import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from "../api/users";
import './Login.css'

function Login() {
    const [username, setUsername] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const handleOnClick = () => {
        setError('')
        login(username)
            .then(() => navigate('/'))
            .catch(() => setError('Login Failed'))
    }
    return (
        <div className='login'>
            <div className='login-card'>
                <div className='login-title'>Login</div>
                {error && <div className='login-error'>{error}</div>}
                <div className='login-field'>
                    <span className='login-label'>Username</span>
                    <input
                        className='login-input'
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <input
                    className='login-button'
                    type="button"
                    value="Submit"
                    onClick={handleOnClick}
                />
            </div>
        </div>
    )
}

export default Login