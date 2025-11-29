import express from 'express';
import db from '../config/db.js';
import { addTodos, deleteTodo, getTodos, updateTodo } from '../controllers/todoControllers.js';

const router = express.Router();


router.get('/', getTodos);

router.post('/', addTodos);

router.put('/:id',updateTodo );

router.delete('/:id', deleteTodo);

export default router;
