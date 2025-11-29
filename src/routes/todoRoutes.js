import express from 'express';
import db from '../config/db.js';

const router = express.Router();


router.get('/', (req, res) => {
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?');
    const todos = getTodos.all(req.userId);
    res.json(todos);
});

router.post('/', (req, res) => {
    const { task } = req.body;
    const insertTodo = db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)');
    const result = insertTodo.run(req.userId, task);
    res.json({ id: result.lastInsertRowid, task, completed: 0 });
});


router.put('/:id', (req, res) => {
    const { completed } = req.body;
    const { id } = req.params;
    const userId = req.userId;

    const updatedTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?');
    const result = updatedTodo.run(completed, id, userId);

    if (result.changes === 0) return res.status(404).json({ message: "Todo not found or not yours" });

    res.json({ message: "Todo updated" });
});


router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    const deleteTodo = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
    const result = deleteTodo.run(id, userId);

    if (result.changes === 0) return res.status(404).json({ message: "Todo not found or not yours" });

    res.json({ message: "Todo deleted" });
});

export default router;
