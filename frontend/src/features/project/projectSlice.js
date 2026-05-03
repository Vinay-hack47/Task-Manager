import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchProjects = createAsyncThunk("project/fetch", async () => {
  const res = await API.get("/project/getProject");
  console.log(res);

  return res.data.data;
});

export const createProject = createAsyncThunk(
  "project/create",
  async (data) => {
    const res = await API.post("/project/createProject", data);
    return res.data.data;
  },
);

export const deleteProject = createAsyncThunk(
  "project/delete",
  async (projectId) => {
    await API.delete(`/project/${projectId}`);
    return projectId;
  },
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.projects = action.payload;
    });

    builder.addCase(createProject.fulfilled, (state, action) => {
      state.projects.push(action.payload);
    });

    builder.addCase(deleteProject.fulfilled, (state, action) => {
      state.projects = state.projects.filter((p) => p._id !== action.payload);
    });
  },
});

export default projectSlice.reducer;
