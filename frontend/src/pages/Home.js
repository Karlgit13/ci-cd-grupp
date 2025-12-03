import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/api';

function Home() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/meetups');
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  return null;
}

export default Home;

