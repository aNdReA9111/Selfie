const whiteList = [
    'http://localhost:4000',
    'http://localhost:5173',
    'https://site232405.tw.cs.unibo.it',
    'http://site232405.tw.cs.unibo.it'
];
export const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            console.log(origin);
            //con la callback raise di un errore in caso 
            //di accesso da dominio non autorizzato
            // callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200 //204 di default, ma da problemi su alcuni browser
};
//# sourceMappingURL=corsOption.js.map