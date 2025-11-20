import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';

import { ProjectProvider } from './context/ProjectContext';
import ProjectsPage from './pages/ProjectsPage';

const App: React.FC = () => {
    return (
        <ProjectProvider>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </ProjectProvider>
    );
}

export default App;
