import bcrypt from 'bcrypt';
import validator from 'validator';
import mongoose, { Schema, Document, Model } from 'mongoose';

// Definire un'interfaccia che rappresenta le proprietà di un documento User
interface IUser extends Document {
    email: string;
    password: string;
}

// Definire un'interfaccia che rappresenta i metodi statici del modello User
interface IUserModel extends Model<IUser> {
    signup(email: string, password: string): Promise<IUser>;
    login(email: string, password: string): Promise<IUser>;
}

// Definire lo schema di Mongoose
const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// aggiungo il metodo statico per la regiostrarzione
userSchema.statics.signup = async function(email: string, password: string): Promise<IUser> {

    // validazione
    if(!email || !password) throw new Error('Email and password are required');
    if(!validator.isEmail(email)) throw new Error('Email is not valid');
    if(!validator.isStrongPassword(password)) throw new Error('Password is not strong enough');

    const existingUser = await this.findOne({ email });
    if (existingUser) throw new Error('Email already exists');

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await this.create({ email, password: hashedPassword });
    return user;
};


// creo il metodo statico per il login
userSchema.statics.login = async function(email: string, password: string): Promise<IUser> {
    if(!email || !password) throw new Error('Email and password are required');
    
    const user = await this.findOne({ email });
    if(!user) throw new Error('Email does not exist');
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) throw new Error('Password is not valid');
    
    return user;
}



// Esportare il modello con il tipo corretto
export default mongoose.model<IUser, IUserModel>('user', userSchema);


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