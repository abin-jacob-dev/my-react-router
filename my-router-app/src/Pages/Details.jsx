import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate, useParams, Outlet } from 'react-router-dom'
import axios from 'axios'
import './Details.css'
import PrivateLink from '../components/link/PrivateLink'


function Details() {
  const location = useLocation()

  console.log(location.pathname)
  // const location = useLocation()
  const state = location.state || {};
  const navigate = useNavigate()
  const { userId } = useParams()
  const [user, setUser] = useState(state.data)

  useEffect(() => {
    if (!user) {
      axios('/my-react-router/data.json').then((response) => {
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

      <div className='details-nav'>
        <PrivateLink
          to=''
          end
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Marks
        </PrivateLink>
        <PrivateLink
          to="sports"

          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Sports
        </PrivateLink>
        <PrivateLink
          to="remarks"

          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Remarks
        </PrivateLink>
      </div>

      <div>
        <Outlet context={user} />
      </div>

      <button onClick={() => {
        navigate("..")
      }} >Back</button>
    </div>
  )
}

export default Details