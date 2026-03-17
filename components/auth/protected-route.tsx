"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, isLoading, router]);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
