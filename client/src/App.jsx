import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProfile from './pages/admin/ManageProfile';
import ManageSkills from './pages/admin/ManageSkills';
import ManageProjects from './pages/admin/ManageProjects';
import ManageCertifications from './pages/admin/ManageCertifications';
import ManageExperience from './pages/admin/ManageExperience';
import ManageEducation from './pages/admin/ManageEducation';
import ManageSocialLinks from './pages/admin/ManageSocialLinks';
import ManageLanguages from './pages/admin/ManageLanguages';
import ManageMessages from './pages/admin/ManageMessages';

function withProtection(Component) {
  return (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={withProtection(Dashboard)} />
          <Route path="/admin/profile" element={withProtection(ManageProfile)} />
          <Route path="/admin/skills" element={withProtection(ManageSkills)} />
          <Route path="/admin/projects" element={withProtection(ManageProjects)} />
          <Route path="/admin/certifications" element={withProtection(ManageCertifications)} />
          <Route path="/admin/experiences" element={withProtection(ManageExperience)} />
          <Route path="/admin/education" element={withProtection(ManageEducation)} />
          <Route path="/admin/social-links" element={withProtection(ManageSocialLinks)} />
          <Route path="/admin/languages" element={withProtection(ManageLanguages)} />
          <Route path="/admin/messages" element={withProtection(ManageMessages)} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}