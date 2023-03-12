import { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import BingoCard  from '../components/BingoCard'
// import '../style/board-style.css'

const Home:NextPage = (props:any) => {
  // console.log(props.bingoLayout)

  return (
    <div className="container">
      <BingoCard 
        bingoData={props.bingoLayout}
      />
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch('http://localhost:3000/api/bingoData')
  const data = await res.json()
  console.log(data)
  return {
    props: {
      bingoLayout: data.response.data
    }
  }

}

