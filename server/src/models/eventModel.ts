import mongoose, { Schema, Document, Model } from 'mongoose';

// Definire un'interfaccia che rappresenta le proprietà di un documento Event
interface IEvent extends Document {
    _id: Schema.Types.ObjectId;
    titolo: string;
    descrizione: string;
    data: Date;
    frequenza: [string];
    ripetizioni: number;
    _id_utente: string;
}

// Definire un'interfaccia che rappresenta i metodi statici del modello Event
interface IEventModel extends Model<IEvent> {
    createEvent(titolo: string, descrizione: string, data: Date, frequenza: [string], ripetizioni: number, _id_utente: string): Promise<IEvent>;
    deleteEventById(_id: string, _id_utente: string): Promise<IEvent>;
}


// Definire lo schema di Mongoose
const eventSchema = new Schema<IEvent>({
    _id:{
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
        enum: ['giornaliero', 'settimanale', 'mensile', 'annuale']
    },
    ripetizioni: {
        type: Number,
        required: true
    },
    _id_utente: {
        type: String,
        required: true
    }
});


// aggiungo il metodo statico per la creazione di un evento
eventSchema.statics.createEvent = async function(titolo: string, descrizione: string, data: Date, frequenza: [string], ripetizioni: number, _id_utente: string): Promise<IEvent> {

    // validazione
    if (!titolo || !descrizione || !data || !frequenza || !ripetizioni || !_id_utente) {
        throw new Error('Tutti i campi sono obbligatori');
    }

    // creazione dell'evento
    const event = await this.create({ titolo, descrizione, data, frequenza, ripetizioni, _id_utente });
    return event;
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



export default mongoose.model<IEvent, IEventModel>('Event', eventSchema);