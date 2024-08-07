import React from 'react';
import './App.css';

 const CE2 = () => {
  let myObject={name:"Madras"}

  myObject.name="Chennai"
  let array=["a","e","i","o"]
  
  array.push("u");
  const display=()=>{
    alert("Check the Console Output!")
    console.log(myObject.name)
    console.log(array)
  }
  return (
    <div>
      <button onClick={display}>Check</button>
    </div>
  )
 }
export default CE2;
