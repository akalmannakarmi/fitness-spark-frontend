'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import routes from '@/lib/routes';

type UserData = {
  _id:string;
  username:string;
  email:string;
  groups:string[];
}


const fetchUserData = async (): Promise<UserData> => {
  const res = await axiosInstance.get(routes.user_info)
  return res.data
}


export default function Profile() {
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
  })

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login'); // Or '/' if you prefer
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 min-h-dvh">
        <h1 className="text-4xl font-bold mb-4">My Profile</h1>
        <p className="text-gray-700 mb-8">
          Welcome back! Manage your meal plans, saved recipes, and account settings here.
        </p>

        {user ? (
          <div className="space-y-4 bg-white shadow-md rounded-2xl p-6 border border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="text-lg font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Groups</p>
              <p className="text-lg font-medium">{user.groups.join(', ')}</p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </main>
      <Footer />
    </>
  );
}
