import express from 'express';
import {
    addSubscription,
    loginUser,
    logoutUser,
    removeSubscription,
    searchUsers,
    signUpUser,
    updateUser
} from '../controllers/userControllers.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.use((req, res, next) => {
    console.log(`Request passed through /users router: ${req.method} ${req.url}`);
    next();
});

// login
router.post('/login', loginUser);

// signup
router.post('/signup', signUpUser);

// logout
router.post('/logout', logoutUser);

// search users
router.post('/search', requireAuth, searchUsers);

//route per push notification subscription
router.post('/subscribe', requireAuth, addSubscription);

//route per push notification unsubscription
router.patch('/unsubscribe', requireAuth, removeSubscription);

//rout per la modifica del profilo
router.patch('/update', requireAuth, updateUser);
export { router as userRoutes };
