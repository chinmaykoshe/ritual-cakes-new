import React, { useEffect, useState } from 'react';

const UserComponent = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://ritual-cakes-new-ogk5.vercel.app/api/user/${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>User Information</h2>
      {userData ? (
        <>
          <p>Name: {userData.name} {userData.surname}</p>
          <p>Email: {userData.email}</p>
          <p>Mobile: {userData.mobile}</p>
          <p>Date of Birth: {userData.dob}</p>
          <p>Address: {userData.address}</p>
        </>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default UserComponent;
