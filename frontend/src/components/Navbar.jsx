import { useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center">

      <h1 className="text-xl font-bold text-indigo-600">
        TaskFlow 🚀
      </h1>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:opacity-90"
      >
        Logout
      </button>
    </div>
  );
}