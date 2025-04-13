// import React from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import AppRoutes from './routes';

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <AppRoutes />
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;

// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import AppRoutes from '@/routes';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;