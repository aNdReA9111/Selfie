//sintassi import anche per node invece di require, se volete cambio 
//import: da un file .ts , nomeFile.js e non ts  
//se invece per l'export usate una sintassi node: module.exports 
//il file va incluso con estensione .cjs
import express, { Request, Response } from 'express';

// Initialize the Express application
const app = express();

// Define a basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with ES2020 modules!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
