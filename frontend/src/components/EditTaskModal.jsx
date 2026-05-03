import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../features/task/taskSlice";

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

export default function EditTaskModal({ task }) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: task.title,
    priority: task.priority,
  });

  const handleUpdate = async () => {
    setLoading(true);

    const result = await dispatch(updateTask({
      taskId: task._id,
      data: form,
    }));

    setLoading(false)

    if (updateTask.fulfilled.match(result)) {
      setOpen(false);

      toast.success("Task updated successfully");
    }
    else {
      toast.error(result.payload || "Failed to create project");
    }

  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>

      <DialogContent className="bg-gradient-to-br from-white to-indigo-50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <Input
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <select
            className="w-full border p-2 rounded"
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <Button onClick={handleUpdate} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500"
            disabled={loading}>
            {loading ? "Editing task..." : "Edit Task"}           </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}