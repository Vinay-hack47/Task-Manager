import { useState } from "react";
import { useDispatch } from "react-redux";
import { createProject } from "../features/project/projectSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function CreateProjectModal() {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); 

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async () => {
    setLoading(true);

    const result = await dispatch(createProject(form));

    setLoading(false);

    if (createProject.fulfilled.match(result)) {
      setForm({ name: "", description: "" });
      setOpen(false); 

      toast.success("Project created successfully");
    }
    else{
      toast.error(result.payload || "Failed to create project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}> 
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          + New Project
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-gradient-to-br from-white to-indigo-50 backdrop-blur-xl"> 
        <DialogHeader>
          <DialogTitle className="text-indigo-600 font-semibold">
            Create Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input
            placeholder="Project name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"} 
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}