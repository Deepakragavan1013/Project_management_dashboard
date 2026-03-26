import { createSlice } from '@reduxjs/toolkit';

const employeeSlice = createSlice({
  name: 'employees',
  initialState: [],
  reducers: {
    addEmployee: (state, action) => {
      state.push(action.payload);
    },
    updateEmployee: (state, action) => {
      const index = state.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    deleteEmployee: (state, action) => {
      return state.filter(emp => emp.id !== action.payload);
    },
  },
});

export const { addEmployee, updateEmployee, deleteEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;