import { useState } from 'react'

import './App.css'

import './components/HomePage'
import HomePage from './components/HomePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <HomePage></HomePage>
  
    </>
  )
}

export default App
