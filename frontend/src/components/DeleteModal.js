import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

/**
 * DeleteModal confirms deletion of an employee.
 * Props:
 *   - employee: object containing at least `full_name` and `id`
 *   - onCancel: function to close the modal without action
 *   - onConfirm: function to execute deletion
 */
function DeleteModal({ employee, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Delete Employee</h2>
          <button className="modal-close" onClick={onCancel} aria-label="Close">
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <div className="delete-icon-wrap">
            <FaExclamationTriangle style={{ color: '#fb7185' }} />
          </div>
          <div className="delete-text">
            Are you sure you want to delete <span className="delete-name">{employee.full_name}</span>?
            <br />This action cannot be undone.
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
