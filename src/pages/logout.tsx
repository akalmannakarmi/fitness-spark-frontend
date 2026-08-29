import { useRouter } from "next/router";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

export default function Logout() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    logout();
    router.push("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
