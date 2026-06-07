import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/useAuth'
import NavBar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import EventDetails from './pages/EventDetails'
import MyRegistrations from './pages/MyRegistrations' 
import MyParticipation from './pages/MyParticipation.jsx'
import CreateEvent from './pages/CreateEvent'
import AdminDashboard from './pages/AdminDashboard'
import MyEvents from './pages/MyEvents.jsx'
import PendingEvents from './pages/PendingEvents.jsx'
import ScanQR from './pages/ScanQR.jsx'
import EditEvent from "./pages/EditEvent.jsx";
import EventRegistrants from "./pages/EventRegistrants.jsx";
import Profile from "./pages/Profile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />
  return children
}

function App() {
  return(
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>} />
          <Route path="/events/:id" element={<EventDetails/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>


          <Route path='/events/:id/registrants' element={
              <ProtectedRoute roles={['USER', 'ADMIN']}>
                  <EventRegistrants />
              </ProtectedRoute>
          }

          />

          <Route path="/my-registrations" element={
            <ProtectedRoute roles={['USER', 'ADMIN']}>
              <MyRegistrations/>
            </ProtectedRoute>
          } />

          <Route path="/my-attendance" element={
            <ProtectedRoute roles={['USER', 'ADMIN']}>
              <MyParticipation/>
            </ProtectedRoute>
          } />

          <Route path="/my-events" element={
              <ProtectedRoute roles={['USER', 'ADMIN']}>
                  <MyEvents />
              </ProtectedRoute>
          }/>

          <Route path="/create-event" element={
            <ProtectedRoute roles={['ADMIN', 'USER']}>
              <CreateEvent/>
            </ProtectedRoute>
          } />

          <Route path="/scan-qr" element={
              <ProtectedRoute roles={['USER', 'ADMIN']}>
                  <ScanQR />
              </ProtectedRoute>
          }/>

          <Route path="/admin-dashboard" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminDashboard/>
            </ProtectedRoute>
          } />

          <Route path="/pending-events" element={
              <ProtectedRoute roles={['ADMIN']}>
                  <PendingEvents />
              </ProtectedRoute>
          }/>

          <Route path='/events/:id/edit' element={
              <ProtectedRoute roles={['ADMIN', 'USER']}>
                  <EditEvent />
              </ProtectedRoute>
          }/>

            <Route path='/profile' element={
              <ProtectedRoute roles={['ADMIN', 'USER']}>
                  <Profile />
              </ProtectedRoute>
            }/>

            <Route path='/profile/edit' element={
              <ProtectedRoute roles={['ADMIN', 'USER']}>
                  <EditProfile />
              </ProtectedRoute>
            }/>

            <Route path='/profile/change-password' element={
              <ProtectedRoute roles={['ADMIN', 'USER']}>
                  <ChangePassword />
              </ProtectedRoute>
            }/>

        </Routes>
      </div>
    </div>
  )
}

export default App
