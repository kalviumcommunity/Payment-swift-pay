import React from 'react'
import { Link } from 'react-router-dom'

function Main() {
  return (
    <div><Link to='/Business'><button>Business</button></Link>
    <Link to='/chat'>chat</Link>
    
    </div>
    
  )
}

export default Main