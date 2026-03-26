import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd';
import { updateTaskStatus } from '../features/tasks/taskSlice';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';
import { addTask, updateTask, deleteTask } from '../features/tasks/taskSlice';

// These are your 5 fixed columns — order matters
const COLUMNS = [
  { id: 'Need to Do',     color: '#e3f2fd', headerColor: '#1976d2' },
  { id: 'In Progress',    color: '#fffde7', headerColor: '#f9a825' },
  { id: 'Need for Test',  color: '#f3e5f5', headerColor: '#7b1fa2' },
  { id: 'Completed',      color: '#e8f5e9', headerColor: '#388e3c' },
  { id: 'Re-open',        color: '#fce4ec', headerColor: '#c62828' },
];

function Dashboard() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);
  const projects = useSelector((state) => state.projects);


  const [filterProjectId, setFilterProjectId] = useState('');


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

 
  const filteredTasks = filterProjectId
    ? tasks.filter((t) => t.projectId === filterProjectId)
    : tasks;


  const getColumnTasks = (columnId) =>
    filteredTasks.filter((t) => t.status === columnId);


  const onDragEnd = (result) => {
    const { draggableId, destination, source } = result;

    
    if (!destination) return;

  
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

  
    dispatch(updateTaskStatus({
      id: draggableId,
      status: destination.droppableId,
    }));
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

  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editData) {
      dispatch(updateTask(data));
    } else {
      dispatch(addTask(data));
    }
  };

  return (
    <div style={styles.container}>

  
      <div style={styles.header}>
        <h1 style={styles.title}>📋 Dashboard</h1>
        <div style={styles.headerRight}>

         
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
      

   {/* Summary Row - Overall counts */}
<div style={styles.summaryRow}>
  <div style={styles.summaryCard}>
    <p style={styles.summaryNum}>{projects.length}</p>
    <p style={styles.summaryLabel}>Total Projects</p>
  </div>
  <div style={styles.summaryCard}>
    <p style={styles.summaryNum}>{tasks.length}</p>
    <p style={styles.summaryLabel}>Total Tasks</p>
  </div>
  <div style={styles.summaryCard}>
    <p style={{ ...styles.summaryNum, color: '#388e3c' }}>
      {tasks.filter(t => t.status === 'Completed').length}
    </p>
    <p style={styles.summaryLabel}>Completed</p>
  </div>
  <div style={styles.summaryCard}>
    <p style={{ ...styles.summaryNum, color: '#d32f2f' }}>
      {tasks.filter(t => new Date(t.eta) < new Date()
        && t.status !== 'Completed').length}
    </p>
    <p style={styles.summaryLabel}>Overdue</p>
  </div>
</div>


<div style={styles.statsRow}>
  {COLUMNS.map((col) => (
    <div key={col.id} style={styles.statCard}>
      <p style={{ ...styles.statNum, color: col.headerColor }}>
        {getColumnTasks(col.id).length}
      </p>
      <p style={styles.statLabel}>{col.id}</p>
    </div>
  ))}
</div>

     
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={styles.board}>
          {COLUMNS.map((col) => (
            <div key={col.id} style={styles.columnWrapper}>

              
              <div style={{
                ...styles.columnHeader,
                backgroundColor: col.headerColor,
              }}>
                <span style={styles.columnTitle}>{col.id}</span>
                <span style={styles.columnCount}>
                  {getColumnTasks(col.id).length}
                </span>
              </div>

            
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      ...styles.column,
                      backgroundColor: snapshot.isDraggingOver
                        ? col.color        
                        : '#f8f9fa',
                    }}
                  >
                    {getColumnTasks(col.id).length === 0 && (
                      <div style={styles.emptyColumn}>
                        <p>No tasks</p>
                        <p style={styles.dropHint}>Drop here</p>
                      </div>
                    )}

                    {getColumnTasks(col.id).map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.85 : 1,
                              transform: snapshot.isDragging
                                ? `${provided.draggableProps.style?.transform} rotate(2deg)`
                                : provided.draggableProps.style?.transform,
                            }}
                          >
                            <TaskCard
                              task={task}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {/* Required — placeholder keeps column height while dragging */}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

     
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm
          onSubmit={handleFormSubmit}
          editData={editData}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

const styles = {
  container: {
    padding: '0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 'bold',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  filterSelect: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  addBtn: {
    padding: '10px 20px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
  },
  statsRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '16px',
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
  },
  statNum: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0,
  },
  statLabel: {
    fontSize: '11px',
    color: '#888',
    margin: '4px 0 0',
  },
  board: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',       // horizontal scroll on small screens
    paddingBottom: '16px',
    alignItems: 'flex-start',
  },
  columnWrapper: {
    minWidth: '220px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  columnHeader: {
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columnTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  columnCount: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    color: 'white',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  column: {
    minHeight: '400px',
    padding: '10px',
    transition: 'background-color 0.2s ease',
    flex: 1,
  },
  emptyColumn: {
    textAlign: 'center',
    padding: '30px 10px',
    color: '#bbb',
    fontSize: '13px',
  },
  dropHint: {
    fontSize: '11px',
    color: '#ddd',
    marginTop: '4px',
  },
  // Add to styles object
summaryRow: {
  display: 'flex',
  gap: '16px',
  marginBottom: '20px',
},
summaryCard: {
  flex: 1,
  backgroundColor: 'white',
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center',
  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
},
summaryNum: {
  fontSize: '32px',
  fontWeight: 'bold',
  margin: 0,
  color: '#1976d2',
},
summaryLabel: {
  fontSize: '13px',
  color: '#888',
  margin: '6px 0 0',
},
};

export default Dashboard;
