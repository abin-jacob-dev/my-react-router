import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Users.css'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

function Users() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()

  const cls = searchParams.get('class')
  console.log(cls);


  useEffect(() => {
    axios('data.json').then((response) => {
      setData(response.data)
    })
  }, [])
  const handleSelectChange = (e) => {
    setSearchParams({
      class: e.target.value
    })
  }

  return (
    <div className='users-page'>
      <div>
        <div>
          Select Class
        </div>
        <div>

          <select onChange={handleSelectChange}>
            <option value="">Select</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>

        </div>
      </div>
      {data.filter((item) => {
        if (!cls) {
          return true
        }
        return cls === item.class
      }).map((item) => (
        <div key={item.id} className='user-card' onClick={() => navigate(`/details/${item.id}`, {
          state: {
            data: item
          }
        })}>
          <div className='user-name'>{item.name}</div>
          <div className='user-address'>{item.address}</div>
          <div className='user-address'>Class : {item.class}</div>
        </div>
      ))}
    </div>
  )
}

export default Users