import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <Navbar />
        <main style={styles.main}>
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f6fa',
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px',
  },
};

export default App;