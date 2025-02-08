import './App.css';
import Page1 from './components/Page1';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Page1 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
