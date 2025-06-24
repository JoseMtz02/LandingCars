import { Axios } from './node_modules/axios/index.d';
import express, { type Express, type Request, type Response } from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ContactData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  recaptcha: string;
}

interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
}

const app: Express = express();
app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, 'contact_db.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL
  )
`);

app.post('/api/contact', async (req: Request, res: Response) => {
  const secret = '6Ld8Z2srAAAAANazYnRGWg8piHq-zBYcRqKwLImu';
  const { fullName, email, phone, message, recaptcha }: ContactData = req.body;

  try {
    const { data: recaptchaRes }: { data: RecaptchaResponse } = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      new URLSearchParams({
        secret,
        response: recaptcha
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (recaptchaRes.success) {
      const query = `INSERT INTO contacts (fullName, email, phone, message) VALUES (?, ?, ?, ?)`;
      db.run(query, [fullName, email, phone, message], function (err) {
        if (err) {
          console.error('Error al guardar los datos:', err.message);
          return res.status(500).json({ error: 'Error al guardar los datos' });
        }
        return res.status(200).json({ message: 'Datos guardados correctamente', id: this.lastID });
      });
    } else {
      console.error('Error de reCAPTCHA:', recaptchaRes);
      return res.status(400).json({ error: 'Error de reCAPTCHA', details: recaptchaRes['error-codes'] });
    }
  } catch (error) {
    console.error('Error al verificar reCAPTCHA:', error);
    return res.status(500).json({ error: 'Error al verificar reCAPTCHA' });
  }});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
