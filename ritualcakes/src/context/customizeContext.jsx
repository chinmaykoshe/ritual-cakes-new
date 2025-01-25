import React, { useEffect, createContext, useState, useContext } from 'react';

// Create a context for customizations
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
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(''); // State for error messages
  const [success, setSuccess] = useState(''); // State for success messages
  const [customizations, setCustomizations] = useState([]); // State for storing customizations
  const yourToken = localStorage.getItem('token'); // Get token from localStorage
  const apiUrl = 'https://ritual-cakes-new-ogk5.vercel.app/api'

  // Fetch customizations from the backend
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
      // Fetch customization data from API
      const response = await fetch(`${apiUrl}/customizations/${userEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customization data');
      }

      const result = await response.json();
      setCustomizations(result); // Store the fetched data in state
      setSuccess('Customization data fetched successfully!');
    } catch (err) {
      setError('There was an error fetching the customization data.');
    } finally {
      setLoading(false); // Stop loading after data fetch
    }
  };

  // Handle form changes (input field updates)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission (Create new customization)
  const submitCustomization = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Submit the customization data via POST request
      const response = await fetch(`${apiUrl}/customizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError('There was an error with your submission. Please try again.');
        return;
      }

      const result = await response.json();
      setSuccess('Customization submitted successfully!');
      
      // Fetch updated customizations list
      fetchCustomizations(); 

      // Reset form data after successful submission
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
      setError('There was an error with your submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update existing customization (Edit)
  const updateCustomization = async (id, updatedData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Send PUT request to update the customization
      const response = await fetch(`${apiUrl}/customizations/${id}`, {
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
      setFormData(updatedData); // Update the form data with the new customization
    } catch (err) {
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
      // Send DELETE request to remove the customization
      const response = await fetch(`${apiUrl}/customizations/${id}`, {
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
      setError('There was an error deleting the customization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomizationContext.Provider
      value={{
        customizations, // Provide customizations state
        setCustomizations, // Function to manually update customizations
        formData, // Provide form data state
        handleChange, // Handle input field changes
        submitCustomization, // Function to submit a new customization
        updateCustomization, // Function to update a customization
        deleteCustomization, // Function to delete a customization
        fetchCustomizations, // Function to fetch customizations
        loading, // Provide loading state
        error, // Provide error state
        success, // Provide success state
      }}
    >
      {children} {/* Render the child components */}
    </CustomizationContext.Provider>
  );
};
