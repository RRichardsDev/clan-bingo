import React, { ChangeEventHandler, ReactComponentElement, ReactElement, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import BingoWindow from './BingoWindow';
import styles from 'BingoCard.module.css'
import { GetServerSideProps } from 'next';

export type BWindow = {
  title: string
  completed: boolean
}

function BingoCard({id, bingoData}: {id:number, bingoData: BWindow[][]}) {
  // console.log(props.bingoLayout)
  const [ teamId, setTeamId ] = useState(id);
  const [selectedImage, setSelectedImage] = useState('https://cdn.vox-cdn.com/thumbor/IMFfzD-KQoJaVcrU8mWBqBa3gTo=/0x0:1698x934/1200x800/filters:focal(714x332:984x602)/cdn.vox-cdn.com/uploads/chorus_image/image/66166929/NeedleSkips.0.png');
  const [editMode, setEditMode] = useState(false);
  const [boardSize, setBoardSize] = useState({x:5, y:5});
  const [bingoLayout, setBingoLayout] = useState(Array.from({length: boardSize.x},
    () => Array.from({length: boardSize.y}, () => {return {title:'-', completed:false}})));
  const getBingoData = async (id:number) => {
    console.log(id)
    const res = await( await fetch(`/api/bingoData?id=${id}`)).json()
    const tableData:BWindow[][] = await res.data;

    setBingoLayout(tableData);
  }
  useEffect(() => {
    setBingoLayout(bingoData)
  },[])

  //   fetch("/api/bingoData", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify([
  //     [
  //       {title: "Gobie Mask", completed: false}, {title: "Lederhosen Hat", completed: false}, {title: "Mudskipper Hat", completed: false}, {title: "Wicked Hood", completed: false}, {title: "Lord Marshals", completed: false}
  //     ],
  //     [
  //         {title: "Blue Runecrafter", completed: false}, {title: "Slayer Helm", completed: false}, {title: "Cyclopean Helm", completed: false}, {title: "Camel Mask", completed: false}, {title: "Mask of broken fingers", completed: false}
  //     ],
  //     [
  //       {title: "Pirate Hat", completed: false}, {title: "Robin Hood Hat", completed: false}, {title: "Red Headband", completed: false}, {title: "Helmet of Trials", completed: false}, {title: "Mask of Dragith Nurm", completed: false}
  //     ],
  //     [
  //       {title: "Fishbowl Helmet", completed: false}, {title: "Enchanted Hat", completed: false}, {title: "Powdered Wig", completed: false}, {title: "Witchdoctor Mask", completed: false}, {title: "Gorilla Mask", completed: false}
  //     ],
  //     [
  //       {title: "Mask of the troll", completed: false}, {title: "Black Boater", completed: false}, {title: "Tan Cavelier", completed: false}, {title: "Saradomin Mitre", completed: false}, {title: "Camo Helmet", completed: false}
  //     ]
  //   ] )
  // })

  const handleCompletedChange = (e:React.MouseEvent<HTMLButtonElement>, i:number, o:number) => {
    let copy = [...bingoLayout];
    copy[i][o].completed = !bingoLayout[i][o].completed;
    setBingoLayout(copy);
    updateTile();

  };
  const handleChangeEdit = () => {
    setEditMode(editMode => !editMode)
    if (editMode) updateTile();
  };
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>, direction:string) => {
    console.log(e.target.value)
    if(direction === 'x') setBoardSize( {x: parseInt(e.target.value), y: boardSize.y});
    if(direction === 'y') setBoardSize( {x:boardSize.x , y: parseInt(e.target.value)});
  }
  const handleItemChange = (e: React.ChangeEvent<HTMLTextAreaElement>, i:number, o:number) => {
    let copy = bingoLayout;
    copy[i][o] = {title: e.target.value, completed: bingoLayout[i][o].completed}
    setBingoLayout(copy);
    console.log(e.target.value)
  }
  const liveBoard = (
      bingoLayout.map((row, i) => {
        return <li className='card-row' key={i}>
          {row.map((item, o) => {
            return <button id={item.title} key={o}
            onClick={(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {handleCompletedChange(e, i, o)}} 
            className={item.completed?'card-item completed':'card-item'}>{item.title}</button>
          })}
          </li>
      })
  );
  const editBoard = (
    bingoLayout.map((row, i) => {
      return <li className='card-row' key={i}>
        {row.map((item, o) => {
          return <textarea  name={item.title} id={item.title} key={o}
          onChange={(e) => {handleItemChange(e, i, o)}} 
          className={item.completed?'card-item completed':'card-item'}>{item.title}</textarea>
        })}
        </li>
    })
  );
  const MAXNUMBER = 2
  const MINNUMBER = 1
  const updateTile = async () => {
    console.log(id);
    fetch(`/api/bingoData?id=${teamId}`, {method: 'PUT', body: JSON.stringify(bingoLayout)})
    .catch(err => console.log(err))
  };
  const nextTeam = (e:React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if(teamId === MAXNUMBER) {
      setTeamId(MINNUMBER)
      getBingoData(MINNUMBER)
      window.history.replaceState(null, "New Page Title", `/Bingo?id=${MINNUMBER}`)
    }else {
      setTeamId(tid => {return Number(tid)+1});
      getBingoData(Number(teamId)+1)
      window.history.replaceState(null, "New Page Title", `/Bingo?id=${Number(teamId)+1}`)

    }
  }
  const prevTeam = (e:React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if(teamId === MINNUMBER) {
      setTeamId(MAXNUMBER);
      getBingoData(MAXNUMBER)
      window.history.replaceState(null, "New Page Title", `/Bingo?id=${MAXNUMBER}`)
    } else {
      window.history.replaceState(null, "New Page Title", `/Bingo?id=${Number(teamId)-1}`)
      setTeamId(tid => {return Number(tid)-1});
      getBingoData(Number(teamId)-1)
    }
  }
  return (
    <>
    <div>
      <div className='team-switcher'>
        {/* <div className="team-modifier"><span className="icon">-</span></div> */}
        <a onClick={e=>prevTeam(e)}>&lt;</a>
        <h1>Team: {teamId}</h1>
        <a onClick={e=>nextTeam(e)}>&gt;</a>
        {/* <div className="team-modifier"><span className="icon">+</span></div> */}
      </div>
      <button onClick={handleChangeEdit}>Edit: {editMode?'ON':'OFF'}</button>
      {/* <button onClick={getBingoData} >GetData</button> */}
    </div>
    <div id="bingo-card" className="bingo-card">
      <ul>
        {editMode?editBoard:liveBoard}
      </ul>
    </div>
    </>
  )
}

export default BingoCard
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const res = await fetch('http://localhost:3000/api/bingoData')
//   const data = await res.json()
//   console.log(data)
//   return {
//     props: {
//       bingoLayout: data.response.data
//     }
//   }

// }


