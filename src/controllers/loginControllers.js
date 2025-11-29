import db from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 

export const loginControllers = async (req, res) => {
    const { username, password } = req.body

    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
        const user = getUser.get(username);

        if (!user) { return res.status(404).send({ message: "User not found" }) }

        const passwordIsValid = bcrypt.compareSync(password, user.password)

        if (!passwordIsValid) { return res.status(401).send({ message: "Invalid password" }) }
        console.log(user)


        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.json({ token })

    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service Unavailable" });
    }

}


export const registerControllers = async (req, res) => {
     const { username, password } = req.body
    // encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8)

    // save the new user and hashed password to the db
    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`)
        const result = insertUser.run(username, hashedPassword)

        // now that we have a user, I want to add their first todo for them
        const defaultTodo = `Hello :) Add your first todo!`
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        // create a token
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service Unavailable" });
    }

}
    