
import { useState, useEffect } from 'react'
export async function getStaticProps() {
  let board = []
    let empty = []
    for (let i = 0; i < 4; i++) {
      let row = []
      for (let y = 0; y < 4; y++){
        row.push("")
        empty.push([i,y])
      }
      board.push(row)
    }
    for (let i = 0; i < 4; i++){
      let random_number = parseInt(Math.random() * empty.length)
      let x = empty[random_number][0]
      let y = empty[random_number][1]
      if (parseInt(Math.random() * 3) < 2){
        board[x][y] = 2
      }else{
        board[x][y] = 4
      }
      empty.splice(random_number, 1);
    }
  return {
    props: {
      board,
    },
  }
}

const Cell = ({ number }) => {
  return ( 
    <div className={`cell _${number}`}>
      <h1>{number}</h1>
    </div> 
  );
}
 

export default function Home(props) {
  const [board, setBoard] = useState(props.board)
  const [score, setScore] = useState(0)
  const [isWorking, setIsWorking] = useState(false)
  const [lost, setLost] = useState(false)

  useEffect(()=>{
    addListener()
  },[])
  
  const addListener = () => {
    window.addEventListener('keydown', (e) => {
      if (e.key === "ArrowRight"){
        document.getElementById("right").click()
      }
      if (e.key === "ArrowLeft"){
        document.getElementById("left").click()
      }
      if (e.key === "ArrowUp"){
        document.getElementById("up").click()
      }
      if (e.key === "ArrowDown"){
        document.getElementById("down").click()
      }
    })
  }
  const newGame = () => {
    if (isWorking){
      return
    }
    setIsWorking(true)
    let new_board = []
    let empty = []
    for (let i = 0; i < 4; i++) {
      let row = []
      for (let y = 0; y < 4; y++){
        row.push("")
        empty.push([i,y])
      }
      new_board.push(row)
    }
    for (let i = 0; i < 4; i++){
      let random_number = parseInt(Math.random() * empty.length)
      let x = empty[random_number][0]
      let y = empty[random_number][1]
      if (parseInt(Math.random() * 3) < 2){
        new_board[x][y] = 2
      }else{
        new_board[x][y] = 4
      }
      empty.splice(random_number, 1);
    }
    setBoard(new_board)
    setScore(0)
    setLost(false)
    setIsWorking(false)

  }
  const checkLoss = async (new_board) => {
    let check = new_board

    check = await turnBoardRight(check)
    check = await turnBoardRight(check)
    check = await pushTogether(check)
    check = await turnBoardRight(check)
    check= await turnBoardRight(check)

    if (JSON.stringify(check) != JSON.stringify(new_board)){
      return false
    } 

    check = await pushTogether(check)

    if (JSON.stringify(check) != JSON.stringify(new_board)){
      return false
    } 

    check = await turnBoardRight(check)
    check = await pushTogether(check)
    check = await turnBoardRight(check)
    check = await turnBoardRight(check)
    check = await turnBoardRight(check)

    if (JSON.stringify(check) != JSON.stringify(new_board)){
      return false
    } 

    check = await turnBoardRight(check)
    check = await pushTogether(check)
    check = await turnBoardRight(check)
    check = await turnBoardRight(check)
    check = await turnBoardRight(check)

    if (JSON.stringify(check) != JSON.stringify(new_board)){
      return false
    } 

    return true
  }

  const getNewNumber = async (new_board) => {
    if (lost){
      return
    }
    let empty = []
    for (let i = 0; i < new_board.length; i++) {
      for (let y = 0; y < new_board.length; y++){
        if (new_board[i][y] === ""){
          empty.push([i,y])
        }
      }
    }
    if (empty.length === 0){
      return new_board
    }
    let random_number = parseInt(Math.random() * empty.length)
    let x = empty[random_number][0]
    let y = empty[random_number][1]
    if (parseInt(Math.random() * 3) < 2){
      new_board[x][y] = 2
    }else{
      new_board[x][y] = 4
    }

    if (empty.length === 1){
      if (await checkLoss(new_board)){
        console.log("lost")
        setLost(true)
      }
    }

    return new_board
  }

  const pushTogether = (lst) => {
    if (lost){
      return
    }
    let new_board = []
    for (let i = 0; i < lst.length; i++){
      let row = []
      for (let y = 0; y < lst[i].length; y++){
        if (lst[i][y] != ""){
          row.push(lst[i][y])
        }
      }
      let new_row = []
      while (row.length > 1){
        if (row[0] === row[1]){
          let new_number = row.shift()
          new_row.push(new_number*2)
          setScore(score+2*new_number)
          row.shift()
        }else{
          new_row.push(row.shift())
        }

      }
      if (row.length === 1){
        new_row.push(row[0])
      }
      for (let x = new_row.length; x < lst.length; x++){
        new_row.push("")
      }
      new_board.push(new_row)
    }
    return new_board
  }
  const left = async () => {
    if (lost || isWorking){
      return
    }
    setIsWorking(true)
    let new_board = [...board]
    new_board = await pushTogether(new_board)
    if (JSON.stringify(new_board) != JSON.stringify(board)){
      new_board = await getNewNumber(new_board)
    }
    setBoard(new_board)
    setIsWorking(false)
  }

  const right = async () => {
    if (lost|| isWorking){
      return
    }
    setIsWorking(true)
    let new_board = [...board]
    new_board = await turnBoardRight(new_board)
    new_board = await turnBoardRight(new_board)
    new_board = await pushTogether(new_board)
    new_board = await turnBoardRight(new_board)
    new_board = await turnBoardRight(new_board)
    if (JSON.stringify(new_board) != JSON.stringify(board)){
      new_board = await getNewNumber(new_board)
    }
    setBoard(new_board)
    setIsWorking(false)
  }

  const up = async () => {
    if (lost|| isWorking){
      return
    }
    setIsWorking(true)
    let new_board = [...board]
    new_board = await turnBoardRight(new_board)
    new_board = await turnBoardRight(new_board)
    new_board = await turnBoardRight(new_board)
    new_board = await pushTogether(new_board)
    new_board = await turnBoardRight(new_board)
    if (JSON.stringify(new_board) != JSON.stringify(board)){
      new_board = await getNewNumber(new_board)
    }
    setBoard(new_board)
    setIsWorking(false)
  }

  const down = async () => {
    if (lost|| isWorking){
      return
    }
    setIsWorking(true)
    let new_board = [...board]
    new_board = await turnBoardRight(new_board)
    new_board = await pushTogether(new_board)
    new_board = await turnBoardRight(new_board)
    new_board = await turnBoardRight(new_board)
    new_board = await turnBoardRight(new_board)
    if (JSON.stringify(new_board) != JSON.stringify(board)){
      new_board = await getNewNumber(new_board)
    }
    setBoard(new_board)
    setIsWorking(false)
  }

  const turnBoardRight = (lst) => {
    if (lost){
      return
    }
    let new_board = []
    for (let i = 0; i < lst[0].length; i++){
      let row = []
      for (let y = lst.length-1; y >= 0; y--){
        row.push(lst[y][i])
      }
      new_board.push(row)
    }
    return new_board
  }
  return (
        <>
        <button id={"up"} className={"hidden-button"} onClick={() => up()}></button>
        <button id={"down"} className={"hidden-button"} onClick={() => down()}></button>
        <button id={"left"} className={"hidden-button"} onClick={() => left()}></button>
        <button id={"right"} className={"hidden-button"} onClick={() => right()}></button>
        <h1>Score: {score}</h1>
        <button onClick={() => newGame()}>New Game</button>
        <div className="grid">
          {board.map((row, i) => row.map((e, y) => <Cell number={e} key={i+"/"+y}/>))}
        </div>
        {lost && <h1>You have Lost</h1>}
        </>
  )
}
