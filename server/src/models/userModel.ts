import bcrypt from 'bcrypt';
import validator from 'validator';
import mongoose, { Schema, Document, Model } from 'mongoose';

// Interfaccia che rappresenta le proprietà di un documento PushSubscription
interface IPushSubscription {
  endpoint: string;
  expirationTime: number;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface IFlags extends Document {
    notifica_email: boolean;
    notifica_desktop: boolean;
    notifica_alert: boolean;
}

// Definire un'interfaccia che rappresenta le proprietà di un documento User
export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    email: string;
    password: string;
    nome: string;
    cognome: string;
    username: string;
    role: string;
    data_nascita: Date;
    flags: IFlags;
    pushSubscriptions: IPushSubscription[];
    currentDate: Date;
}

// Definire un'interfaccia che rappresenta i metodi statici del modello User
interface IUserModel extends Model<IUser> {
    signup(email: string, password: string, nome: string, cognome: string, username: string, data_nascita: Date, flags: IFlags): Promise<IUser>;
    login(email: string, password: string): Promise<IUser>;
}

const flagsSchema = new Schema<IFlags>({
    notifica_email: {
        type: Boolean,
        default: false
    },
    notifica_desktop: {
        type: Boolean,
        default: true
    },
    notifica_alert: {
        type: Boolean,
        default: true
    }
});

// Definire lo schema di Mongoose
const userSchema = new Schema<IUser>({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Email is not valid']
    },
    password: {
        type: String,
        required: true,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, 'Password is not strong enough']
    },
    nome: {
        type: String,
        required: true,
        match: [/^[a-zA-Z' ]{2,}$/, 'Nome can contain letters, apostrophes, and spaces only and must be at least 2 characters long']
    },
    cognome: {
        type: String,
        required: true,
        match: [/^[a-zA-Z' ]{2,}$/, 'Cognome can contain letters, apostrophes, and spaces only and must be at least 2 characters long']
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/^[a-zA-Z0-9]{2,16}$/, 'Username can contain letters, numbers and must be between 2 and 16 characters long']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    data_nascita: {
        type: Date,
        required: true
    },
    pushSubscriptions: [
      {
        endpoint: { type: String, required: true },
        keys: {
          p256dh: { type: String, required: true },
          auth: { type: String, required: true }
        }
      }
    ],
    flags: {
        type: flagsSchema,
        default: { notifica_email: false, notifica_desktop: true, notifica_alert: true }
    },
    currentDate: {
      type: Date,
      default: new Date(),
      required: true
    }
});

// aggiungo il metodo statico per la regiostrarzione
userSchema.statics.signup = async function(email: string, password: string, nome: string, cognome: string, username: string, data_nascita: Date, flags : IFlags): Promise<IUser> {

    // validazione
    if(!email || !password) throw new Error('Email and password are required');
    if(!validator.isEmail(email)) throw new Error('Email is not valid');
    if(!validator.isStrongPassword(password)) throw new Error('Password is not strong enough');

    const existingUser = await this.findOne({ email });
    if (existingUser) throw new Error('Email already exists');

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await this.create({ email, password: hashedPassword, nome, cognome, username, data_nascita});
    return user;
};


// creo il metodo statico per il login (email o username)
userSchema.statics.login = async function(email_or_username: string, password: string): Promise<IUser> {
    if(!email_or_username || !password) throw new Error('Email (or username) and password are required');
    
    const user = await this.findOne({
        $or: [
            { email: email_or_username },
            { username: email_or_username }
        ]
    });
    if(!user) {
        if(validator.isEmail(email_or_username)) 
            throw new Error('Email non esistente');
        else
            throw new Error('username non esistente');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) throw new Error('Password is not valid');
    
    return user;
}


const UserModel: IUserModel = mongoose.model<IUser, IUserModel>('user', userSchema);

// Esportare il modello con il tipo corretto
export { UserModel };
