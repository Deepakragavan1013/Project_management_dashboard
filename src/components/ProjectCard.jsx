import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ProjectCard({ project, onEdit, onDelete }) {
  const employees = useSelector((state) => state.employees);
  const navigate = useNavigate();

  const assignedEmps = employees.filter((emp) =>
    project.assignedEmployees?.includes(emp.id)
  );

  return (
    <div style={styles.card}>
      
      <div style={styles.topRow}>
        <img src={project.logo} alt={project.title} style={styles.logo} />
        <div style={styles.info}>
          <h3 style={styles.title}>{project.title}</h3>
          <p style={styles.desc}>{project.description}</p>
        </div>
      </div>

     
      <div style={styles.dates}>
        <span>🗓 Start: {new Date(project.startDate).toLocaleString()}</span>
        <span>🏁 End: {new Date(project.endDate).toLocaleString()}</span>
      </div>

      
      <div style={styles.empRow}>
        <span style={styles.empLabel}>Team:</span>
        <div style={styles.avatarGroup}>
          {assignedEmps.map((emp) => (
            <img
              key={emp.id}
              src={emp.profileImage}
              alt={emp.name}
              title={emp.name}
              style={styles.avatar}
            />
          ))}
        </div>
        <span style={styles.empCount}>
          {assignedEmps.length} member{assignedEmps.length !== 1 ? 's' : ''}
        </span>
      </div>

  
      <div style={styles.actions}>
        <button
          onClick={() => navigate(`/projects/${project.id}`)}
          style={styles.viewBtn}
        >
          👁 View
        </button>
        <button onClick={() => onEdit(project)} style={styles.editBtn}>
          ✏️ Edit
        </button>
        <button onClick={() => onDelete(project.id)} style={styles.deleteBtn}>
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
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  topRow: { display: 'flex', gap: '16px', alignItems: 'flex-start' },
  logo: {
    width: '56px',
    height: '56px',
    borderRadius: '10px',
    objectFit: 'cover',
  },
  info: { flex: 1 },
  title: { margin: 0, fontSize: '18px', fontWeight: 'bold' },
  desc: { margin: '4px 0 0', color: '#666', fontSize: '14px' },
  dates: {
    display: 'flex',
    gap: '24px',
    fontSize: '13px',
    color: '#555',
  },
  empRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  empLabel: { fontSize: '13px', color: '#666' },
  avatarGroup: { display: 'flex' },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginLeft: '-6px',
    border: '2px solid white',
  },
  empCount: { fontSize: '12px', color: '#888' },
  actions: { display: 'flex', gap: '8px', marginTop: '4px' },
  viewBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #388e3c',
    color: '#388e3c',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '13px',
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

export default ProjectCard;