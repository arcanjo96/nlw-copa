import { useContext } from 'react';
import { AuthContext, AuthContextDataPros } from '../contexts/AuthContext';

export function useAuth(): AuthContextDataPros {
  const context = useContext(AuthContext);

  return context;
}