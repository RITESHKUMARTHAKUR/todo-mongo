const express = require('express');
const cors = require('cors');
const env = require('dotenv').config();
const mongoose = require('mongoose');

// const mongoURL=process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(express.json())

const runMongo = async () => {
    await mongoose
      .connect(process.env.MONGODB_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useCreateIndex: true,
    });
};



const PORT = process.env.PORT || 5000;

runMongo();


const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now,
        require: true
    },
    status: {
        type: Boolean,
    }
})

const user = mongoose.model("tasks", taskSchema)

app.listen(PORT, () => {
    console.log(`Server started : ${PORT} `)
})

app.get("/", (req,res) => {
    res.send(`Hello, PORT:${PORT}`);
})

app.get("/getTasks", async(req,res) => {
    const allTasks = await user.find();
    if(allTasks){
        res.status(200).json(allTasks);
    }
    else{
        res.status(400).json("No data!!")
    }
});
app.post("/add", async (req,res) => {
    const { task,desc } = req.body;
    const { date } = taskSchema;
    try {
        const newTask = await user({ task,desc,date,status: 0 });
        await newTask.save();
        res.status(200).json("Task added!");
    } catch (error) {
        res.status(400).send(error);
    };
});
app.put("/updateTask",async (req,res) => {
    const {task,desc,taskId} = req.body;
    const { date } = taskSchema;

    try {
        await user.findByIdAndUpdate(taskId,{
            task,desc,date
        },{new: true}).then(response => res.status(200).send(response));

    } catch (error) {
        res.status(400).send(error);
    }
});
app.delete("/deleteTask", async (req,res) => {
    try {
        const { id } = req.body;
       
        const deletedTask = await user.deleteOne({_id:id});
        if(deletedTask){
            res.status(200).json({message:"Task Deleted!"});
        }
        else{
            res.status(400).json({message:"Unable to delete Task!"});
        }

    } catch (error) {
        res.status(500).send(error);
    }
})


