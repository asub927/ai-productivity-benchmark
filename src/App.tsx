import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/reports" element={<Reports />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
