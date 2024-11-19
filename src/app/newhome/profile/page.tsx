'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ProfileImage from "./../../../../public/assets/profile.jpg";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<{
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }>({});

  const [isUpdating, setIsUpdating] = useState(false);

  const defaultUpdateData = { field: '', value: '', currentValue: '' };

  const [updateData, setUpdateData] = useState<{ field: string; value: string; currentValue: string }>(
    defaultUpdateData
  );

  // State to store the username after it's safely retrieved from localStorage
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Safely access localStorage only in the browser environment
      const storedUser = localStorage.getItem('user');
      const storedUsername = storedUser ? JSON.parse(storedUser).username : null;
      setUsername(storedUsername);  // Update state with the retrieved username

      if (storedUsername) {
        // Fetch user data from the backend API using the stored username
        fetch(`/api/getUserProfile?username=${storedUsername}`)
          .then((res) => res.json())
          .then((data) => {
            setUserData(data);
          })
          .catch((err) => console.error('Failed to fetch user data', err));
      } else {
        // Redirect to login page if no user data is found
        window.location.href = '/login';
      }
    }
  }, []);  // Empty dependency array to run only on component mount

  const handleSignOut = () => {
    // Redirect to the home page after sign-out
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleUpdateSubmit = () => {
    const userId = userData.username;
    if (!userId) {
      alert("User ID is required.");
      return;
    }

    const updatePayload = {
      userId, // Include the userId
      field: updateData.field,
      currentValue: updateData.currentValue,
      newValue: updateData.value,
    };
    console.log(updatePayload);

    // Submit updated data to the backend API
    fetch('/api/updateProfile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          alert('Profile updated successfully!');
          setUserData({ ...userData, [updateData.field]: updateData.value });
          setIsUpdating(false);
          setUpdateData(defaultUpdateData); 
        } else {
          alert('Update failed. Please check your inputs.');
          setUpdateData(defaultUpdateData); 
        }
      })
      .catch((err) => {
        console.error('Failed to update profile', err);
        setUpdateData(defaultUpdateData); // Reset form data on error
      });
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setUpdateData(defaultUpdateData); // Reset form data when update is canceled
  };

  const handleDeleteAccount = () => {
    // Confirmation before deleting the account
    if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      const userId = userData.username; // Replace with the actual user ID field

    if (!userId) {
      alert('User ID is missing. Cannot delete account.');
      return;
    }

      fetch('/api/deleteProfile', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'user-id': userId, // Pass the user ID in the headers
      },
      })
        .then((res) => {
          if (res.ok) {
            alert('Account deleted successfully.');
            window.location.href = '/';
          } else {
            res.json().then((data) => {
              alert(`Failed to delete account: ${data.error}`);
            });
          }
        })
        .catch((err) => console.error('Failed to delete account', err));
    }
  };

  return (
    <div style={styles.authContainer}>
      <div style={styles.formContainer}>
        <h2>Profile</h2>
        <Image
          src={ProfileImage} // Use Image component with StaticImageData
          alt="Profile"
          width={100}
          height={100}
          style={styles.profileImage}
        />
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>First Name:</strong> {userData.firstName}</p>
        <p><strong>Last Name:</strong> {userData.lastName}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Password:</strong> {userData.password}</p>
        <button style={styles.formButton} onClick={handleSignOut}>Sign Out</button>
        <button style={styles.formButton} onClick={() => setIsUpdating(true)}>Update Profile</button>
        <button style={styles.formButton} onClick={handleDeleteAccount}>Delete Profile</button>

        {isUpdating && (
          <div style={styles.updateDialog}>
            <h3>Update Profile</h3>
            <label>Field to Update:</label>
            <select
              value={updateData.field}
              onChange={(e) => setUpdateData({ ...updateData, field: e.target.value })}
              style={styles.updateSelect}
            >
              <option value="" disabled>Select Field</option>
              <option value="email">Email</option>
              <option value="username">Username</option>
              <option value="password_hash">Password</option>
            </select>
            <label>Current Value:</label>
            <input
              type="text"
              placeholder="Enter current value"
              value={updateData.currentValue}
              onChange={(e) => setUpdateData({ ...updateData, currentValue: e.target.value })}
              style={styles.updateInput}
            />
            <label>New Value:</label>
            <input
              type="text"
              placeholder="Enter new value"
              value={updateData.value}
              onChange={(e) => setUpdateData({ ...updateData, value: e.target.value })}
              style={styles.updateInput}
            />
            <button style={styles.formButton} onClick={handleUpdateSubmit}>Submit</button>
            <button style={styles.formButton} onClick={handleCancelUpdate}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  authContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',  // Specify that this is a valid type
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    marginBottom: '50px',
  },
  formContainer: {
    backgroundColor: '#7777ed',
    padding: '20px',
    borderRadius: '15px',
    width: '400px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    textAlign: 'center' as 'center',  // Ensure this is a valid string
    display: 'flex',
    flexDirection: 'column' as 'column',  // Ensure flexDirection is valid
    alignItems: 'center',
    gap: '15px',
  },
  profileImage: {
    borderRadius: '15%',
    marginBottom: '20px',
  },
  formButton: {
    backgroundColor: '#ffa500',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  updateDialog: {
    backgroundColor: '#665fcb',
    padding: '50px',
    borderRadius: '15px',
    width: '300px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.9)',
    textAlign: 'left' as 'left',  // Specify valid string value
    position: 'fixed' as 'fixed',  // Ensure position is valid
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  updateSelect: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  updateInput: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    marginBottom: '10px',
  },
};

export default Profile;
