import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useEffect } from 'react';

export default function Logout() {
  const {logout} = useAuth();
  const router = useRouter();

  useEffect(()=>{
    logout();
    router.push("/login");
  })

  return (
    <>
    </>
  )
}
