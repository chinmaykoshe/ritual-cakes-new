import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  const [errorMessages, setErrorMessages] = useState(null);
  const [sucessMessages, setSucessMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // state to toggle password visibility

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prevData) => ({ ...prevData, [name]: value }));
  };

  const navigateToDashboard = (role) => {
    if (role === 'admin') {
      navigate('/admin/dashboards');
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
      const url = 'https://ritual-cakes-new-ogk5.vercel.app/auth/login';
  
      // Convert email to lowercase before sending
      const lowercasedSignInData = {
        ...signInData,
        email: signInData.email.toLowerCase(), // Ensure email is lowercase
      };
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lowercasedSignInData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        throw new Error('Incorrect credentials!');
      }
  
      const { token, email, role } = await response.json();
  
      // Save email and role in lowercase to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', email.toLowerCase()); // Save email as lowercase
      localStorage.setItem('role', role);
  
      navigateToDashboard(role);
  
    } catch (error) {
      console.error(error);
      setErrorMessages(error.message || 'An error occurred during sign-in. Please try again later.');
    } finally {
      setTimeout(() => {
      setSucessMessages('Sign in sucess ! Redirecting...');
      }, 3000);
      setLoading(false);
    }
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg mt-2 lg:mt-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Sign In / Log In</h2>
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
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type={passwordVisible ? 'text' : 'password'} // Toggle between text and password
              id="password"
              name="password"
              value={signInData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-darkcustombg focus:outline-none pr-10"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute mt-6 right-4 transform -translate-y-1/2"
              aria-label="Toggle password visibility"
            >
              {passwordVisible ? (
                <i className="fa-regular fa-eye text-gray-700"></i> // Eye normal (password hidden)
              ) : (
                <i className="fa-solid fa-eye text-gray-700"></i> // Eye solid(password visible)
              )}
            </button>
          </div>

          {errorMessages && <p className="text-red-500 text-center mb-4">{errorMessages}</p>}
          {sucessMessages && <p className="text-green-500 text-center mb-4">{sucessMessages}</p>}

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
    </div>
  );
}

export default Login;
