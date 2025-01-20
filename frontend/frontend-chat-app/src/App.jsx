import React,{useEffect} from "react";
import socket from "./socket.js";

function App() {
  useEffect(()=>
  {
    socket.on("",(message)=>
    {
      console.log(message);
    })
  },[])
  return (
    <>
    <h1>Hello {message}!</h1>
    </>
  )
}

export default App
