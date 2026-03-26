import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProject, updateProject, deleteProject } from '../features/projects/projectSlice';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import Modal from '../components/Modal';

function Projects() {
  const projects = useSelector((state) => state.projects);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditData(project);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this project? Related tasks will still exist.')) {
      dispatch(deleteProject(id));
    }
  };

  const handleFormSubmit = (data) => {
    if (editData) {
      dispatch(updateProject(data));
    } else {
      dispatch(addProject(data));
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h1>Projects ({projects.length})</h1>
        <button onClick={handleAdd} style={styles.addBtn}>
          + Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div style={styles.empty}>
          <p>No projects yet. Create your first project!</p>
        </div>
      ) : (
        projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProjectForm
          onSubmit={handleFormSubmit}
          editData={editData}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
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
};

export default Projects;
