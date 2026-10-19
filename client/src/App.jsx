import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostProperty from './pages/PostProperty';
import BuyProperty from './pages/BuyProperty';

// Stub components for incomplete pages
const Placeholder = ({ title }) => (
  <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <h1 className="section-title">{title} - Coming Soon</h1>
  </div>
);

const AISearch = () => <Placeholder title="AI Search" />;
const Favorites = () => <Placeholder title="Favorites" />;
const PropertyDetails = () => <Placeholder title="Property Details" />;
const BuyerDashboard = () => <Placeholder title="Buyer Dashboard" />;
const AdminDashboard = () => <Placeholder title="Admin Dashboard" />;

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/buy" element={<BuyProperty />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/ai-search" element={<AISearch />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/post-property" element={<PostProperty />} />
          
          {/* Dashboards */}
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/seller/*" element={<PostProperty />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
