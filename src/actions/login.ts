"use server";

type LoginState = {
  success: boolean;
  message?: string;
} | null;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Login failed" };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || "Unexpected error" };
  }
}
