import express from 'express';
const userRoutes = express.Router();
// controllers
import { loginUser, signUpUser } from '../controllers/userControllers.js';
// login
userRoutes.post('/login', loginUser);
// signup
userRoutes.post('/signup', signUpUser);
export { userRoutes };
//# sourceMappingURL=user.js.map