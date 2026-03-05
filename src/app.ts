import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

import medicoRoutes from './presentation/routes/medico.routes';
import pacienteRoutes from './presentation/routes/paciente.routes';
import citaRoutes from './presentation/routes/cita.routes';

app.use('/api/medicos', medicoRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/citas', citaRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Clinica API is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
