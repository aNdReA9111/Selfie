import UserModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
const createToken = (_id) => {
    return jwt.sign({ _id }, "chiavesupersupersupersegreta", { expiresIn: '3d' });
};
// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.login(email, password);
        // creo il token 
        const token = createToken(user._id);
        res.status(200).json({ email, token });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// signup user
const signUpUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.signup(email, password);
        // creo il token 
        const token = createToken(user._id);
        res.status(201).json({ email, token });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export { loginUser, signUpUser };
//# sourceMappingURL=userControllers.js.map