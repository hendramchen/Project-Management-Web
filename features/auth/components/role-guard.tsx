"use client";

import { useAuth } from "../hooks/use-auth";
import { UserRole } from "@/types";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
