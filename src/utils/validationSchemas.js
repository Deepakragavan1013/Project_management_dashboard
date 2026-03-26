import * as yup from 'yup';


export const employeeSchema = (employees, editId = null) =>
  yup.object().shape({
    name: yup
      .string()
      .required('Name is required'),

    position: yup
      .string()
      .required('Position is required'),

    email: yup
      .string()
      .email('Enter a valid email')
      .required('Email is required')
      .test('unique-email', 'Email already exists', function (value) {
     
        return !employees.some(
          (emp) => emp.email === value && emp.id !== editId
        );
      }),

    profileImage: yup
      .string()
      .required('Profile image is required'),
  });

  export const projectSchema = yup.object().shape({
  title: yup
    .string()
    .required('Project title is required'),

  description: yup
    .string()
    .required('Description is required'),

  logo: yup
    .string()
    .required('Project logo is required'),

  startDate: yup
    .string()
    .required('Start date is required'),

  endDate: yup
    .string()
    .required('End date is required')
    .test('date-range', 'End date must be after start date', function (value) {
      const { startDate } = this.parent; 
      if (!startDate || !value) return true;
      return new Date(value) > new Date(startDate);
    }),

  assignedEmployees: yup
    .array()
    .min(1, 'Assign at least one employee')
    .required('Assign at least one employee'),
});

export const taskSchema = yup.object().shape({
  title: yup
    .string()
    .required('Task title is required'),

  description: yup
    .string()
    .required('Description is required'),

  projectId: yup
    .string()
    .required('Please select a project'),

  assignedEmployee: yup
    .string()
    .required('Please assign an employee'),

  eta: yup
    .string()
    .required('ETA is required'),

 
  referenceImages: yup
    .array()
    .default([]),
});
