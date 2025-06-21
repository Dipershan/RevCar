import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { sendSOSAlert } from '../redux/sosSlice';

const SOSModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const { loading, message, error } = useSelector((state) => state.sos);
  const user = useSelector((state) => state.auth.user);

  const [selectedIssue, setSelectedIssue] = React.useState('Vehicle breakdown');

  const handleSOS = () => {
    const emergencyData = {
      userId: user?._id || 'guest',
      issue: selectedIssue,
      location: 'Unknown', // In a real app, you'd get this from navigator.geolocation
    };
    dispatch(sendSOSAlert(emergencyData));
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>🚨 Emergency Help</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>What is the emergency?</Form.Label>
          <Form.Select
            value={selectedIssue}
            onChange={(e) => setSelectedIssue(e.target.value)}
            disabled={loading}
          >
            <option value="Vehicle breakdown">🚗 Vehicle Breakdown</option>
            <option value="Accident">💥 Accident</option>
            <option value="Medical">🩺 Medical Emergency</option>
            <option value="Fire">🔥 Fire</option>
          </Form.Select>
        </Form.Group>
        
        {loading && (
          <div className="text-center">
            <Spinner animation="border" variant="danger" />
          </div>
        )}

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Close
        </Button>
        <Button variant="danger" onClick={handleSOS} disabled={loading}>
          Send SOS Alert
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SOSModal;
