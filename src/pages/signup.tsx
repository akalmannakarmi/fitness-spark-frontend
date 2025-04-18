import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AxiosResponse } from 'axios'
import axiosInstance from '@/lib/axios'
import { useMutation } from "@tanstack/react-query";
import routes from "@/lib/routes";
import { toast } from "sonner";

type SignupInput = {
  username: string
  email: string
  password: string
}

export default function Signup() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const signupMutation = useMutation<AxiosResponse<any>, Error, SignupInput>({
    mutationFn: (data: SignupInput) => 
      axiosInstance.post(routes.signup_url,data),
    onSuccess: (res) => {
      router.push('/login')
      toast.success("Signup Successful!")
    },
    onError: (error) => {
      console.error('Signup Failed',error)
      toast.error("Signup Failed!")
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signupMutation.mutate({ username, email, password })
  }

  return (
    <>
      <Navbar />
      <main className="flex flex-col justify-center items-center min-h-dvh px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
