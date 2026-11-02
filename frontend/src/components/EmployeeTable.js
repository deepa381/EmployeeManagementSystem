import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

/**
 * EmployeeTable displays a list of employees with edit/delete actions.
 * Props:
 *   - employees: array of employee objects
 *   - loading: boolean loading flag
 *   - onEdit: callback(employee) when edit button clicked
 *   - onDelete: callback(employee) when delete button clicked
 */
function EmployeeTable({ employees, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner" />
        <div className="loading-text">Loading employees...</div>
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <div className="empty-title">No employees found</div>
        <div className="empty-desc">Add new employees using the button above.</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Employees</h2>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th className="td-id">Department</th>
              <th>Designation</th>
              <th>Salary</th>
              <th>Joining Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td className="td-id">{emp.id}</td>
                <td className="td-primary">{emp.full_name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone_number}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td className="salary-value">${emp.salary}</td>
                <td>{emp.joining_date}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn action-btn-edit" onClick={() => onEdit(emp)} title="Edit">
                      <FaEdit />
                    </button>
                    <button className="action-btn action-btn-delete" onClick={() => onDelete(emp)} title="Delete">
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeTable;
