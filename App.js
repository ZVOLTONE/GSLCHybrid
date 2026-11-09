import './global.css';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuth } from './src/auth/useAuth';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MarketOverviewScreen from './src/screens/MarketOverviewScreen';

function AuthFlow({ authHook }) {
  const [screen, setScreen] = useState('login');

  if (screen === 'register') {
    return (
      <RegisterScreen
        authHook={authHook}
        onNavigate={setScreen}
      />
    );
  }

  return (
    <LoginScreen
      authHook={authHook}
      onNavigate={setScreen}
    />
  );
}

export default function App() {
  const authHook = useAuth();
  const { auth, logout } = authHook;

  return (
    <SafeAreaProvider>
      {auth.isAuthenticated ? (
        <MarketOverviewScreen user={auth.user} onLogout={logout} />
      ) : (
        <AuthFlow authHook={authHook} />
      )}
    </SafeAreaProvider>
  );
}
