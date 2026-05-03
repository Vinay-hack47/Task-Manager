import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../features/task/taskSlice";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskCard from "../components/TaskCard";
import { Inbox } from "lucide-react"; // Khali box icon ke liye

export default function Project() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { tasks, isLoading } = useSelector((state) => state.task);

  useEffect(() => {
    dispatch(fetchTasks(id));
  }, [id, dispatch]);

  const columns = [
    { label: "Todo", status: "TODO", color: "text-indigo-600" },
    { label: "In Progress", status: "IN_PROGRESS", color: "text-amber-600" },
    { label: "Done", status: "DONE", color: "text-emerald-600" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Board</h2>
          <p className="text-slate-500 text-sm">Manage and track your project tasks</p>
        </div>
        <CreateTaskModal projectId={id} />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {columns.map((column) => {
          const filteredTasks = tasks.filter((t) => t.status === column.status);

          return (
            <div key={column.status} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 min-h-[500px]">
              <div className="flex items-center justify-between mb-5 px-2">
                <h3 className={`font-bold uppercase tracking-wider text-xs ${column.color}`}>
                  {column.label} 
                  <span className="ml-2 bg-white px-2 py-0.5 rounded-full border text-[10px] text-slate-400">
                    {filteredTasks.length}
                  </span>
                </h3>
              </div>

              <div className="space-y-4">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))
                ) : (
                  // ✅ Professional Empty State
                  <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
                    <Inbox className="text-slate-300 mb-2" size={32} />
                    <p className="text-slate-400 text-xs font-medium">No tasks yet</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}







// import { useParams } from "react-router-dom";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTasks } from "../features/task/taskSlice";
// import CreateTaskModal from "../components/CreateTaskModal";
// import TaskCard from "../components/TaskCard";

// export default function Project() {
//   const { id } = useParams();
//   const dispatch = useDispatch();

//   const tasks = useSelector((state) => state.task.tasks);

//   useEffect(() => {
//     dispatch(fetchTasks(id));
//   }, [id]);

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Tasks</h2>
//         <CreateTaskModal projectId={id} />
//       </div>

//       <div className="grid md:grid-cols-3 gap-6">

//         {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
//           <div key={status}>
//             <h3 className="font-semibold mb-3 text-indigo-600">
//               {status.replace("_", " ")}
//             </h3>

//             {tasks
//               .filter((t) => t.status === status)
//               .map((task) => (
//                 <TaskCard key={task._id} task={task} />
//               ))}
//           </div>
//         ))}

//       </div>
//     </div>
//   );
// }