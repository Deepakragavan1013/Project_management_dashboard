import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, updateTask, deleteTask } from '../features/tasks/taskSlice';
// import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';


function Tasks() {
  const tasks = useSelector((state) => state.tasks);
  const projects = useSelector((state) => state.projects);
  const employees = useSelector((state) => state.employees);
  const [viewTask, setViewTask] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

 
  const [filterProjectId, setFilterProjectId] = useState('');

  const filteredTasks = filterProjectId
    ? tasks.filter((t) => t.projectId === filterProjectId)
    : tasks;

  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditData(task);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  const handleFormSubmit = (data) => {
    if (editData) {
      dispatch(updateTask(data));
    } else {
      dispatch(addTask(data));
    }
  };

  const handleView = (task) => {
  setViewTask(task);
  setIsViewOpen(true);
};

 
  const getEmployee = (empId) =>
    employees.find((e) => e.id === empId);

 
  const getProject = (projectId) =>
    projects.find((p) => p.id === projectId);

  return (
    <div>
      {/* Header */}
      <div style={styles.header}>
        <h1>Tasks ({filteredTasks.length})</h1>
        <div style={styles.headerRight}>
          {/* Filter by project */}
          <select
            style={styles.filterSelect}
            value={filterProjectId}
            onChange={(e) => setFilterProjectId(e.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <button onClick={handleAdd} style={styles.addBtn}>
            + Add Task
          </button>
        </div>
        
      </div>

      
      {filteredTasks.length === 0 ? (
        <div style={styles.empty}>
          <p>No tasks found. Create your first task!</p>
        </div>
      ) : (
        <div style={styles.taskList}>
          {filteredTasks.map((task) => {
            const emp = getEmployee(task.assignedEmployee);
            const project = getProject(task.projectId);
            return (
              <div key={task.id} style={styles.taskRow}>
                {/* Task Info */}
                <div style={styles.taskInfo}>
                  <p style={styles.taskTitle}>{task.title}</p>
                  <p style={styles.taskDesc}>{task.description}</p>
                  <div style={styles.taskMeta}>
                    {project && (
                      <span style={styles.projectBadge}>
                        📁 {project.title}
                      </span>
                    )}
                    <span style={styles.etaBadge}>
                      ⏰ {new Date(task.eta).toLocaleDateString()}
                    </span>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: statusColors[task.status],
                    }}>
                      {task.status}
                    </span>
                  </div>
                </div>

                {emp && (
                  <div style={styles.empInfo}>
                    <img
                      src={emp.profileImage}
                      alt={emp.name}
                      style={styles.avatar}
                    />
                    <div>
                      <p style={styles.empName}>{emp.name}</p>
                      <p style={styles.empPos}>{emp.position}</p>
                    </div>
                  </div>
                )}

                
                <div style={styles.actions}>
  
  <button
    onClick={() => handleView(task)}
    style={styles.viewBtn}
  >
    👁️ View
  </button>
  <button
    onClick={() => handleEdit(task)}
    style={styles.editBtn}
  >
    ✏️ Edit
  </button>
  <button
    onClick={() => handleDelete(task.id)}
    style={styles.deleteBtn}
  >
    🗑️ Delete
  </button>
</div>
              </div>
            );
          })}
        </div>
      )}

     <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm
          onSubmit={handleFormSubmit}
          editData={editData}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* ADD THIS — View Task Modal */}
      <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)}>
        {viewTask && (
          <div style={styles.viewContainer}>
            <h2 style={styles.viewTitle}>📋 {viewTask.title}</h2>

            <div style={styles.viewSection}>
              <p style={styles.viewLabel}>Description</p>
              <p style={styles.viewValue}>{viewTask.description}</p>
            </div>

            <div style={styles.viewSection}>
              <p style={styles.viewLabel}>Project</p>
              <p style={styles.viewValue}>
                {getProject(viewTask.projectId)?.title || 'N/A'}
              </p>
            </div>

            <div style={styles.viewSection}>
              <p style={styles.viewLabel}>Assigned Employee</p>
              {getEmployee(viewTask.assignedEmployee) && (
                <div style={styles.empInfoView}>
                  <img
                    src={getEmployee(viewTask.assignedEmployee).profileImage}
                    alt="emp"
                    style={styles.viewAvatar}
                  />
                  <div>
                    <p style={styles.viewValue}>
                      {getEmployee(viewTask.assignedEmployee).name}
                    </p>
                    <p style={styles.viewSub}>
                      {getEmployee(viewTask.assignedEmployee).position}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.viewSection}>
              <p style={styles.viewLabel}>ETA</p>
              <p style={styles.viewValue}>
                {new Date(viewTask.eta).toLocaleString()}
              </p>
            </div>

            <div style={styles.viewSection}>
              <p style={styles.viewLabel}>Status</p>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: statusColors[viewTask.status],
              }}>
                {viewTask.status}
              </span>
            </div>

            {/* Reference Images */}
            {viewTask.referenceImages?.length > 0 && (
              <div style={styles.viewSection}>
                <p style={styles.viewLabel}>
                  Reference Images ({viewTask.referenceImages.length})
                </p>
                <div style={styles.imageGrid}>
                  {viewTask.referenceImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`ref-${i}`}
                      style={styles.viewImage}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setIsViewOpen(false)}
              style={styles.closeViewBtn}
            >
              Close
            </button>
          </div>
        )}
      </Modal>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  headerRight: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  filterSelect: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  addBtn: {
    padding: '10px 20px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
  },
  empty: {
    textAlign: 'center',
    padding: '60px',
    color: '#999',
    backgroundColor: 'white',
    borderRadius: '12px',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  taskRow: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  taskInfo: { flex: 1 },
  taskTitle: {
    margin: '0 0 4px',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  taskDesc: {
    margin: '0 0 8px',
    color: '#666',
    fontSize: '13px',
  },
  taskMeta: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  projectBadge: {
    padding: '3px 10px',
    backgroundColor: '#e3f2fd',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#1976d2',
  },
  etaBadge: {
    padding: '3px 10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#555',
  },
  statusBadge: {
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  empInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: '160px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  empName: { margin: 0, fontWeight: 'bold', fontSize: '14px' },
  empPos: { margin: 0, color: '#888', fontSize: '12px' },
  actions: { display: 'flex', gap: '8px' },
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

  // NEW STYLES BELOW
  viewBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #388e3c',
    color: '#388e3c',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '13px',
  },
  viewContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  viewTitle: {
    margin: '0 0 8px',
    fontSize: '22px',
  },
  viewSection: {
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: '12px',
  },
  viewLabel: {
    margin: '0 0 4px',
    fontSize: '12px',
    color: '#888',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  viewValue: {
    margin: 0,
    fontSize: '15px',
    color: '#222',
  },
  viewSub: {
    margin: 0,
    fontSize: '12px',
    color: '#888',
  },
  empInfoView: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  viewAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  imageGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  viewImage: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  closeViewBtn: {
    padding: '10px 24px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    alignSelf: 'flex-end',
  },
};

export default Tasks;