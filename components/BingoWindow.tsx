import { useState } from 'react'
import reactLogo from './assets/react.svg'
// import './App.css'
// import 'board-style.module.css'

function BingoWindow(title:string, completed:boolean) {

  return (
    <p className='card-item'>
     {title}
    </p>
  )
}

export default BingoWindow
