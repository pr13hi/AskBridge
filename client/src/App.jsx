// import { Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import CandidateForm from './pages/CandidateForm';
// import AdminLogin from './pages/AdminLogin';
// import AdminDashboard from './pages/AdminDashboard';
// import CandidateDetail from './pages/CandidateDetail';

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/form" element={<CandidateForm />} />
//       <Route path="/admin/login" element={<AdminLogin />} />
//       <Route path="/admin/dashboard" element={<AdminDashboard />} />
//       <Route path="/candidate/:id" element={<CandidateDetail />} />
//     </Routes>
//   );
// }

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

