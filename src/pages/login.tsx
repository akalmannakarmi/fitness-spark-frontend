import { useState } from 'react'
import { AxiosResponse } from 'axios'
import axiosInstance from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { routes } from '@/lib/routes'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

type LoginInput = {
  username: string
  password: string
}

export default function Login() {
  const router = useRouter()
  const {login,logout} = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const loginMutation = useMutation<AxiosResponse<object>, Error, LoginInput>({
    mutationFn: (data: LoginInput) =>
      axiosInstance.post(routes.login_url, data),
    onSuccess: (res) => {
      const data = res.data as {access_token:string,admin:boolean}
      const token = data.access_token;
      const admin = data.admin;
      login(token,admin);

      router.push('/')
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ username, password })
  }

  return (
    <>
      <Navbar />
      <main onLoad={logout} className="flex flex-col justify-center items-center min-h-dvh px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
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
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {loginMutation.isError && (
            <p className="mt-2 text-center text-sm text-red-500">
              Login failed. Please check your credentials.
            </p>
          )}

          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up instead
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
