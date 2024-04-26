import React, { useEffect, useState } from 'react'

const Todo = () => {
  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("")
  const [todos,setTodos] = useState([])
  const [message,setMessage] = useState("");
  const [error,setError] = useState("");
  // For edit purpose
  const [editId,setEditId] = useState(-1);
  const [editTitle,setEditTitle] = useState("");
  const [editdescription,setEditDescription] = useState("")
  const apiUrl = "http://localhost:8000"
  function handleSubmit(){
    setError("")
    if(title.trim() !== "" && description.trim() !== ""){
        fetch(apiUrl+"/todos",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({title,description})
      }).then((res)=>{
         if(res.ok){
          setTodos([...todos,{title,description}]) 
          setTitle("");
          setDescription("");
          setMessage("Item added successfully") 
          setTimeout(()=>{
            setMessage("")
          },2000)
         }else{
          setError("Unable to create todo item")
         }
      }).catch(()=>{
          setError("Unable to create todo item")
         
      })
}
}
useEffect(()=>{
    getitems()
},[])

// For getting resources
const getitems =()=>{
  fetch(apiUrl+"/todos").then(res => res.json()).then((res) => setTodos(res))
}

// For editing and updating 
const handleEdit =(item)=>{
  setEditId(item._id);
  setEditTitle(item.title)
  setEditDescription(item.description)
}
const handleEditcancel =()=>{
  setEditId(-1);
}
const handleUpdate=()=>{
    setError("")
    if(editTitle.trim() !== "" && editdescription.trim() !== ""){
        fetch(apiUrl+"/todos/"+editId,
      {
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({title:editTitle,description:editdescription})
      }).then((res)=>{
         if(res.ok){
          const updatedtodos = todos.map((item)=>{
            if(item._id === editId){
              item.title = editTitle;
              item.description = editdescription;
            }
            return item;
          })
          setTodos(updatedtodos) 
          setEditTitle("");
          setEditDescription("");
          setMessage("Item updated Successfully") 
          setTimeout(()=>{
            setMessage("")
          },2000)
          setEditId(-1)
         }else{
          setError("Unable to create todo item");
         }
      }).catch(()=>{
          setError("Unable to create todo item")
         
      })
}
  
}
// For deleting 
const handleDelete =(id)=>{
  if(window.confirm("Are you sure want to delete?")){
    fetch(apiUrl+'/todos/'+id,{
      method:'DELETE'
    }).then(()=>{
      const updatedtodos = todos.filter((item) => item._id !== id);
      setTodos(updatedtodos)
    })
  }

}

  return (
   <>
   <div className='m-3 p-2 bg-warning text-light d-flex justify-content-center text-align-center'>
      <h1 className='fw-lighter'>Todo Chart</h1>
   </div>
   <div className='row'>
      <h3>Add Item</h3>
      {message && <p className='text-success' >{message}</p>}
      <div className='form-group d-flex gap-2'>
             <input placeholder='Title' className='form-control'  onChange={(e)=> setTitle(e.target.value)} value={title} type='text'/>
             <input placeholder='Description' className='form-control' onChange={(e)=> setDescription(e.target.value)} value={description} type='text'/>
             <button className='btn btn-dark' onClick={handleSubmit} >Submit</button>
      </div>
      {error && <p className='text-danger'>{error}</p>}
   </div>

   <div className='row mt-3'>
         <h3>Tasks</h3>
         <div className='col-md-6' >
         <ul className='list-group' >
           {
           todos.map((item)=>
           <li className='list-group-item bg-success d-flex justify-content-between align-items-center my-2'>
          <div className='d-flex flex-column me-1'>

            {
              editId === -1 || editId !== item._id ? <>
              <span className='text-light fw-bold'>{item.title}</span>
              <span className='text-light '>{item.description}</span>
              </> : <>
              <div className='form-group d-flex gap-2'>
                   <input placeholder='Title' className='form-control'  onChange={(e)=> setEditTitle(e.target.value)} value={editTitle} type='text'/>
                   <input placeholder='Description' className='form-control' onChange={(e)=> setEditDescription(e.target.value)} value={editdescription} type='text'/>
                </div>
              </>
            }
             
          </div>
          <div className='d-flex gap-2'>
            {
              editId === -1 || editId !== item._id ? <button className='btn btn-warning' onClick={()=>handleEdit(item)}>Edit</button> : <button className='btn btn-warning' onClick={handleUpdate} >Update</button>

            }
            {
              editId === -1 ? <button className='btn btn-danger' onClick={()=> handleDelete(item._id)} >Delete</button> : <button className='btn btn-danger' onClick={handleEditcancel} >Cancel</button>
            }
             
             
          </div>
         
        </li>

        )
        }
    </ul>

         </div>
   
   </div>
   </>
  )
}

export default Todo;