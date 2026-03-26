import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProjectDetail() {
  const { id } = useParams();      
  const navigate = useNavigate();
  const project = useSelector((state) =>
    state.projects.find((p) => p.id === id)
  );
  const employees = useSelector((state) => state.employees);
  const tasks = useSelector((state) =>
    state.tasks.filter((t) => t.projectId === id)
  );

  if (!project) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Project not found.</p>
        <button onClick={() => navigate('/projects')}>← Back</button>
      </div>
    );
  }

  const assignedEmps = employees.filter((e) =>
    project.assignedEmployees?.includes(e.id)
  );

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/projects')} style={styles.backBtn}>
        ← Back to Projects
      </button>

    
      <div style={styles.header}>
        <img src={project.logo} alt={project.title} style={styles.logo} />
        <div>
          <h1>{project.title}</h1>
          <p style={styles.desc}>{project.description}</p>
          <p style={styles.date}>
            📅 {new Date(project.startDate).toLocaleString()} →{' '}
            {new Date(project.endDate).toLocaleString()}
          </p>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Team Members ({assignedEmps.length})</h2>
        <div style={styles.empGrid}>
          {assignedEmps.map((emp) => (
            <div key={emp.id} style={styles.empCard}>
              <img src={emp.profileImage} alt={emp.name} style={styles.avatar} />
              <p style={styles.empName}>{emp.name}</p>
              <p style={styles.empPos}>{emp.position}</p>
            </div>
          ))}
        </div>
      </div>

    
      <div style={styles.section}>
        <h2>Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p style={{ color: '#999' }}>No tasks for this project yet.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} style={styles.taskRow}>
              <span>{task.title}</span>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: statusColors[task.status] || '#ccc',
              }}>
                {task.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const statusColors = {
  'Need to Do': '#90caf9',
  'In Progress': '#ffe082',
  'Need for Test': '#ce93d8',
  'Completed': '#a5d6a7',
  'Re-open': '#ef9a9a',
};

const styles = {
  container: { maxWidth: '800px', margin: '0 auto' },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#1976d2',
    cursor: 'pointer',
    fontSize: '15px',
    marginBottom: '20px',
    padding: 0,
  },
  header: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  logo: { width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' },
  desc: { color: '#666', marginTop: '4px' },
  date: { color: '#888', fontSize: '13px', marginTop: '8px' },
  section: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  empGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginTop: '16px',
  },
  empCard: {
    textAlign: 'center',
    padding: '12px',
    border: '1px solid #eee',
    borderRadius: '10px',
    width: '100px',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  empName: { margin: '6px 0 2px', fontSize: '13px', fontWeight: 'bold' },
  empPos: { margin: 0, fontSize: '11px', color: '#888' },
  taskRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #f0f0f0',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
};

export default ProjectDetail;