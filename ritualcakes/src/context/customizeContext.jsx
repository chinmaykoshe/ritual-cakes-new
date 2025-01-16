import React, { useEffect, createContext, useState, useContext } from 'react';

// Create a context for customization
const CustomizationContext = createContext();

// Custom hook to use customization context
export const useCustomization = () => {
  return useContext(CustomizationContext);
};

export const CustomizationProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: localStorage.getItem('user') || '',
    phone: '',
    address: '',
    size: '',
    cakeType: '',
    flavor: '',
    message: '',
    specialInstructions: '',
    deliveryDate: '',
    imageOrDesign: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const yourToken = localStorage.getItem('token');
  const [customizations, setCustomizations] = useState([]);

  // Define fetchCustomizations function
  const fetchCustomizations = async () => {
    setLoading(true);
    setError('');

    const userEmail = localStorage.getItem('user');
  
    if (!userEmail) {
      setError('User email not found.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/customizations/${userEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${yourToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customization data');
      }

      const result = await response.json();
      setCustomizations(result);  // Store the fetched data
      setSuccess('Customization data fetched successfully!');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('There was an error fetching the customization data.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form change (used for input fields)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (Create)
  const submitCustomization = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log("Submitting customization with data:", formData); // Debugging line

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/customizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setError('There was an error with your submission. Please try again.');
        return;
      }

      const result = await response.json();
      setSuccess('Customization submitted successfully!');
      
      // Fetch updated customizations list
      fetchCustomizations(); // Now this will work as fetchCustomizations is defined

      // Reset form data
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        size: '',
        cakeType: '',
        flavor: '',
        message: '',
        specialInstructions: '',
        deliveryDate: '',
        imageOrDesign: '',
      });
    } catch (err) {
      console.error(err);
      setError('There was an error with your submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update customization (Edit)
  const updateCustomization = async (id, updatedData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/customizations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourToken}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Update failed!');
      }

      const result = await response.json();
      setSuccess('Customization updated successfully!');
      setFormData(updatedData);
    } catch (err) {
      console.error(err);
      setError('There was an error updating the customization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete customization entry
  const deleteCustomization = async (id) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/customizations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${yourToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Deletion failed!');
      }

      setSuccess('Customization deleted successfully!');
      fetchCustomizations(); // Re-fetch customizations after deletion
    } catch (err) {
      console.error(err);
      setError('There was an error deleting the customization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomizationContext.Provider
      value={{
        customizations,
        setCustomizations,
        formData,
        handleChange,
        submitCustomization,
        updateCustomization,
        deleteCustomization,
        fetchCustomizations,
        loading,
        error,
        success,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};