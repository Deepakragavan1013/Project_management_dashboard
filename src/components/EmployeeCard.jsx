import React from 'react';

function EmployeeCard({ employee, onEdit, onDelete }) {
  return (
    <div style={styles.card}>
      <img
        src={employee.profileImage}
        alt={employee.name}
        style={styles.avatar}
      />
      <div style={styles.info}>
        <h3 style={styles.name}>{employee.name}</h3>
        <p style={styles.position}>{employee.position}</p>
        <p style={styles.email}>{employee.email}</p>
      </div>
      <div style={styles.actions}>
        <button onClick={() => onEdit(employee)} style={styles.editBtn}>
          ✏️ Edit
        </button>
        <button onClick={() => onDelete(employee.id)} style={styles.deleteBtn}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '12px',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  info: {
    flex: 1,
  },
  name: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold',
  },
  position: {
    margin: '4px 0',
    color: '#666',
    fontSize: '14px',
  },
  email: {
    margin: 0,
    color: '#1976d2',
    fontSize: '13px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #1976d2',
    color: '#1976d2',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '13px',
  },
  deleteBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #d32f2f',
    color: '#d32f2f',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '13px',
  },
};

export default EmployeeCard;