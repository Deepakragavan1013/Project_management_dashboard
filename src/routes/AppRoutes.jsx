import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Employees from '../pages/Employees';
import Projects from '../pages/Projects';
import Tasks from '../pages/Tasks';
import ProjectDetail from '../pages/ProjectDetail';

// add inside <Routes>

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
    </Routes>
  );
}

export default AppRoutes;