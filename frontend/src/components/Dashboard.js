import React from 'react';
import { FaUserTie, FaChartLine, FaMoneyBillWave } from 'react-icons/fa';

/**
 * Dashboard component displays quick statistics.
 * Props:
 *   - employees: array of employee objects
 *   - loading: boolean indicating data fetch status
 */
function Dashboard({ employees, loading }) {
  // Compute statistics safely even when loading or empty
  const total = employees ? employees.length : 0;
  const avgSalary = employees && employees.length
    ? (employees.reduce((sum, e) => sum + (Number(e.salary) || 0), 0) / employees.length).toFixed(2)
    : 0;

  const stats = [
    { label: 'Total Employees', value: total, icon: <FaUserTie /> },
    { label: 'Average Salary', value: `$${avgSalary}`, icon: <FaMoneyBillWave /> },
    { label: 'Departments', value: employees ? new Set(employees.map(e => e.department)).size : 0, icon: <FaChartLine /> },
  ];

  return (
    <div className="stats-grid">
      {stats.map((s, i) => (
        <div key={i} className="stat-card" style={{ '--card-accent': i === 0 ? 'var(--primary)' : i === 1 ? 'var(--emerald)' : 'var(--violet)' }}>
          <div className="stat-card-row">
            <div className="stat-card-icon">{s.icon}</div>
            <div>
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-value">{s.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
