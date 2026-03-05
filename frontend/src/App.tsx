import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './presentation/components/Layout';
import { Dashboard } from './presentation/pages/Dashboard';
import { Medicos } from './presentation/pages/Medicos';
import { Pacientes } from './presentation/pages/Pacientes';
import { Citas } from './presentation/pages/Citas';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/medicos" element={<Medicos />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/citas" element={<Citas />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
