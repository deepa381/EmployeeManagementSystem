import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * EmployeeForm is a modal form for creating or editing an employee.
 * Props:
 *   - employee: object with existing data (or null for new)
 *   - onClose: function to close the modal
 *   - onSubmit: async function that receives form data
 */
function EmployeeForm({ employee, onClose, onSubmit }) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    department: '',
    designation: '',
    salary: '',
    joining_date: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setForm({
        full_name: employee.full_name || '',
        email: employee.email || '',
        phone_number: employee.phone_number || '',
        department: employee.department || '',
        designation: employee.designation || '',
        salary: employee.salary || '',
        joining_date: employee.joining_date || ''
      });
    }
  }, [employee]);

  const validate = () => {
    const newErrors = {};
    if (!form.full_name) newErrors.full_name = 'Full name required';
    if (!form.email) newErrors.email = 'Email required';
    if (!form.department) newErrors.department = 'Department required';
    if (!form.designation) newErrors.designation = 'Designation required';
    if (!form.salary) newErrors.salary = 'Salary required';
    if (!form.joining_date) newErrors.joining_date = 'Joining date required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <form className="form-grid" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="full_name">Full Name<span className="required">*</span></label>
              <input className="form-input" id="full_name" name="full_name" value={form.full_name} onChange={handleChange} placeholder="John Doe" />
              {errors.full_name && <div className="form-error">{errors.full_name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email<span className="required">*</span></label>
              <input className="form-input" id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone_number">Phone Number</label>
              <input className="form-input" id="phone_number" name="phone_number" value={form.phone_number} onChange={handleChange} placeholder="+1-555-1234" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="department">Department<span className="required">*</span></label>
              <input className="form-input" id="department" name="department" value={form.department} onChange={handleChange} placeholder="Engineering" />
              {errors.department && <div className="form-error">{errors.department}</div>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="designation">Designation<span className="required">*</span></label>
              <input className="form-input" id="designation" name="designation" value={form.designation} onChange={handleChange} placeholder="Software Engineer" />
              {errors.designation && <div className="form-error">{errors.designation}</div>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="salary">Salary<span className="required">*</span></label>
              <input className="form-input" id="salary" name="salary" type="number" min="0" value={form.salary} onChange={handleChange} placeholder="50000" />
              {errors.salary && <div className="form-error">{errors.salary}</div>}
            </div>
            <div className="form-group full-width">
              <label className="form-label" htmlFor="joining_date">Joining Date<span className="required">*</span></label>
              <input className="form-input" id="joining_date" name="joining_date" type="date" value={form.joining_date} onChange={handleChange} />
              {errors.joining_date && <div className="form-error">{errors.joining_date}</div>}
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeForm;
