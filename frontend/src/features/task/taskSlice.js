import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchTasks = createAsyncThunk("task/fetch", async (projectId) => {
  const res = await API.get(`/task/${projectId}`);
  return res.data.data;
});

export const createTask = createAsyncThunk(
  "task/create",
  async ({ projectId, data }) => {
    const res = await API.post(`/task/${projectId}/create`, data);
    return res.data.data;
  },
);

export const updateTask = createAsyncThunk(
  "task/update",
  async ({ taskId, data }) => {
    const res = await API.patch(`/task/${taskId}/update`, data);
    return res.data.data;
  },
);

export const deleteTask = createAsyncThunk("task/delete", async (taskId) => {
  await API.delete(`/task/${taskId}`);
  return taskId;
});

const taskSlice = createSlice({
  name: "task",
  initialState: { tasks: [] },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });

    builder.addCase(createTask.fulfilled, (state, action) => {
      state.tasks.push(action.payload);
    });

    builder.addCase(updateTask.fulfilled, (state, action) => {
      const index = state.tasks.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    });

    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter((t) => t._id !== action.payload);
    });
  },
});

export default taskSlice.reducer;
