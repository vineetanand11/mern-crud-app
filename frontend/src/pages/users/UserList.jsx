import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { getUser, isAdmin,logout, } from "../../utils/auth"; 
import { getCityById } from "../../services/location.services";

function UserList(){
    const [city, setCity] = useState([]);
    const [error, setError] = useState("");
    const currentUser = getUser();

    useEffect(() => {
        if (!currentUser?.city) return;

        const cityId =
        typeof currentUser.city === "object"
            ? currentUser.city._id
            : currentUser.city;

        const fetchCity = async () => {
        try {
            const res = await getCityById(cityId);
            setCity(res.data);
        } catch (err) {
            console.log(err.message);
        }
        };

        fetchCity();
    }, [currentUser?.city]);

    const handleDelete = () => {
        
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f1025] via-[#14162e] to-[#0b0c1a] py-8 px-4">
            <div className="max-w-7xl mx-auto">
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
                                {!currentUser ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-white/60">
                                            No users found
                                        </td>
                                    </tr>
                                ) 
                                    : (
                                        <tr key={currentUser._id} className="hover:bg-white/5 transition">
                                            <td className="px-6 py-4 text-white">{currentUser.name}</td>
                                            <td className="px-6 py-4 text-white/80">{currentUser.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                currentUser.role === 'admin' 
                                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50' 
                                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                                                }`}>
                                                    {currentUser.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-white/80">{currentUser.age || '-'}</td>
                                            <td className="px-6 py-4 text-white/80">{city?.name || '-'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Link
                                                        to={`${currentUser._id}/edit`}
                                                        className="px-4 py-1.5 bg-blue-600/80 text-white text-sm rounded-lg hover:bg-blue-600 transition"
                                                        >
                                                        Edit
                                                    </Link>

                                                {isAdmin() && (
                                                    <button
                                                        onClick={() => handleDelete(currentUser._id)}
                                                        className="px-4 py-1.5 bg-red-600/80 text-white text-sm rounded-lg hover:bg-red-600 transition"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                            </td>
                                        </tr>
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

export default UserList;