import mongoose, { Schema, Document, Model } from 'mongoose';

// Definire un'interfaccia che rappresenta le proprietà di un documento Event
interface IEvent extends Document {
    _id: Schema.Types.ObjectId;
    titolo: string;
    descrizione: string;
    data: Date;
    frequenza: [string];
    ripetizioni: [string];
    _id_utente: string;
    timezone?: string;
}

// Definire un'interfaccia che rappresenta i metodi statici del modello Event
interface IEventModel extends Model<IEvent> {
    createEvent(titolo: string, descrizione: string, data: Date, frequenza: [string], ripetizioni: [string], timezone: string, _id_utente: string): Promise<IEvent>;
    getEventById(_id: string, _id_utente : string): Promise<IEvent>;
    getAllEvents(_id_utente: string): Promise<IEvent[]>;
    deleteEventById(_id: string, _id_utente: string): Promise<IEvent>;
    deleteAllEvents(_id_utente: string): Promise<void>;
}


// Definire lo schema di Mongoose
const eventSchema = new Schema<IEvent>({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    },
    titolo: {
        type: String,
        required: true
    },
    descrizione: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    frequenza: {
        type: [String],
        required: true,
        enum: ['nessuna', 'giornaliero', 'settimanale', 'mensile', 'annuale'],
        default: ['nessuna']
    },

    ripetizioni: {
        type: [String],
        match: [/^(none|0-9]+[mhdMy])$/, 'Il campo ripetizioni deve essere nel formato [0-9][m,h,d,M,y] o "none"'],
        default: ['none']
    },
    _id_utente: {
        type: String,
        required: true
    },
    timezone: {
        type: String,
        default: 'Europe/Rome',
        required: false
    }
});


// aggiungo il metodo statico per la creazione di un evento
eventSchema.statics.createEvent = async function(titolo: string, descrizione: string, data: Date, frequenza: [string], ripetizioni: [string], timezone: string, _id_utente: string): Promise<IEvent> {

    // validazione
    if (!titolo || !descrizione || !data || !frequenza || !ripetizioni || !_id_utente)
        throw new Error('Tutti i campi sono obbligatori');

    // creazione dell'evento
    const event = await this.create({ titolo, descrizione, data, frequenza, ripetizioni, timezone, _id_utente });
    return event;
}

// aggiungo il metodo statico per la ricerca di un evento
eventSchema.statics.getEventById = async function(_id: string, _id_utente: string): Promise<IEvent> {
    const event = await this.findById(_id);

    if (!event) 
        throw new Error('Evento non trovato');

    // Verifica se l'utente è il proprietario dell'evento
    if (!(String(event._id_utente) === _id_utente)) 
        throw new Error('Non sei autorizzato a visualizzare questo evento');

    return event;
}

// aggiungo il metodo statico per la ricerca di tutti gli eventi di un utente
eventSchema.statics.getAllEvents = async function(_id_utente: string): Promise<IEvent[]> {
    const events = await this.find({ _id_utente });

    if (events.length === 0)
        throw new Error('Nessun evento trovato per l\'utente specificato');

    return events;
}

// aggiungo il metodo statico per la cancellazione di un evento
eventSchema.statics.deleteEventById = async function(_id: string, _id_utente: string): Promise<IEvent> {
    // Trova l'evento
    const event = await this.findById(_id);

    // Verifica se l'evento esiste
    if (!event)
        throw new Error('Evento non trovato');
    
    // Verifica se l'utente è il proprietario dell'evento
    if (!(String(event._id_utente) === _id_utente))
        throw new Error('Non sei autorizzato a cancellare questo evento');
    

    // Cancella l'evento
    await this.findByIdAndDelete(_id);
    return event;
}

// aggiungo il metodo statico per la cancellazione di tutti gli eventi di un utente
eventSchema.statics.deleteAllEvents = async function(_id_utente: string): Promise<void> {
    const result = await this.deleteMany({ _id_utente });
    if (result.deletedCount === 0)
        throw new Error('Nessun evento trovato per l\'utente specificato');
}


const EventModel = mongoose.model<IEvent, IEventModel>('Event', eventSchema);

export { IEvent, EventModel };