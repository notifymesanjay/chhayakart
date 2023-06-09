import React from 'react'
import { useNavigate } from 'react-router-dom'
import Not_Found from '../../utils/zero-state-screens/404.svg'
import './notfound.css'
import { motion } from 'framer-motion'


const NotFound = () => {
  const navigate = useNavigate()
  return (
    <section id='not-found' className='not-found'>
      <div className='container'>
        <div className='not-found-container'>

          <img src={Not_Found} alt='not-found'></img>
          <p >Page Not Found!!</p>
          <button whileTap={{ scale: 0.8 }} type='button' onClick={() => {
            navigate('/')
          }}>Go to Home</button>
        </div>
      </div>
    </section>
  )
}

export default NotFound
