import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      state.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.findIndex(t => t.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    deleteTask: (state, action) => {
      return state.filter(t => t.id !== action.payload);
    },
    updateTaskStatus: (state, action) => {
    
      const task = state.find(t => t.id === action.payload.id);
      if (task) task.status = action.payload.status;
    },
  },
});

export const { addTask, updateTask, deleteTask, updateTaskStatus } = taskSlice.actions;
export default taskSlice.reducer;