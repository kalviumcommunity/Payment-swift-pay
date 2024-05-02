import React from 'react'
import { Link } from 'react-router-dom'

function Main() {
  return (
    <div><Link to='/Business'><button>Business</button></Link>
    <Link to='/Exchange'>Convert</Link>
    <Link to='/Coin'>coin</Link>
    <Link to='/Blog'>Blog</Link>
    
    </div>
    
  )
}

export default Main