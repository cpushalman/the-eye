import { useState } from 'react'

import './App.css'

import './components/HomePage'
import Events from './components/events'
import HomePage from './components/HomePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   <HomePage></HomePage>
 <Events></Events>
    </>
  )
}

export default App
