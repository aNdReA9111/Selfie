import bcrypt from 'bcrypt';
import validator from 'validator';
import mongoose, { Schema } from 'mongoose';
// Definire lo schema di Mongoose
const userSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    cognome: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    data_nascita: {
        type: Date,
        required: true
    }
});
// aggiungo il metodo statico per la regiostrarzione
userSchema.statics.signup = async function (email, password, nome, cognome, username, data_nascita) {
    // validazione
    if (!email || !password)
        throw new Error('Email and password are required');
    if (!validator.isEmail(email))
        throw new Error('Email is not valid');
    if (!validator.isStrongPassword(password))
        throw new Error('Password is not strong enough');
    const existingUser = await this.findOne({ email });
    if (existingUser)
        throw new Error('Email already exists');
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await this.create({ email, password: hashedPassword, nome, cognome, username, data_nascita });
    return user;
};
// creo il metodo statico per il login
userSchema.statics.login = async function (email, password) {
    if (!email || !password)
        throw new Error('Email and password are required');
    const user = await this.findOne({ email });
    if (!user)
        throw new Error('Email does not exist');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
        throw new Error('Password is not valid');
    return user;
};
// Esportare il modello con il tipo corretto
export default mongoose.model('user', userSchema);
////////////////////////////////////////////////////////////////
/*

La procedura sotto funziona solo in JS, TypeScript non sa automaticamente
che viene aggiunto un metodo statico al modello Mongoose.

*/
////////////////////////////////////////////////////////////////
// import bcrypt from 'bcrypt';
// import mongoose from 'mongoose';
// const userSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     }
// });
// userSchema.statics.signup = async function(email: string, password: string) {
//     const existingUser = await this.findOne({ email });
//     if(existingUser)
//         throw new Error('Email already exists');
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(password, salt);
//     const user = await  this.create({ email, password: hashedPassword });
//     return user;
// }
// export default mongoose.model('User', userSchema); 
//# sourceMappingURL=userModel.js.map