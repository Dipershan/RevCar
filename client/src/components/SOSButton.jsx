import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendSOSAlert } from '../redux/sosSlice';

const SOSButton = () => {
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector((state) => state.sos);
  const user = useSelector((state) => state.auth.user);

  const [selectedIssue, setSelectedIssue] = useState('Vehicle breakdown');

  const handleSOS = () => {
    const emergencyData = {
      userId: user?._id || 'guest',
      issue: selectedIssue,
      location: 'Unknown',
    };
    dispatch(sendSOSAlert(emergencyData));
  };

  const handleIssueChange = (event) => {
    setSelectedIssue(event.target.value);
  };

  return (
    <div className="d-flex flex-column gap-3" style={{ maxWidth: '300px' }}>
      <select
        className="form-select"
        style={{ width: '100%' }}
        value={selectedIssue}
        onChange={handleIssueChange}
        disabled={loading}
      >
        <option value="Vehicle breakdown">🚗 Vehicle Breakdown</option>
        <option value="Accident">💥 Accident</option>
        <option value="Medical">🩺 Medical Emergency</option>
        <option value="Fire">🔥 Fire</option>
      </select>

      <button
        onClick={handleSOS}
        disabled={loading}
        className="btn btn-danger"
        style={{ opacity: loading ? 0.6 : 1 }}
      >
        🚨 SOS Emergency
      </button>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {message && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default SOSButton;
