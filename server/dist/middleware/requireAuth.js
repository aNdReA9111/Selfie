import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
const requireAuth = async (req, res, next) => {
    //verifico che un utente sia autenticato
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: 'Richiesto token di autenticazione' });
    }
    const token = authorization.split(' ')[1];
    try {
        const { _id } = jwt.verify(token, process.env.SECRET);
        req.user = await User.findOne({ _id }).select('_id');
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Richiesto non autorizzata' });
    }
};
export { requireAuth };
//# sourceMappingURL=requireAuth.js.map