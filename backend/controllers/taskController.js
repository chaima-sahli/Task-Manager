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



//  Export tasks
const exportTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId })
      .select('-__v -userId') // Exclude internal fields
      .lean();

    // Format data for export
    const exportData = tasks.map(task => ({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : null,
      tags: task.tags || [],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }));

    res.json({
      success: true,
      count: exportData.length,
      data: exportData,
      exportedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export tasks' });
  }
};

//  Import tasks

const importTasks = async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid data. Please provide an array of tasks.' 
      });
    }

    let importedCount = 0;
    let skippedCount = 0;
    let duplicateCount = 0;
    const importedTasks = [];

    //  Get existing tasks to check for duplicates
    const existingTasks = await Task.find({ userId: req.userId });
    const existingTitles = new Set(existingTasks.map(t => t.title.trim().toLowerCase()));

    for (const taskData of tasks) {
      // Validate required fields
      if (!taskData.title) {
        skippedCount++;
        continue;
      }

      const title = taskData.title.trim();
      const titleLower = title.toLowerCase();

      //  Check for duplicate by title (case insensitive)
      if (existingTitles.has(titleLower)) {
        duplicateCount++;
        continue;
      }

      // Clean and prepare task data
      const newTask = new Task({
        title: title,
        description: taskData.description || '',
        status: ['todo', 'inprogress', 'done'].includes(taskData.status) 
          ? taskData.status 
          : 'todo',
        priority: ['low', 'medium', 'high'].includes(taskData.priority) 
          ? taskData.priority 
          : 'medium',
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
        tags: Array.isArray(taskData.tags) ? taskData.tags : [],
        userId: req.userId,
        position: 0
      });

      await newTask.save();
      importedCount++;
      importedTasks.push(newTask);
      existingTitles.add(titleLower); 
    }

    // Reorder all tasks by position
    const allTasks = await Task.find({ userId: req.userId }).sort({ createdAt: 1 });
    for (let i = 0; i < allTasks.length; i++) {
      allTasks[i].position = i;
      await allTasks[i].save();
    }

    // Build response message
    let message = `Imported ${importedCount} tasks successfully.`;
    if (skippedCount > 0) message += ` Skipped ${skippedCount} invalid tasks.`;
    if (duplicateCount > 0) message += ` Skipped ${duplicateCount} duplicates.`;

    res.status(201).json({
      success: true,
      message,
      imported: importedCount,
      skipped: skippedCount,
      duplicates: duplicateCount,
      tasks: importedTasks
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import tasks' });
  }
};

//  Export as CSV 

const exportCSV = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).lean();

    const headers = [
      'Task ID',
      'Title', 
      'Description', 
      'Status', 
      'Priority', 
      'Due Date', 
      'Tags',
      'Created At',
      'Last Updated'
    ];
    
    const rows = tasks.map(task => {
      //  Format tags properly - wrap in quotes if they contain commas
      let tags = (task.tags || []).join(', ');
      if (tags.includes(',')) {
        tags = `"${tags}"`; // Wrap in quotes to preserve commas
      }

      const dueDate = task.dueDate 
        ? new Date(task.dueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short', 
            day: 'numeric'
          })
        : 'No due date';
      
      const createdAt = new Date(task.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      const updatedAt = new Date(task.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      return [
        task._id.toString().slice(-8),
        `"${(task.title || '').replace(/"/g, '""')}"`,
        `"${(task.description || '').replace(/"/g, '""')}"`,
        task.status || 'todo',
        task.priority || 'medium',
        dueDate,
        tags, 
        createdAt,
        updatedAt
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=tasks-export-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvContent);
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
};


module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskPosition,
  exportTasks,
  importTasks,
  exportCSV
};