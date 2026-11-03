import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import './Details.css'

function Details() {
  const location = useLocation()
  const state = location.state || {};
  const navigate = useNavigate()
  const { userId } = useParams()
  const [user, setUser] = useState(state.data)

  useEffect(() => {
    if (!user) {
      axios('/data.json').then((response) => {
        const item = response.data.find((userItem) => userItem.id === parseInt(userId))
        setUser(item)
      })

    }
  }, [userId, user])

  if (!user) {
    return null;
  }
  return (
    <div className='details-card'>
      <div className='details-name'>{user.name}</div>
      <div className='details-row'>Address : {user.address}</div>
      <div className='details-row'>Phone : {user.phone}</div>
      <div className='details-row'>Class : {user.class}</div>
      <button onClick={() => {
        navigate("/users")
      }} >Back</button>
    </div>
  )
}

export default Details