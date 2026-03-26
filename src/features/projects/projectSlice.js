import { createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
  name: 'projects',
  initialState: [],
  reducers: {
    addProject: (state, action) => {
      state.push(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    deleteProject: (state, action) => {
      return state.filter(p => p.id !== action.payload);
    },
  },
});

export const { addProject, updateProject, deleteProject } = projectSlice.actions;
export default projectSlice.reducer;