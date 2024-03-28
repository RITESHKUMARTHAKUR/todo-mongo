import React, { useState } from 'react'


const Create = () => {
  const [task,setTask] = useState();

  const localHost = "http://localhost:5000/add";


  

  const handleClick = async (e) => {
    e.preventDefault();
    const taskData = {task}

    try {
      await fetch(localHost, {
        method : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
    } catch (error) {
      console.log(error);
    }  
  };

  return (
    <div>
      <div className='flex gap-4'>
      <input className='border-2 border-black' onChange={(e) => setTask(e.target.value) } type="text" name="" id="" />
      <button className='b' onClick={handleClick} >Add</button>
      </div>
    </div>
  )
}

export default Create;