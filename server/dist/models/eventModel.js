import mongoose, { Schema } from 'mongoose';
// Definire lo schema di Mongoose
const eventSchema = new Schema({
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
        enum: ['giornaliero', 'settimanale', 'mensile', 'annuale']
    },
    ripetizioni: {
        type: Number,
        required: true
    },
    _id_utente: {
        type: Schema.Types.ObjectId,
        required: true
    }
});
// aggiungo il metodo statico per la creazione di un evento
eventSchema.statics.createEvent = async function (titolo, descrizione, data, frequenza, ripetizioni, _id_utente) {
    // validazione
    if (!titolo || !descrizione || !data || !frequenza || !ripetizioni || !_id_utente) {
        throw new Error('Tutti i campi sono obbligatori');
    }
    // creazione dell'evento
    const event = await this.create({ titolo, descrizione, data, frequenza, ripetizioni, _id_utente });
    return event;
};
// aggiungo il metodo statico per la cancellazione di un evento
eventSchema.statics.deleteEventById = async function (_id) {
    const event = await this.findOneAndDelete({ _id });
    return event;
};
export default mongoose.model('Event', eventSchema);
//# sourceMappingURL=eventModel.js.map