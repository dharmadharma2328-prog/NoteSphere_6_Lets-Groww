import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import MainLayout from './layouts/MainLayout';

// Pages Import
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardHome from './pages/DashboardHome';
import BrowseNotes from './pages/BrowseNotes';
import UploadPage from './pages/UploadPage';
import OfflineLibrary from './pages/OfflineLibrary';
import VideoLectures from './pages/VideoLectures';
import StudyGroups from './pages/StudyGroups';
import DiscussionForum from './pages/DiscussionForum';
import NotificationsPage from './pages/NotificationsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ErrorPage from './pages/ErrorPage';

// Route guards simulation
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Dashboard layouts */}
        <Route 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/browse" element={<BrowseNotes />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/downloads" element={<OfflineLibrary />} />
          
          {/* Reuse browse notes page with search params for saved/trending/recommendations */}
          <Route path="/saved" element={<BrowseNotes />} />
          <Route path="/trending" element={<BrowseNotes />} />
          <Route path="/recommendations" element={<BrowseNotes />} />
          
          <Route path="/videos" element={<VideoLectures />} />
          <Route path="/groups" element={<StudyGroups />} />
          <Route path="/forum" element={<DiscussionForum />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback error */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
