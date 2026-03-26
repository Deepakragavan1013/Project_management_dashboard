import React from 'react';
import { useSelector } from 'react-redux';

function TaskCard({ task, onEdit, onDelete, dragHandleProps }) {
  const employees = useSelector((state) => state.employees);

  const assignedEmp = employees.find(
    (emp) => emp.id === task.assignedEmployee
  );


  const isOverdue = new Date(task.eta) < new Date();

  return (
    <div style={styles.card} {...dragHandleProps}>

 
      <p style={styles.title}>{task.title}</p>


      {task.referenceImages?.length > 0 && (
        <img
          src={task.referenceImages[0]}
          alt="reference"
          style={styles.refImage}
        />
      )}

     
      {assignedEmp && (
        <div style={styles.empRow}>
          <img
            src={assignedEmp.profileImage}
            alt={assignedEmp.name}
            style={styles.avatar}
          />
          <span style={styles.empName}>{assignedEmp.name}</span>
        </div>
      )}

    
      <p style={{
        ...styles.eta,
        color: isOverdue ? '#d32f2f' : '#666',
      }}>
        ⏰ {isOverdue ? 'Overdue: ' : 'Due: '}
        {new Date(task.eta).toLocaleDateString()}
      </p>

      {task.referenceImages?.length > 1 && (
        <span style={styles.imageBadge}>
          🖼 {task.referenceImages.length} images
        </span>
      )}

  
      <div style={styles.actions}>
        <button onClick={() => onEdit(task)} style={styles.editBtn}>
          ✏️
        </button>
        <button onClick={() => onDelete(task.id)} style={styles.deleteBtn}>
          🗑️
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '14px',
    marginBottom: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    cursor: 'grab',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  title: {
    margin: 0,
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#222',
  },
  refImage: {
    width: '100%',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '6px',
  },
  empRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  avatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  empName: {
    fontSize: '12px',
    color: '#444',
  },
  eta: {
    fontSize: '12px',
    margin: 0,
  },
  imageBadge: {
    fontSize: '11px',
    color: '#888',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '6px',
    marginTop: '4px',
  },
  editBtn: {
    padding: '4px 8px',
    border: '1px solid #1976d2',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '13px',
  },
  deleteBtn: {
    padding: '4px 8px',
    border: '1px solid #d32f2f',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '13px',
  },
};

export default TaskCard;