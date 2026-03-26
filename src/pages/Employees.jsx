import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEmployee, updateEmployee, deleteEmployee } from '../features/employees/employeeSlice';
import EmployeeCard from '../components/EmployeeCard';
import EmployeeForm from '../components/EmployeeForm';
import Modal from '../components/Modal';

function Employees() {
  const employees = useSelector((state) => state.employees);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null); 


  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

 
  const handleEdit = (employee) => {
    setEditData(employee);
    setIsModalOpen(true);
  };

 
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      dispatch(deleteEmployee(id));
    }
  };

 
  const handleFormSubmit = (data) => {
    if (editData) {
      dispatch(updateEmployee(data));
    } else {
      dispatch(addEmployee(data));
    }
  };

  return (
    <div>
   
      <div style={styles.header}>
        <h1 style={styles.title}>Employees ({employees.length})</h1>
        <button onClick={handleAdd} style={styles.addBtn}>
          + Add Employee
        </button>
      </div>

    
      {employees.length === 0 ? (
        <div style={styles.empty}>
          <p>No employees yet. Add your first employee!</p>
        </div>
      ) : (
        <div>
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

   
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <EmployeeForm
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
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
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

export default Employees;