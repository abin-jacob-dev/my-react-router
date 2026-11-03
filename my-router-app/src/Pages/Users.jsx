import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Users.css'
import { Link } from 'react-router-dom'

function Users() {
  const [data, setData] = useState([])

  useEffect(() => {
    axios('data.json').then((response) => {
      setData(response.data)
    })
  }, [])

  return (
    <div className='users-page'>
      {data.map((item) => (
        <div key={item.id} className='user-card'>
          <Link to={`/details/${item.id}`} className='user-name'>{item.name}</Link>
          <div className='user-address'>{item.address}</div>
        </div>
      ))}
    </div>
  )
}

export default Users