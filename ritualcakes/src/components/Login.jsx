import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bcrypt from 'bcryptjs';


function Login() {
  
  const navigate = useNavigate();
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  const [errorMessages, setErrorMessages] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prevData) => ({ ...prevData, [name]: value }));
  };

  const navigateToDashboard = (role) => {
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/home');
    }
  
    // Force a page reload after navigation
    window.location.reload();
  };


const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const url = process.env.REACT_APP_AUTH_LOGIN_URL || 
            'https://project-new-code-ritual-cakes-gqwl7cuv8-chinmaykoshes-projects.vercel.app/auth/login';

        // Hash the password before sending
        const hashedPassword = bcrypt.hashSync(signInData.password, 10);
        const hashedSignInData = { ...signInData, password: hashedPassword };

        console.log("Sign-In Data with Hashed Password:", hashedSignInData);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hashedSignInData),
            credentials: 'include'
        });

        console.log('Response Status:', response.status);
        console.log('Response Headers:', response.headers);

        // Process response
        let result;
        try {
            result = await response.json();
        } catch (error) {
            setErrorMessages('Received non-JSON response. Please check the backend.');
            toast.error('Received non-JSON response. Please check the backend.');
            return;
        }

        if (!response.ok) {
            const errorMessage = result.error || result.message || 'An error occurred during sign-in.';
            setErrorMessages(errorMessage);
            toast.error(errorMessage);
            return;
        }

        const { token, email, role } = result;
        localStorage.setItem('token', token);
        localStorage.setItem('user', email);
        localStorage.setItem('role', role);

        navigateToDashboard(role);

    } catch (error) {
        setErrorMessages(error.message || 'An unexpected error occurred during sign-in.');
        toast.error(error.message || 'An unexpected error occurred during sign-in.');
    } finally {
        setLoading(false);
    }
};



  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md bg-white  p-8 rounded-lg shadow-lg mt-2 lg:mt-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSignInSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={signInData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={signInData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none"
              required
            />
          </div>

          {errorMessages && <p className="text-red-500 text-center mb-4">{errorMessages}</p>}

          <hr className="my-6" />
          <p className="text-m font-bold text-center">
            New Customer?{' '}
            <a href="/signup" className="text-blue-500 hover:text-blue-700">Sign Up</a>
          </p>

          <button
            type="submit"
            className="w-full bg-orange-300 text-white text-xl font-bold py-3 rounded-lg hover:bg-green-300 mt-6"
            disabled={loading}
          >
            Sign In
          </button>
          <button
            type="button"
            className="mt-4 w-full text-gray-700 hover:text-red-400 font-medium text-xl"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Login;
