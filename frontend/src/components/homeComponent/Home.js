import { useEffect, useState } from "react";
import { RiCheckDoubleFill } from "react-icons/ri";
import { RxCrossCircled } from "react-icons/rx";
import {toast,ToastContainer} from 'react-toastify'
import Cross from "../../assets/images/cancel.png";
import redCross from "../../assets/images/redtick.png";
import greenCross from "../../assets/images/greencross.png";

const Home = () => {
  const [values, setValues] = useState([]);
  const [tick, setTick] = useState(false);
  const [task, setTask] = useState('');
  const [desc, setDesc] = useState('');
  const [showBtn, setShowBtn] = useState(true);
  const [error, setError] = useState(false);
  const [taskId,setTaskId] = useState(0);

  const getTasksUrl = `${process.env.REACT_APP_API_BASE_URL}/getTasks`;
  const addUrl = `${process.env.REACT_APP_API_BASE_URL}/add`;
  const updateTaskUrl = `${process.env.REACT_APP_API_BASE_URL}/updateTask`;
  const deleteTaskUrl = `${process.env.REACT_APP_API_BASE_URL}/deleteTask`;


  const fetchTasks = async () => {
    try {
      await fetch(getTasksUrl)
      .then(response => response.json() )
      .then(data => {
        setValues(data);
      });
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = async () => {
    const taskData = {task, desc};
    const addTdata = await fetch(addUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    const addData = await addTdata.json();
    if (addTdata.status === 200 ) {
      setTask("");
      setDesc("");
      toast.success(addData, {
        autoClose: 2000
      });
      fetchTasks();
    }
    else {
      alert("Some error occured!!!")
    };
  };

  const handleDelete = async (id) => {
    try {
      const deleteReq =  await fetch(deleteTaskUrl,{
        method: "DELETE",
        headers : {
          "Content-type" : "application/json"
        },
        body: JSON.stringify({id})
      });
      const data = await deleteReq.json();
     
      if(deleteReq.status === 200 ){
        toast.success(data.message, {
          autoClose: 2000
        });
        fetchTasks();
      }
      // setValues(values.filter((todo) => todo._id !== id));
    } catch (error) {
      alert(error);
    }
    
  }

  const handleClick = (task,desc,tId) => {

    setShowBtn(!showBtn);
    setTaskId(tId);
    setTask(task);
    setDesc(desc);

    if(showBtn === false) {
      setTask("");
      setDesc("");
    }
    // console.log(name + " " + desc + " " + taskId );
  }

  const handleUpdate = async () => {
    if (!task || !desc || !taskId ) {
      alert("Some error occured!")
      return;
    }else{
      const updateData = {task,desc,taskId};
      const updateReq =  await fetch(updateTaskUrl,{
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(updateData)
      });

      if (updateReq.status === 200) {
        setTask("");
        setDesc("");
        setShowBtn(!showBtn);
        fetchTasks();
      }else{
        alert(`${updateReq.status} Error occured!`);
      }  
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
    <div className="pt-6 bg-[#fbecd5] h-screen overflow-auto">
      <div className="rounded-sm text-center text-2xl">
        <h3 className="py-2 font-semibold font-poppins bg-[#ffe1bf]">
          ToDo App
        </h3>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col pt-8 w-3/4 justify-between  md:flex-row gap-2">
          <input
            value={task}
            onChange={(event) => setTask(event.target.value)}
            type="text"
            className="caret-orange-400 font-medium font-poppins w-full rounded-[0.3em] h-8 pl-4 ease-in duration-75 transition-all focus:outline outline-2 outline-[#ffad4f]"
            placeholder="Enter title"
          />
          <input
            value={desc}
            onChange={(event) => setDesc(event.target.value)}
            type="text"
            className="caret-orange-400 font-medium font-poppins w-full rounded-[0.3em] h-8 pl-4 ease-in duration-75 transition-all  focus:outline outline-2 outline-[#ffad4f]"
            placeholder="Enter Description"
          />
          {showBtn? <button
            onClick={handleSubmit}
            className="bg-[#7CFC00] font-semibold px-6 py-2 font-poppins rounded-[0.3em] ease-in duration-75 transition-all hover:outline outline-offset-3 outline-green-400 md:py-0"
          >
            Add
          </button> :
            <button
            onClick={handleUpdate}
            className="bg-[#7CFC00] font-semibold px-6 py-2 font-poppins rounded-[0.3em] ease-in duration-75 transition-all hover:outline outline-offset-3 outline-green-400 md:py-0"
          >
            Update
          </button>
          }
        </div>
        <div className="h-6">
          {error && (
            <p className="text-red-600 font-poppins">
              *something went wrong!!{" "}
            </p>
          )}
        </div>

        <div className="grid  w-3/4  md:flex-row gap-2 md:grid-cols-3">

          {/* Card Starts */}
            {values.map((tasks, index) => (
              <div key={index}  className="flex bg-orange-200 px-4 py-2 rounded-[7px] cursor-default">
                <div onClick={() => handleClick(`${tasks.task}`,`${tasks.desc}`, `${tasks._id}`) } className="flex flex-col border-r-2 border-gray-500 basis-[82%]">
                  <b>{tasks.task}</b>
                  <p className="text-gray-600 text-sm">{tasks.desc}</p>
                </div>
                <div className="flex grow items-center justify-evenly flex-col">
                  <div
                    className="bg-white  p-1 mb-1 rounded-sm"
                    onClick={() => setTick(!tick)}
                  >
                    {!tick ? (
                      <RiCheckDoubleFill className="text-lg text-gray-500" />
                    ) : (
                      <RiCheckDoubleFill className="text-lg text-green-500" />
                    )}
                  </div>
                  <button className="font-bold p-1 rounded-sm" onClick={() => handleDelete(`${tasks._id}`) }>
                    <img src={Cross} alt="" />
                  </button>
                </div>
              </div>
            ))}
          {/* Card Ends */}
        </div>
      </div>
    </div>
    </>
  );
}

export default Home;
