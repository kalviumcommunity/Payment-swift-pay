import React from 'react'
import { Link } from 'react-router-dom'

function Main() {
  return (
    <div><Link to='/News'><button>News</button></Link>
    <Link to='/Exchange'>Convert</Link>
    <Link to='/Landing'>coinlanding</Link>
    <Link to='/FinancialLanding'>blog</Link>
    <Link to='/To'>Todo</Link>
    <Link to='/Blanding'>Budget</Link>
    
    </div>
    
  )
}

export default Main