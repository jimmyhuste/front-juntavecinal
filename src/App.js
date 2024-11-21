import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Resgiter';
import SidebarPanel from './components/SidebarPanel';
import Home from './pages/Home';
import Page404 from './pages/Page404';
import UpdateUser from './components/UpdateUser';
import ViewUser from './components/ViewUser';
import { UserDetails } from './components/UserDetails';
import { FamilyRegister } from './components/FamilyRegister';
import { CreateNews } from './components/CreateNews';
import { ViewNews } from './components/ViewNews';
import CreateCertificationFrom from './components/CreateCertificationFrom';
import CertificadoStatus from './components/CertificadoStatus';
import MapaInteractive from './components/MapaInteractive';

// theme
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';
import ThemeSelector from './components/ThemeSelector';
import './styles/theme.css';
import Help from './pages/Help';
import TermsAndPrivacy from './pages/TermsAndPrivacy ';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Componente envoltorio para las rutas que necesitan tema
const ThemedContent = ({ children }) => {
  const { themes } = useTheme();
  
  return (
    <div style={{
      backgroundColor: themes.background,
      color: themes.text,
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <ThemeSelector />
      {children}
    </div>
  );
};

const AppContent = () => {
  return (
    <Routes>
      {/* Rutas sin tema */}
      <Route path="/" element={<Home />} />
      <Route path="/ayuda" element={<Help/>} />
      <Route path="/terms-privacy" element={<TermsAndPrivacy/>} />
      <Route path="/policy" element={<PrivacyPolicy/>} />
      
      {/* Rutas con tema */}
      <Route path="/panel" element={
        <ThemedContent>
          <SidebarPanel />
        </ThemedContent>
      } />
      <Route path="/login" element={
        <ThemedContent>
          <Login />
        </ThemedContent>
      } />
      <Route path="/register" element={
        <ThemedContent>
          <Register />
        </ThemedContent>
      } />
      <Route path="/user/:rut/edit" element={
        <ThemedContent>
          <UpdateUser />
        </ThemedContent>
      } />
      <Route path="/user-view" element={
        <ThemedContent>
          <ViewUser />
        </ThemedContent>
      } />
      <Route path="/user/:rut/details" element={
        <ThemedContent>
          <UserDetails />
        </ThemedContent>
      } />
      <Route path="/family/register" element={
        <ThemedContent>
          <FamilyRegister />
        </ThemedContent>
      } />
      <Route path="/create/news" element={
        <ThemedContent>
          <CreateNews />
        </ThemedContent>
      } />
      <Route path="/read/news" element={
        <ThemedContent>
          <ViewNews />
        </ThemedContent>
      } />
      <Route path="/maps" element={
        <ThemedContent>
          <MapaInteractive />
        </ThemedContent>
      } />
      <Route path="/certificados/solicitar/" element={
        <ThemedContent>
          <CreateCertificationFrom />
        </ThemedContent>
      } />
      <Route path="/certificados/check/" element={
        <ThemedContent>
          <CertificadoStatus />
        </ThemedContent>
      } />
      <Route path="/noticias/:id/edit" element={
        <ThemedContent>
          <CreateNews />
        </ThemedContent>
      } />
      
      {/* Ruta 404 sin tema */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENTID}>
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  </GoogleOAuthProvider>
  );
}

export default App;