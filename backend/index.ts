import express, { Express, Request, Response } from 'express';
import mysql, { type Connection } from 'mysql2';
import cors from 'cors';

interface ContactData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

const app: Express = express();
app.use(cors());
app.use(express.json());

const db: Connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'contact_db'
});

db.connect((err: Error | null) => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

db.query(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL
  )
`);

app.post('/api/contact', (req: Request, res: Response) => {
  const { fullName, email, phone, message }: ContactData = req.body;
  const query: string = 'INSERT INTO contacts (fullName, email, phone, message) VALUES (?, ?, ?, ?)';
  db.query(query, [fullName, email, phone, message], (err: Error | null, result: any) => {
    if (err) {
      console.error('Error al guardar los datos:', err);
      return res.status(500).json({ error: 'Error al guardar los datos' });
    }
    res.status(200).json({ message: 'Datos guardados correctamente' });
  });
});

const PORT: number = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});