import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import BingoCard  from '../components/BingoCard'
// import '../style/board-style.css'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <BingoCard />
    </div>
  )
}

export default Home
