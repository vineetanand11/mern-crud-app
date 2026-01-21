import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken, getUser, logout, isAdmin } from "../../utils/auth";
import { getAllUsers, deleteUser } from "../../services/user.services";

function AdminDashboard(){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const currentUser = getUser();

    useEffect(() => {
        getAllUsers()
            .then((res) => setUsers(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }
        try {
            setError("");
            setSuccess("");
            const res = await deleteUser(userId);

            // Remove deleted user from state
            setUsers(users.filter(user => user._id !== userId));
            
            // Show success message
            setSuccess("User deleted successfully!");
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (error) {
            console.error(error.response?.data || error.message);
            setError(error.response?.data?.message || "Failed to delete user");
            
            // Clear error message after 5 seconds
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1025] via-[#14162e] to-[#0b0c1a] py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header with User Info and Logout */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
                        <p className="text-white/60">
                            Welcome, <span className="text-purple-400 font-semibold">{currentUser?.name}</span>
                            {isAdmin() && <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/50">Admin</span>}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={logout}
                            className="px-6 py-2.5 bg-red-600/80 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50">
                            <p className="text-red-400">{error}</p>
                        </div>
                    )}
                    
                </div>
                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50">
                        <p className="text-green-300">{success}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}
                <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Age</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">City</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/90">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-white/60">
                                            No users found
                                        </td>
                                    </tr>
                                ) 
                                    : (
                                        users.map((user) => (
                                            <tr key={user._id} className="hover:bg-white/5 transition">
                                                <td className="px-6 py-4 text-white">{user.name}</td>
                                                <td className="px-6 py-4 text-white/80">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    user.role === 'admin' 
                                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50' 
                                                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-white/80">{user.age || '-'}</td>
                                                <td className="px-6 py-4 text-white/80">{user.city?.name || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <Link
                                                            to={`/users/${user._id}/edit`}
                                                            className="px-4 py-1.5 bg-blue-600/80 text-white text-sm rounded-lg hover:bg-blue-600 transition"
                                                            >
                                                            Edit
                                                        </Link>

                                                    {isAdmin() && (
                                                        <button
                                                            onClick={() => handleDelete(user._id)}
                                                            className="px-4 py-1.5 bg-red-600/80 text-white text-sm rounded-lg hover:bg-red-600 transition"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;