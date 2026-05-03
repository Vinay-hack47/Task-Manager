import { useDispatch } from "react-redux";
import { signup } from "../features/auth/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(signup(form));

    if (res.meta.requestStatus === "fulfilled") {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">

      <Card className="w-[420px] shadow-2xl border-0 bg-white/80 backdrop-blur">
        
        <CardHeader>
          <CardTitle className="text-3xl text-center font-bold">
            Create Account 🚀
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                required
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                required
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500">
              Sign Up
            </Button>

            <p className="text-sm text-center">
              Already have an account?{" "}
              <span
                className="text-indigo-600 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}