import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPanelPage } from './pages/AdminPanelPage';

// Komponen ini menjaga sesi login sederhana tanpa API, cukup untuk UI dan navigasi.
type SessionRole = 'member' | 'reseller' | 'admin';

interface Session {
  username: string;
  role: SessionRole;
  remember: boolean;
}

interface LoginPayload {
  username: string;
  password: string;
  role: Exclude<SessionRole, 'admin'>;
  remember: boolean;
}

const sessionKey = 'premiuminplus:session';
const rememberedUserKey = 'premiuminplus:remembered-user';

function loadSession(): Session | null {
  const raw = localStorage.getItem(sessionKey) || sessionStorage.getItem(sessionKey);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function ProtectedRoute({
  session,
  adminOnly,
  children,
}: {
  session: Session | null;
  adminOnly?: boolean;
  children: React.ReactNode;
}) {
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && session.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const [session, setSession] = useState<Session | null>(() => loadSession());
  const rememberedUsername = useMemo(() => localStorage.getItem(rememberedUserKey) || '', []);

  // Komponen ini menyimpan hasil login di localStorage atau sessionStorage sesuai checkbox.
  const handleLogin = ({ username, password, role, remember }: LoginPayload) => {
    const isAdmin = username === 'admin' && password === 'admin230521';
    const nextSession: Session = {
      username: isAdmin ? 'admin' : username,
      role: isAdmin ? 'admin' : role,
      remember,
    };

    localStorage.removeItem(sessionKey);
    sessionStorage.removeItem(sessionKey);
    localStorage.removeItem(rememberedUserKey);

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(sessionKey, JSON.stringify(nextSession));

    if (remember) {
      localStorage.setItem(rememberedUserKey, nextSession.username);
    }

    setSession(nextSession);
  };

  const handleLogout = () => {
    localStorage.removeItem(sessionKey);
    sessionStorage.removeItem(sessionKey);
    setSession(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} initialUsername={rememberedUsername} />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute session={session}>
              <DashboardPage session={session!} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute session={session} adminOnly>
              <AdminPanelPage session={session!} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
