import axios from 'axios';
axios.defaults.baseURL = 'https://ritual-cakes-new-ogk5.vercel.app';

const useAxiosInterceptor = () => {
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        if (!sessionStorage.getItem('hasReloaded')) {
          sessionStorage.setItem('hasReloaded', 'true'); 
          window.location.reload();
        }
        return Promise.reject(error); 
      }
      return Promise.reject(error);
    }
  );
};

export default useAxiosInterceptor;
