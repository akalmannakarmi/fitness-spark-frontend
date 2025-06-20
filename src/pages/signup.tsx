import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { AxiosResponse } from "axios";
import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import routes from "@/lib/routes";

type SignupInput = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Signup() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInput>();

  const signupMutation = useMutation<AxiosResponse<object>, Error, SignupInput>({
    mutationFn: (data) =>
      axiosInstance.post(routes.signup_url, {
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    onSuccess: () => {
      router.push("/login");
    },
    onError: () => {
      // You could show a global error message if needed
    },
  });

  const onSubmit = (data: SignupInput) => {
    signupMutation.mutate(data);
  };

  const password = watch("password");

  return (
    <>
      <Navbar />
      <main className="flex flex-col justify-center items-center min-h-dvh px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Username */}
            <div>
              <input
                type="text"
                placeholder="Username"
                className="w-full border border-gray-300 rounded px-4 py-2"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded px-4 py-2"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded px-4 py-2"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                    message:
                      "Password must be at least 8 characters, include a number and a special character",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border border-gray-300 rounded px-4 py-2"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Signing up..." : "Sign Up"}
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
