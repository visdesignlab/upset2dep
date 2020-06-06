import React, { useEffect, useState } from 'react';
import './App.css';
import { UserInfo } from './Types/UserInfo';
import Navbar from './Components/Navbar';

export const serverPath = 'http://localhost:5000';

function useAuthentication() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchResponse = fetch('/api/user/info', { credentials: 'include' });
    fetchResponse
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((json) => {
              if (JSON.stringify(user) !== JSON.stringify(json)) {
                setUser(json);
              }
            })
            .catch((err) => {
              throw new Error(err);
            });
        } else {
          setUser(null);
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, [user]);

  function logout() {
    fetch('/api/user/logout', { credentials: 'include' }).then((_) => {
      setUser(null);
    });
  }

  return { user, logout };
}

function App() {
  const { user, logout } = useAuthentication();

  console.log(user);
  return <Navbar user={user} logout={logout} />;
}

export default App;
