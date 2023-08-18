const fs = require('fs')
const express = require('express');
const app = express()
const mongoose = require('mongoose');
const ejs = require('ejs')
app.use(express.static('public'));
app.set('view engine','ejs')
mongoose.connect('mongodb+srv://wayne86davenport:ikNnOEEmnWaVSNg5@cluster0.i33hhyp.mongodb.net/Dashboard?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('Failed to connect to MongoDB Atlas', err);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const taskSchema = new mongoose.Schema({
    task: {
      type: String,
      required: true
    }
  });
  
  const Task = mongoose.model('Task', taskSchema);

  app.get('/', async (req, res) => {
    // Get all tasks from the database
    const tasks = await Task.find({});
 
    // Send them to the view
    res.render('dash', { tasks });
});

app.post('/add-item', (req, res) => {
    const task = req.body.task;
  
    if (!task) {
      return res.status(400).send('Task is required');
    }
  
    // Create new task document
    const newTask = new Task({ task });
  
    // Save the task to MongoDB
    newTask.save()
      .then(() => {
        console.log('New task saved to MongoDB');
        res.send('Task added');
      })
      .catch((err) => {
        console.error('Failed to save new task to MongoDB', err);
        res.status(500).send('Failed to add task');
      });
  });

app.post('/remove-item', (req, res) => {
    const task = req.body.task;
  
    if (!task) {
      return res.status(400).send('Task is required');
    }
  
    // Delete the task from MongoDB
    Task.deleteOne({ task: task })
      .then(() => {
        console.log('Task removed from MongoDB');
        res.send('Task removed');
      })
      .catch((err) => {
        console.error('Failed to remove task from MongoDB', err);
        res.status(500).send('Failed to remove task');
      });
  });




const port = 2244
app.listen(port, () => {
    console.log(`App runnin up in port ${port} yo!...`);
});