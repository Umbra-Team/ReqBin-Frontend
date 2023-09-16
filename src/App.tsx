import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Paper } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import BinsList from './components/BinsList';
import BinDetail from './components/BinDetail';
import RequestDetail from './components/RequestDetail';



import './App.css';
import '@mdi/font/css/materialdesignicons.min.css';

const App = () => {
  useEffect(() => {
    document.title = "ReqBin";
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <Container component={Paper} style={{ marginTop: '20px', padding: '20px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bins" element={<BinsList />} />
            <Route path="/bins/:binPath" element={<BinDetail />} />
            <Route path="/bins/:binPath/requests/:requestId" element={<RequestDetail />} />
          </Routes>
        </Container>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
