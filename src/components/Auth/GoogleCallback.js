import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setGoogleUser } = useAuth();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userId = params.get('user_id');
    const name = params.get('name');
    const email = params.get('email');
    const picture = params.get('picture');

    if (token && userId) {
      localStorage.setItem('token', token);
      const userData = {
        id: parseInt(userId),
        full_name: name,
        email: email,
        picture: picture,
        is_google_user: true
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setGoogleUser(userData);
      
      toast.success(`Welcome ${name}!`);
      navigate('/');
    } else {
      toast.error('Google login failed');
      navigate('/login');
    }
    setProcessing(false);
  }, [location, navigate, setGoogleUser]);

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Completing login...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;