"use client";

import { useAuth } from "../hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("from ProtectedRoute - isAuthenticated", isAuthenticated);
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    console.log("from ProtectedRoute - isLoading", isLoading);
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("from ProtectedRoute - not isAuthenticated", isAuthenticated);
    return null;
  }

  return <>{children}</>;
}
