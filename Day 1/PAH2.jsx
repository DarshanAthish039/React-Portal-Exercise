import React from 'react';
import './App.css';

 const PAH2 = () => {
  let name="Darshan"
  let age=18
  let setStatus=false
  let userDefault=undefined
  let resopnseValue=null
  const display=()=>{
    console.log(name)
    console.log(age)
    console.log(setStatus)
    console.log(userDefault)
    console.log(resopnseValue)
    dis()
  }
  const dis = () => {
    alert("Check the Console Output!")
    name="Darshan";
    console.log(name)
    age=18;
    console.log(age)
  }
  return (
    <div>
      <button onClick={display}>Check</button>
    </div>
  )
 }
export default PAH2;
