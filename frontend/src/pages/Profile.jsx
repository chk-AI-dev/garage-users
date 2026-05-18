import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { profileApi } from '../utils/apiClient';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileApi.getProfile();
      setProfile(response.data.user);
      setFormData(response.data.user);
    } catch (error) {
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await profileApi.updateProfile(formData);
      setProfile(response.data.user);
      updateUser(response.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataToSend = new FormData();
    formDataToSend.append('profileImage', file);

    try {
      const response = await profileApi.uploadProfileImage(formDataToSend);
      setProfile(response.data.user);
      updateUser(response.data.user);
      toast.success('Profile image uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error uploading image');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await profileApi.changePassword(passwordData);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error changing password');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container profile-container">
      <h2>My Profile</h2>

      <div className="profile-header">
        <div className="profile-image-section">
          {profile?.profileImage ? (
            <img src={`${import.meta.env.VITE_SERVER_URL}${profile.profileImage}`} alt="Profile" className="profile-image" />
          ) : (
            <div className="profile-image-placeholder">
              {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
            </div>
          )}
          <label className="upload-label">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              hidden
            />
            Upload Image
          </label>
        </div>

        <div className="profile-info">
          <h3>{profile?.firstName} {profile?.lastName}</h3>
          <p className="role-badge">{profile?.role.toUpperCase()}</p>
          <p>{profile?.email}</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${!isEditing ? 'active' : ''}`}
          onClick={() => setIsEditing(false)}
        >
          Profile Information
        </button>
        <button 
          className={`tab-button ${isEditing ? 'active' : ''}`}
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </button>
      </div>

      {!isEditing ? (
        <div className="card profile-info-card">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">First Name:</span>
              <span className="info-value">{profile?.firstName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Name:</span>
              <span className="info-value">{profile?.lastName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{profile?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone:</span>
              <span className="info-value">{profile?.phone || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Department:</span>
              <span className="info-value">{profile?.department || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">City:</span>
              <span className="info-value">{profile?.city || 'N/A'}</span>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdateProfile} className="card">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                className="form-input"
                value={formData.firstName || ''}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="form-input"
                value={formData.lastName || ''}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone || ''}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <input
              type="text"
              name="department"
              className="form-input"
              value={formData.department || ''}
              onChange={handleFormChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                className="form-input"
                value={formData.city || ''}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                name="state"
                className="form-input"
                value={formData.state || ''}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      )}

      <div className="card password-card">
        <h3>Change Password</h3>
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              className="form-input"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              name="newPassword"
              className="form-input"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
