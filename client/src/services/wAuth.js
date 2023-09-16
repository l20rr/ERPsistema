import React, { useEffect, useState } from 'react';
import api from './api';
import { login, logout, getToken } from './auth';
import { Route, Redirect } from 'react-router-dom';
import LinearProgress from '@material-ui/core/LinearProgress';

export default function WAuth({ component: Component, ...rest }) {
    const [redirect, setRedirect] = useState(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      async function verify() {
        const token = getToken();
  
        if (token) {
          // Make authenticated API requests using the token
          try {
            const res = await api.get('/api/usuarios/checktoken', { params: { token } });
  
            if (res.data.status === 200) {
              setLoading(false);
              setRedirect(false);
            } else {
              logout(); // Clear the token on authentication failure
              setLoading(false);
              setRedirect(true);
            }
          } catch (error) {
            console.error(error);
            setLoading(false);
            setRedirect(true);
          }
        } else {
          // No token found, redirect to login
          logout();
          setLoading(false);
          setRedirect(true);
        }
      }
      verify();
    }, []);
  
    return loading ? (
      <LinearProgress style={{ width: '50%', margin: '80px auto' }} />
    ) : (
      <Route
        {...rest}
        render={(props) =>
          !redirect ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: '/admin/login', state: { from: props.location } }} />
          )
        }
      />
    );
  }
