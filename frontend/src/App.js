import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import EmployeeTable from './components/EmployeeTable';
import EmployeeForm from './components/EmployeeForm';
import DeleteModal from './components/DeleteModal';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from './api';
import './index.css';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null); // employee for edit
  const [deleteTarget, setDeleteTarget] = useState(null); // employee for delete modal
  const [showForm, setShowForm] = useState(false);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleAdd = () => {
    setSelected(null);
    setShowForm(true);
  };

  const handleEdit = (emp) => {
    setSelected(emp);
    setShowForm(true);
  };

  const handleDelete = (emp) => {
    setDeleteTarget(emp);
  };

  const handleFormSubmit = async (emp) => {
    try {
      if (selected) {
        await updateEmployee(selected.id, emp);
      } else {
        await createEmployee(emp);
      }
      await loadEmployees();
    } catch (e) {
      setError('Operation failed');
    } finally {
      setShowForm(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEmployee(deleteTarget.id);
      await loadEmployees();
    } catch (e) {
      setError('Delete failed');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="app-layout">
      <div className="sidebar">
        {/* Simple static sidebar placeholder */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">EMS</div>
          <div>
            <div className="sidebar-logo-title">Employee Management</div>
            <div className="sidebar-logo-subtitle">System</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item active">
            <span className="nav-icon">🏢</span> Dashboard
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-footer-info">
            <div className="sidebar-footer-icon">👤</div>
            <div>
              <div className="sidebar-footer-label">Logged in as Admin</div>
              <div className="sidebar-footer-version">v1.0</div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-title">Employee Management System</div>
          <div className="topbar-right">
            <button className="btn btn-primary" onClick={handleAdd}>Add Employee</button>
          </div>
        </div>
        <div className="page-content">
          {error && <div className="error-banner">{error}</div>}
          <Dashboard employees={employees} loading={loading} />
          <EmployeeTable
            employees={employees}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {showForm && (
            <EmployeeForm
              employee={selected}
              onClose={() => setShowForm(false)}
              onSubmit={handleFormSubmit}
            />
          )}
          {deleteTarget && (
            <DeleteModal
              employee={deleteTarget}
              onCancel={() => setDeleteTarget(null)}
              onConfirm={confirmDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
