import { GetServerSideProps, NextPage } from 'next'
import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import BingoCard  from '../components/BingoCard'
import { getBingoData } from './api/bingoData'
// import '../style/board-style.css'

const Bingo:NextPage = (props:any) => {
  // console.log(props.bingoLayout)

  return (
    <div className="container">
      <BingoCard
        id={props.id}
        bingoData={props.bingoLayout}
      />
    </div>
  )
}

export default Bingo

export const getServerSideProps: GetServerSideProps = async (context) => {
  // console.log({context})
  const { id } = context.query;
  if (!id) return {props: {}};
  console.log(id)
  const res = await getBingoData(Number(id));
  // if (data !== undefined) 
  // console.log(res.data)
    return {
      props: {
        id: id,
        bingoLayout: res.data
      }
    }
}

