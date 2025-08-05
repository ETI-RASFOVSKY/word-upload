import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadForm from './components/UploadForm';
import SignaturePage from './components/SignaturePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadForm />} />
        <Route path="/sign" element={<SignaturePage />} />
      </Routes>
    </Router>
  );
}

export default App;