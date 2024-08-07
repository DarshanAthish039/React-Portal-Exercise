import React from 'react';
import './App.css';

const App = () => {
  const name1="Darshan";
  const name2="Darshan";
  const obj1={name:"Darshan"}
  const obj2={name:"Darshan"}
  if(name1===name2)
  {
    alert(true);
  }else{
    alert(false);
  }
  if(obj1.name === obj2.name)
  {
    alert(true);
  }else{
    alert(false);
  }
}
 const CY1 = () =>{
  return(
    <div>
      <button onClick={CY1}>Click</button>
      {/*<p>This is World Functional Component</p>*/}
    </div>
  )
 }

export default CY1;
