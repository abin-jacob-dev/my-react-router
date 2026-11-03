import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './Details.css'

function Details() {
  const { userId } = useParams()
  const [user, setUser] = useState([])

  useEffect(() => {
    axios('/data.json').then((response) => {
      const item = response.data.find((userItem) => userItem.id === parseInt(userId))
      setUser(item)
    })
  }, [userId])

  return (
    <div className='details-card'>
      <div className='details-name'>{user.name}</div>
      <div className='details-row'>Address : {user.address}</div>
      <div className='details-row'>Phone : {user.phone}</div>
      <div className='details-row'>Class : {user.class}</div>
    </div>
  )
}

export default Details