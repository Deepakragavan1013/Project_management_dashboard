import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { projectSchema } from '../utils/validationSchemas';
import { v4 as uuidv4 } from 'uuid';

function ProjectForm({ onSubmit, editData, onClose }) {
  const employees = useSelector((state) => state.employees);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: editData || {
      assignedEmployees: [],
    },
  });

  const logo = watch('logo');
  const assignedEmployees = watch('assignedEmployees') || [];

  useEffect(() => {
    if (editData) reset(editData);
  }, [editData, reset]);

  
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue('logo', reader.result, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const toggleEmployee = (empId) => {
    const current = assignedEmployees || [];
    const updated = current.includes(empId)
      ? current.filter((id) => id !== empId)   
      : [...current, empId];                
    setValue('assignedEmployees', updated, { shouldValidate: true });
  };

  const submitHandler = (data) => {
    const payload = {
      ...data,
      id: editData?.id || uuidv4(),
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} style={styles.form}>
      <h2>{editData ? 'Edit Project' : 'Add Project'}</h2>

      
      <div style={styles.field}>
        <label>Project Title *</label>
        <input
          {...register('title')}
          style={styles.input}
          placeholder="Project name"
        />
        {errors.title && <span style={styles.error}>{errors.title.message}</span>}
      </div>

 
      <div style={styles.field}>
        <label>Description *</label>
        <textarea
          {...register('description')}
          style={{ ...styles.input, height: '80px', resize: 'vertical' }}
          placeholder="What is this project about?"
        />
        {errors.description && (
          <span style={styles.error}>{errors.description.message}</span>
        )}
      </div>


      <div style={styles.field}>
        <label>Project Logo *</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          style={styles.input}
        />
        {logo && (
          <img src={logo} alt="Logo Preview" style={styles.logoPreview} />
        )}
        {errors.logo && <span style={styles.error}>{errors.logo.message}</span>}
      </div>

   
      <div style={styles.dateRow}>
        <div style={{ ...styles.field, flex: 1 }}>
          <label>Start Date & Time *</label>
          <input
            type="datetime-local"
            {...register('startDate')}
            style={styles.input}
          />
          {errors.startDate && (
            <span style={styles.error}>{errors.startDate.message}</span>
          )}
        </div>

        <div style={{ ...styles.field, flex: 1 }}>
          <label>End Date & Time *</label>
          <input
            type="datetime-local"
            {...register('endDate')}
            style={styles.input}
          />
          {errors.endDate && (
            <span style={styles.error}>{errors.endDate.message}</span>
          )}
        </div>
      </div>

   
      <div style={styles.field}>
        <label>Assign Employees * (click to select)</label>

        {employees.length === 0 ? (
          <p style={styles.noEmp}>
            No employees found. Please add employees first.
          </p>
        ) : (
          <div style={styles.empGrid}>
            {employees.map((emp) => {
              const isSelected = assignedEmployees.includes(emp.id);
              return (
                <div
                  key={emp.id}
                  onClick={() => toggleEmployee(emp.id)}
                  style={{
                    ...styles.empChip,
                    ...(isSelected ? styles.empChipSelected : {}),
                  }}
                >
                  <img
                    src={emp.profileImage}
                    alt={emp.name}
                    style={styles.chipAvatar}
                  />
                  <div>
                    <p style={styles.chipName}>{emp.name}</p>
                    <p style={styles.chipPosition}>{emp.position}</p>
                  </div>
                  {isSelected && <span style={styles.checkmark}>✓</span>}
                </div>
              );
            })}
          </div>
        )}
        {errors.assignedEmployees && (
          <span style={styles.error}>{errors.assignedEmployees.message}</span>
        )}
      </div>


      <div style={styles.buttons}>
        <button type="button" onClick={onClose} style={styles.cancelBtn}>
          Cancel
        </button>
        <button type="submit" style={styles.submitBtn}>
          {editData ? 'Update Project' : 'Add Project'}
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
  logoPreview: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover',
    marginTop: '8px',
  },
  dateRow: {
    display: 'flex',
    gap: '12px',
  },
  empGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '8px',
    marginTop: '4px',
  },
  empChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    cursor: 'pointer',
    backgroundColor: 'white',
    position: 'relative',
    transition: 'all 0.2s',
  },
  empChipSelected: {
    border: '2px solid #1976d2',
    backgroundColor: '#e3f2fd',
  },
  chipAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  chipName: { margin: 0, fontSize: '13px', fontWeight: 'bold' },
  chipPosition: { margin: 0, fontSize: '11px', color: '#666' },
  checkmark: {
    position: 'absolute',
    top: '4px',
    right: '6px',
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  noEmp: { color: '#999', fontStyle: 'italic', fontSize: '13px' },
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

export default ProjectForm;