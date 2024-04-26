const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;
app.use(express.json());
app.use(cors());
app.get('/',(req,res)=>{
    res.send("Hello World");
})

// Storing a todo item 
// const todos =[];
// creating a database 
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todocart').then(()=>{
    console.log('DB is connected')
}).catch((err)=>{
    console.log(err);
})
const TodoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})
const Todomodel = mongoose.model('Todo',TodoSchema)

// creating a new todo item
app.post("/todos",async(req,res)=>{
    const {title,description} = req.body;
    // const newtodo ={
    //     id:todos.length+1,
    //     title,
    //     description
    // }
    // todos.push(newtodo)
    try{
        const newtodo = new Todomodel({title, description})
        await newtodo.save()
        res.status(201).json(newtodo)

    }
    catch(error){
       console.log(error);
       res.status(500).json({message:error.message})
    }
    

})

// Get all items 
app.get("/todos",async(req,res)=>{
   try {
      const todos = await Todomodel.find();
      res.json(todos)
   } catch (error) {
    console.log(error);
    res.status(500).json({message:error.message})
   }
})

// Updating the items
app.put('/todos/:id',async(req,res)=>{

    try {
         const {title,description} = req.body;
         const id = req.params.id
         const updatedtodo =await Todomodel.findByIdAndUpdate(
                 id,
                {title, description},
                {new : true}
            )
        if(!updatedtodo){
             return res.status(404).json({message :'Todo is not found'})
        }
        res.json(updatedtodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
   
})

// Deleting a item in a Todo
app.delete('/todos/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        await Todomodel.findByIdAndDelete(id)
        res.status(204).end()
    } catch (error) {
        console.log(error);
        res.status(500).json({message:message.error})
    }

     
})


app.listen(port,()=>{
    console.log(`Server is listening to the port ${port}`)
})