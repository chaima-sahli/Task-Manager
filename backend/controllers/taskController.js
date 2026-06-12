const Task = require('../models/Task');

//! Get all tasks for authenticated user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ status: 1, position: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//! Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, status } = req.body;
    
    // Get the highest position for the selected status
    const lastTask = await Task.findOne({ 
      userId: req.userId, 
      status: status || 'todo' 
    }).sort({ position: -1 });
    
    const newPosition = lastTask ? lastTask.position + 1 : 0;
    
    const task = new Task({
      title,
      description,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      status: status || 'todo',
      position: newPosition,
      userId: req.userId
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//! Update a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const task = await Task.findOne({ _id: id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // If status is changing, we might need to handle positioning
    if (updates.status && updates.status !== task.status) {
      // Get the highest position for the new status
      const lastTask = await Task.findOne({ 
        userId: req.userId, 
        status: updates.status 
      }).sort({ position: -1 });
      
      updates.position = lastTask ? lastTask.position + 1 : 0;
    }
    
    Object.assign(task, updates);
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//! Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Reorder remaining tasks in the same status
    const remainingTasks = await Task.find({ 
      userId: req.userId, 
      status: task.status 
    }).sort({ position: 1 });
    
    for (let i = 0; i < remainingTasks.length; i++) {
      remainingTasks[i].position = i;
      await remainingTasks[i].save();
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//! Update task position (for drag and drop)
const updateTaskPosition = async (req, res) => {
  try {
    const { tasks } = req.body; // Array of { id, status, position }
    
    for (const taskUpdate of tasks) {
      await Task.findOneAndUpdate(
        { _id: taskUpdate.id, userId: req.userId },
        { status: taskUpdate.status, position: taskUpdate.position }
      );
    }
    
    res.json({ message: 'Positions updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskPosition
};