import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { taskSchema } from '../utils/validationSchemas';
import { v4 as uuidv4 } from 'uuid';

function TaskForm({ onSubmit, editData, onClose, defaultProjectId }) {
  const projects = useSelector((state) => state.projects);
  const employees = useSelector((state) => state.employees);


  const [selectedProjectId, setSelectedProjectId] = useState(
    editData?.projectId || defaultProjectId || ''
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: editData || {
      referenceImages: [],
      status: 'Need to Do',
      projectId: defaultProjectId || '',
    },
  });

  const referenceImages = watch('referenceImages') || [];

  useEffect(() => {
    if (editData) {
      reset(editData);
      setSelectedProjectId(editData.projectId);
    }
  }, [editData, reset]);

 
  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProjectId(projectId);
    setValue('projectId', projectId, { shouldValidate: true });
    setValue('assignedEmployee', '');
  };

  
  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const availableEmployees = employees.filter((emp) =>
    selectedProject?.assignedEmployees?.includes(emp.id)
  );


  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    
    Promise.all(promises).then((base64Images) => {
      setValue('referenceImages', [
        ...referenceImages,
        ...base64Images,
      ], { shouldValidate: true });
    });
  };


  const removeImage = (index) => {
    const updated = referenceImages.filter((_, i) => i !== index);
    setValue('referenceImages', updated);
  };

  const submitHandler = (data) => {
    const payload = {
      ...data,
      id: editData?.id || uuidv4(),
      status: editData?.status || 'Need to Do',
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} style={styles.form}>
      <h2>{editData ? 'Edit Task' : 'Add Task'}</h2>

  
      <div style={styles.field}>
        <label>Task Title *</label>
        <input
          {...register('title')}
          style={styles.input}
          placeholder="What needs to be done?"
        />
        {errors.title && (
          <span style={styles.error}>{errors.title.message}</span>
        )}
      </div>

      <div style={styles.field}>
        <label>Description *</label>
        <textarea
          {...register('description')}
          style={{ ...styles.input, height: '80px', resize: 'vertical' }}
          placeholder="Describe the task in detail"
        />
        {errors.description && (
          <span style={styles.error}>{errors.description.message}</span>
        )}
      </div>

  
      <div style={styles.field}>
        <label>Select Project *</label>
        <select
          style={styles.input}
          value={selectedProjectId}
          onChange={handleProjectChange}
        >
          <option value="">-- Select a Project --</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        {errors.projectId && (
          <span style={styles.error}>{errors.projectId.message}</span>
        )}
      </div>

      
      <div style={styles.field}>
        <label>Assign Employee *</label>
        {!selectedProjectId ? (
          <p style={styles.hint}>← Select a project first</p>
        ) : availableEmployees.length === 0 ? (
          <p style={styles.hint}>No employees assigned to this project</p>
        ) : (
          <select {...register('assignedEmployee')} style={styles.input}>
            <option value="">-- Select Employee --</option>
            {availableEmployees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} — {emp.position}
              </option>
            ))}
          </select>
        )}
        {errors.assignedEmployee && (
          <span style={styles.error}>{errors.assignedEmployee.message}</span>
        )}
      </div>

  
      <div style={styles.field}>
        <label>ETA (Deadline) *</label>
        <input
          type="datetime-local"
          {...register('eta')}
          style={styles.input}
        />
        {errors.eta && (
          <span style={styles.error}>{errors.eta.message}</span>
        )}
      </div>

  
      <div style={styles.field}>
        <label>Reference Images (optional)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          style={styles.input}
        />

        {/* Image Preview Grid */}
        {referenceImages.length > 0 && (
          <div style={styles.imageGrid}>
            {referenceImages.map((img, index) => (
              <div key={index} style={styles.imageWrapper}>
                <img
                  src={img}
                  alt={`ref-${index}`}
                  style={styles.refImage}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={styles.removeImageBtn}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={styles.buttons}>
        <button type="button" onClick={onClose} style={styles.cancelBtn}>
          Cancel
        </button>
        <button type="submit" style={styles.submitBtn}>
          {editData ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '100%',
  },
  error: { color: 'red', fontSize: '12px' },
  hint: { color: '#999', fontSize: '13px', fontStyle: 'italic' },
  imageGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  imageWrapper: {
    position: 'relative',
    width: '80px',
    height: '80px',
  },
  refImage: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  removeImageBtn: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#d32f2f',
    color: 'white',
    cursor: 'pointer',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '10px 20px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    backgroundColor: 'white',
  },
  submitBtn: {
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#1976d2',
    color: 'white',
    cursor: 'pointer',
  },
};

export default TaskForm;