import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { employeeSchema } from '../utils/validationSchemas';
import { v4 as uuidv4 } from 'uuid';

function EmployeeForm({ onSubmit, editData, onClose }) {
  const employees = useSelector((state) => state.employees);

  // if editData exists, we're editing — pass editId to skip self email check
  const schema = employeeSchema(employees, editData?.id);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: editData || {},
  });

  // watch the profileImage field to show preview
  const profileImage = watch('profileImage');

  // if editing, pre-fill the form
  useEffect(() => {
    if (editData) reset(editData);
  }, [editData, reset]);

  // convert image file to base64 string
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setValue('profileImage', reader.result, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const submitHandler = (data) => {
    const payload = {
      ...data,
      id: editData?.id || uuidv4(), // reuse id on edit, create new on add
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} style={styles.form}>
      <h2>{editData ? 'Edit Employee' : 'Add Employee'}</h2>

      {/* Name */}
      <div style={styles.field}>
        <label>Name *</label>
        <input {...register('name')} style={styles.input} placeholder="Full Name" />
        {errors.name && <span style={styles.error}>{errors.name.message}</span>}
      </div>

      {/* Position */}
      <div style={styles.field}>
        <label>Position *</label>
        <input {...register('position')} style={styles.input} placeholder="Job Title" />
        {errors.position && <span style={styles.error}>{errors.position.message}</span>}
      </div>

      {/* Email */}
      <div style={styles.field}>
        <label>Official Email *</label>
        <input {...register('email')} style={styles.input} placeholder="email@company.com" />
        {errors.email && <span style={styles.error}>{errors.email.message}</span>}
      </div>

      {/* Profile Image */}
      <div style={styles.field}>
        <label>Profile Image *</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.input}
        />
        {/* Show preview if image exists */}
        {profileImage && (
          <img
            src={profileImage}
            alt="Preview"
            style={styles.preview}
          />
        )}
        {errors.profileImage && (
          <span style={styles.error}>{errors.profileImage.message}</span>
        )}
      </div>

      {/* Buttons */}
      <div style={styles.buttons}>
        <button type="button" onClick={onClose} style={styles.cancelBtn}>
          Cancel
        </button>
        <button type="submit" style={styles.submitBtn}>
          {editData ? 'Update' : 'Add Employee'}
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  error: {
    color: 'red',
    fontSize: '12px',
  },
  preview: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginTop: '8px',
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

export default EmployeeForm;