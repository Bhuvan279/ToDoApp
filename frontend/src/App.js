import React, { useState } from 'react'
import axios from 'axios'
import './App.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {faCut} from '@fortawesome/free-solid-svg-icons'
import {faCheck} from '@fortawesome/free-solid-svg-icons'
import {faPencil} from '@fortawesome/free-solid-svg-icons'
import {faAdd} from '@fortawesome/free-solid-svg-icons'

function App() {


  
  const [callApi, setCallApi] = useState(true)

  const [mainList, setMainList] = React.useState([])
  const [activeList, setActiveList] = React.useState({
    id: 9,
    title: '',
    completed: false
  })
  const [editing, setEditing] = React.useState(false)




  // Getting the data
  const getData = async () => {
    let data = await axios.get('http://127.0.0.1:8000/api/task-list/')
      .then(response => {
        setMainList(initValue => {
          return (
            response.data
          )
        })
      })
   
  }


  React.useEffect(() => {
    getData()
  }, [callApi])

  
  
  

  // Updating the Data
  const handleUpdate = async (item) => {
    setActiveList({
      id: item.id,
      title: item.title,
      completed: item.completed
    })

    document.getElementById("itemTypeBox").value = item.title
    setEditing(true)

  }

  // Deleting the data
  function handleDelete(item) {
    
    
    axios.delete(`http://127.0.0.1:8000/api/task-delete/${item.id}/`).then(()=> setCallApi(init => !init) )
    
    
  }

  //Completed or not completed 
  function handleCheck(item){
    let task_done 
    if (item.completed === true){
      task_done = false
    }
    else{
      task_done=true
    }
    let data_put = axios.put(`http://127.0.0.1:8000/api/task-update/${item.id}/`, {
        id: item.id,
        title: item.title,
        completed: task_done
    }).then(()=> setCallApi(init => !init) )

  }
  
  

  //Rendering
  const AllItems = mainList.map((item) => {
    return (
      <>
        <div className='each-item'>
          <div className={item.completed ? 'item-title-done':'item-title'}>
            <div>{item.title}</div>
          </div>
          <div className='update-delete-btns'>
            <button onClick={() => { handleCheck(item) }} className="done-btn" >
            <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
            </button>
            <button onClick={() => { handleUpdate(item) }} className="update-btn">
            <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon>
            </button>
            <button onClick={() => { handleDelete(item) }} className="delete-btn">
            <FontAwesomeIcon icon={faCut}></FontAwesomeIcon>
            </button>
          </div>
        </div>
      </>
    )
  })

  function handleChange(e) {
    setActiveList(initValue => {
      return {
        ...initValue,
        title: e.target.value
      }
    })
    console.log(activeList)
  }

  function handleSubmit() {

    if (editing === true) {
      let data_put = axios.put(`http://127.0.0.1:8000/api/task-update/${activeList.id}/`, {
        id: activeList.id,
        title: activeList.title,
        completed: activeList.completed
      }).then(()=> setCallApi(init => !init))
      setEditing(false)
      document.getElementById('itemTypeBox').value = ""
    }

    else {
      const sendData = async () => {
        let new_data = await axios.post('http://127.0.0.1:8000/api/task-create/', activeList).then(()=> setCallApi(init => !init))
        document.getElementById('itemTypeBox').value = ''
        setActiveList(initValue => {
          return {
            ...initValue,
            title:null
          }
        })
        console.log(activeList)
      }
      sendData()
    }

  }

  

  return (
    <>
      <form>
        <div className='form-data'>
          <div className='logo'>
            ToDoApp
          </div>
          <div className='form-input'>
            <input onChange={handleChange} id="itemTypeBox" placeholder="Add Items" name='typedTask' type='text' />
            <button onClick={handleSubmit} id="submit-btn" type="button">
            <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon>
            </button>
          </div>
        </div>
      </form>
      {AllItems.length > 0 ? <div className="all-items">{AllItems}</div> : <div className="all-items">Add Items Above</div> }
      
    </>
  )
}


export default App