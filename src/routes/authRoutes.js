import express from 'express'
import { loginControllers, registerControllers } from '../controllers/loginControllers.js'

const   router = express.Router()


router.post('/register', registerControllers)  
router.post('/login', loginControllers);




export default router;