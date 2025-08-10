import { useState } from 'react'

import './App.css'
import IntroLogo from './components/introsvg'
import './components/HomePage'
import Events from './components/events'
import HomePage from './components/HomePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <IntroLogo></IntroLogo>
   <HomePage></HomePage>
 <Events></Events>
    </>
  )
}

export default App
