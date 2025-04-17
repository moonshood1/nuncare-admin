import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Layout from "./Layout";
import { appRoutes } from "./Routes";
import { AuthProvider, useAuth } from "./AuthProvider";
import { LoginPage, ResetPasswordPage } from "./pages";
import { ToastContainer } from "react-toastify";

function ProtectedRoute({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout>
                  <Outlet />
                </Layout>
              </ProtectedRoute>
            }
          >
            {appRoutes.map(({ path, element, id }) => (
              <Route key={id} path={path} element={element} />
            ))}
          </Route>
        </Routes>
        <ToastContainer position="bottom-center" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
