const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskPosition,
  exportCSV,
  exportTasks,
  importTasks
} = require('../controllers/taskController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/position', updateTaskPosition); 
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

router.get('/export', exportTasks);
router.get('/export/csv', exportCSV);

router.post('/import', importTasks);


module.exports = router;