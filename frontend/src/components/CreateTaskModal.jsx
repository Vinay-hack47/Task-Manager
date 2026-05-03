

import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTask } from "../features/task/taskSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CreateTaskModal({ projectId }) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    status: "TODO",
  });

  const handleSubmit = async () => {
    setLoading(true);

    const result = await dispatch(createTask({ projectId, data: form }));

    setLoading(false)

    if(createTask.fulfilled.match(result)){
      setForm({ title: "", status: "TODO" });
      setOpen(false);

      toast.success("Task created successfully");
    }
    else{
      toast.error(result.payload || "Failed to create project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500">
          + Add Task
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-gradient-to-br from-white to-indigo-50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Task title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <select
            className="w-full border p-2 rounded"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

          <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500"
          disabled={loading}>
            {loading ? "Creating task..." : "Create Task"} 
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}