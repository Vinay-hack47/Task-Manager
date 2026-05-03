import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, deleteProject } from "../features/project/projectSlice";
import { useNavigate } from "react-router-dom";
import CreateProjectModal from "../components/CreateProjectModal";
import { FolderKanban, Users, ArrowRight, Trash2, LayoutGrid } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { projects, isLoading } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // ✅ Professional Delete Handler with Confirmation
  const handleDelete = async (e, projectId) => {
    e.stopPropagation(); // Prevents navigating to the project page
    
    if (window.confirm("Are you sure you want to delete this project? All tasks will be lost.")) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
        toast.success("Project deleted successfully");
      } catch (err) {
        console.log(err.message);
        
        toast.error( "Failed to delete project");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Projects</h2>
          <p className="text-slate-500 text-sm">Manage your workspaces</p>
        </div>
        <CreateProjectModal />
      </div>

      {projects.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed">
          <LayoutGrid className="text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-medium">No projects found. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/project/${project._id}`)}
              className="group relative cursor-pointer p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-300"
            >
              {/* ✅ Absolute Delete Button (Visible on Hover) */}
              <button
                onClick={(e) => handleDelete(e, project._id)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                title="Delete Project"
              >
                <Trash2 size={18} />
              </button>

              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <FolderKanban size={24} />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {project.description || "No description provided."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-1 text-xs font-medium">
                  <Users size={14} />
                  <span>{project.members?.length || 1} Members</span>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
