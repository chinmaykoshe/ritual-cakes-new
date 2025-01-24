import axios from 'axios'; // Import Axios for HTTP requests

// Set base URL for Axios
axios.defaults.baseURL = 'https://ritual-cakes-new-ogk5.vercel.app'; // Global base URL for all requests

// Axios response interceptor
const useAxiosInterceptor = () => {

  // Handle 401 Unauthorized errors
  axios.interceptors.response.use(
    response => response, // Return successful response
    error => {
      if (error.response && error.response.status === 401) {
        localStorage.clear(); // Clear localStorage


        // Prevent multiple reloads in the same session
        if (!sessionStorage.getItem('hasReloaded')) {
          sessionStorage.setItem('hasReloaded', 'true'); // Set reload flag
          window.location.reload(); // Reload the page
        }

        return Promise.reject(error); // Reject the error
      }

      return Promise.reject(error); // Reject other errors
    }
  );
};

export default useAxiosInterceptor; // Export the hook
