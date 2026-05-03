import { useDispatch } from "react-redux";
import { updateTask, deleteTask } from "../features/task/taskSlice";
import EditTaskModal from "./EditTaskModal";
import { Calendar, Trash2, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns"; // Professional date formatting library
import { toast } from "sonner";

export default function TaskCard({ task }) {
  const dispatch = useDispatch();

  // 1. Precise Logic for States
  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== "DONE";

  const statusColors = {
    TODO: "bg-slate-100 text-slate-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    DONE: "bg-emerald-100 text-emerald-700",
  };

  const priorityColors = {
    Low: "border-emerald-200 text-emerald-700",
    Medium: "border-amber-200 text-amber-700",
    High: "border-rose-200 text-rose-700",
  };

  // 2. Actions
  const handleStatusChange = (e) => {
    e.stopPropagation(); // Card click se bachne ke liye
    const statusMap = { TODO: "IN_PROGRESS", IN_PROGRESS: "DONE", DONE: "TODO" };
    dispatch(updateTask({ taskId: task._id, data: { status: statusMap[task.status] } }));
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this task?")) {
      const result = await dispatch(deleteTask(task._id));

      if (deleteTask.fulfilled.match(result)) {
        toast.success("Task deleted successfully");
      }
      else {
        toast.error(result.payload || "Failed to create project");
      }
    }
  };

  return (
    <div
      className={`group relative p-5 rounded-2xl border transition-all duration-200 hover:shadow-lg bg-white
      ${isOverdue ? "border-rose-200 bg-rose-50/30" : "border-slate-200"}`}
    >
      {/* Header: Priority & Actions */}
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <EditTaskModal task={task} />
          <button onClick={handleDelete} className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className={`font-medium text-slate-800 leading-tight ${task.status === "DONE" && "line-through text-slate-400"}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-slate-500 line-clamp-2">{task.description}</p>
        )}
      </div>

      {/* Footer: Date & Status Toggle */}
      <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
        <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? "text-rose-600" : "text-slate-400"}`}>
          <Calendar size={14} />
          <span>{task.deadline ? format(new Date(task.deadline), "MMM d") : "No date"}</span>
        </div>

        <button
          onClick={handleStatusChange}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
          ${statusColors[task.status]} hover:brightness-95`}
        >
          {task.status === "DONE" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
          {task.status.replace("_", " ")}
        </button>
      </div>
    </div>
  );
}
