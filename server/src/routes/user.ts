import express from 'express';

const userRoutes = express.Router();

// middleware usato per proteggere le routes tramite autenticazione
// import { requireAuth } from '../middleware/requireAuth.js'

// controllers
import { loginUser, signUpUser } from '../controllers/userControllers.js';


// userRoutes.use(requireAuth);

userRoutes.use((req, res, next) => {
  console.log(`Request passed through /users router: ${req.method} ${req.url}`);
  next();
});
// login
userRoutes.post('/login', loginUser);


// signup
userRoutes.post('/signup',signUpUser );


export {userRoutes};
 


