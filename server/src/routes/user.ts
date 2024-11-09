import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { 
    removeSubscription, 
    addSubscription, 
    loginUser, 
    signUpUser,
    searchUsers,
    logoutUser
} from '../controllers/userController.js';

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

export { router as userRoutes };
 


