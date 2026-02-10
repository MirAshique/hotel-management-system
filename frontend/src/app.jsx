import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ================= CUSTOMER LAYOUT ================= */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* ================= CUSTOMER PAGES ================= */
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";

/* ================= ADMIN PAGES ================= */
import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import RoomsAdmin from "./admin/pages/Rooms";
import Bookings from "./admin/pages/Bookings";
import Analytics from "./admin/pages/Analytics";
import Settings from "./admin/pages/Settings";

/* ================= ADMIN LAYOUT ================= */
import AdminLayout from "./admin/layout/AdminLayout";

/* ================= AUTH ================= */
import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ================= CUSTOMER ROUTES ================= */}
          <Route
            path="/"
            element={
              <div className="customer-layout">
                <Navbar />
                <Home />
                <Footer />
              </div>
            }
          />

          <Route
            path="/rooms"
            element={
              <div className="customer-layout">
                <Navbar />
                <Rooms />
                <Footer />
              </div>
            }
          />

          <Route
            path="/rooms/:id"
            element={
              <div className="customer-layout">
                <Navbar />
                <RoomDetails />
                <Footer />
              </div>
            }
          />

          <Route
            path="/login"
            element={
              <div className="customer-layout">
                <Navbar />
                <Login />
                <Footer />
              </div>
            }
          />

          <Route
            path="/register"
            element={
              <div className="customer-layout">
                <Navbar />
                <Register />
                <Footer />
              </div>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <div className="customer-layout">
                  <Navbar />
                  <MyBookings />
                  <Footer />
                </div>
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN AUTH ================= */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ================= ADMIN PANEL (FULL SCREEN) ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="rooms" element={<RoomsAdmin />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
