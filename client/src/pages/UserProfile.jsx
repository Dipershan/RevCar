import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import axios from '../api/axiosInstance';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: ''
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/users/profile');
      setProfile(response.data.user);
      setFormData({
        username: response.data.user.username || '',
        email: response.data.user.email || '',
        phoneNumber: response.data.user.phoneNumber || ''
      });
    } catch (error) {
      setError('Failed to fetch profile');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/users/profile', formData);
      setProfile(response.data.user);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append(type, file);

      let endpoint = '';
      switch (type) {
        case 'profilePicture':
          endpoint = '/api/users/profile/picture';
          break;
        case 'driverLicense':
          endpoint = '/api/users/profile/driver-license';
          break;
        case 'idCard':
          endpoint = '/api/users/profile/id-card';
          break;
        default:
          throw new Error('Invalid file type');
      }

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update profile with new file path
      setProfile(prev => ({
        ...prev,
        [type === 'profilePicture' ? 'profilePicture' : type === 'driverLicense' ? 'driverLicense' : 'idCard']: response.data[type === 'profilePicture' ? 'profilePicture' : type === 'driverLicense' ? 'driverLicense' : 'idCard']
      }));

      setSuccess(`${type === 'profilePicture' ? 'Profile picture' : type === 'driverLicense' ? 'Driver license' : 'ID card'} uploaded successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(`Failed to upload ${type === 'profilePicture' ? 'profile picture' : type === 'driverLicense' ? 'driver license' : 'ID card'}. ${error.response?.data?.message || error.message}`);
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    // Use the correct server URL
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${filePath}`;
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">My Profile</h3>
              <button 
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Logout
              </button>
            </div>
            
            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}
              
              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                  <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
              )}

              {/* Profile Picture Section */}
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <div className="profile-picture-container">
                    {profile?.profilePicture ? (
                      <img
                        src={getFileUrl(profile.profilePicture)}
                        alt="Profile"
                        className="rounded-circle border"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    ) : (
                      <div 
                        className="rounded-circle border d-flex align-items-center justify-content-center bg-light"
                        style={{ width: '150px', height: '150px' }}
                      >
                        <i className="bi bi-person text-muted" style={{ fontSize: '4rem' }}></i>
                      </div>
                    )}
                    
                    <label className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle" 
                           style={{ width: '40px', height: '40px', padding: '0' }}
                           title="Change Profile Picture">
                      <i className="bi bi-camera"></i>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'profilePicture')}
                        style={{ display: 'none' }}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  
                  {uploading && (
                    <div className="mt-2">
                      <small className="text-muted">
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Uploading...
                      </small>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleProfileUpdate}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-person me-2"></i>
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="Enter username"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-envelope me-2"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="Enter email"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-telephone me-2"></i>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="Enter phone number"
                      pattern="[0-9+\-\s()]*"
                    />
                    <small className="text-muted">Format: +977-XXXXXXXXX or 98XXXXXXXXX</small>
                  </div>
                </div>

                <div className="d-flex gap-2 mb-4">
                  {editMode ? (
                    <>
                      <button type="submit" className="btn btn-success">
                        <i className="bi bi-check-circle me-2"></i>
                        Save Changes
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => {
                          setEditMode(false);
                          fetchUserProfile(); // Reset form data
                        }}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={() => setEditMode(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit Profile
                    </button>
                  )}
                </div>
              </form>

              {/* Documents Section */}
              <div className="border-top pt-4">
                <h4 className="mb-4">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Documents
                </h4>
                
                {/* Driver License */}
                <div className="mb-4">
                  <h5 className="text-primary">
                    <i className="bi bi-card-text me-2"></i>
                    Driver License
                  </h5>
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      {profile?.driverLicense ? (
                        <div className="d-flex align-items-center">
                          <div className="document-preview me-3">
                            <img
                              src={getFileUrl(profile.driverLicense)}
                              alt="Driver License"
                              className="img-thumbnail"
                              style={{ width: '100px', height: '60px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                            <div className="document-placeholder" style={{ display: 'none', width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="bi bi-file-earmark-text text-muted"></i>
                            </div>
                          </div>
                          <div>
                            <span className="text-success fw-semibold">
                              <i className="bi bi-check-circle me-1"></i>
                              Uploaded
                            </span>
                            <br />
                            <small className="text-muted">Driver license verified</small>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center">
                          <div className="document-placeholder me-3" style={{ width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="bi bi-file-earmark-text text-muted"></i>
                          </div>
                          <div>
                            <p className="text-muted mb-0">No driver license uploaded</p>
                            <small className="text-muted">Upload your driver license for verification</small>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-md-4 text-end">
                      <label className="btn btn-outline-primary btn-sm">
                        <i className="bi bi-upload me-1"></i>
                        {profile?.driverLicense ? 'Change License' : 'Upload License'}
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'driverLicense')}
                          style={{ display: 'none' }}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* ID Card */}
                <div className="mb-4">
                  <h5 className="text-primary">
                    <i className="bi bi-person-badge me-2"></i>
                    ID Card
                  </h5>
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      {profile?.idCard ? (
                        <div className="d-flex align-items-center">
                          <div className="document-preview me-3">
                            <img
                              src={getFileUrl(profile.idCard)}
                              alt="ID Card"
                              className="img-thumbnail"
                              style={{ width: '100px', height: '60px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                            <div className="document-placeholder" style={{ display: 'none', width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="bi bi-file-earmark-text text-muted"></i>
                            </div>
                          </div>
                          <div>
                            <span className="text-success fw-semibold">
                              <i className="bi bi-check-circle me-1"></i>
                              Uploaded
                            </span>
                            <br />
                            <small className="text-muted">ID card verified</small>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center">
                          <div className="document-placeholder me-3" style={{ width: '100px', height: '60px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="bi bi-file-earmark-text text-muted"></i>
                          </div>
                          <div>
                            <p className="text-muted mb-0">No ID card uploaded</p>
                            <small className="text-muted">Upload your ID card for verification</small>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-md-4 text-end">
                      <label className="btn btn-outline-primary btn-sm">
                        <i className="bi bi-upload me-1"></i>
                        {profile?.idCard ? 'Change ID Card' : 'Upload ID Card'}
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'idCard')}
                          style={{ display: 'none' }}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Upload Guidelines */}
                <div className="alert alert-info">
                  <h6 className="alert-heading">
                    <i className="bi bi-info-circle me-2"></i>
                    Upload Guidelines
                  </h6>
                  <ul className="mb-0 small">
                    <li>Supported formats: JPG, PNG, PDF</li>
                    <li>Maximum file size: 5MB</li>
                    <li>Ensure documents are clear and readable</li>
                    <li>Upload both sides of documents if required</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 