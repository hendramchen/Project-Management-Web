"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  ChangePasswordInput,
  useAuth,
} from "@/features/auth";
import { toast } from "sonner";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const {
    changePassword,
    isChangingPassword,
    resetPassword,
    isResettingPassword,
  } = useAuth();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      await changePassword(data);
      toast.success("Password changed successfully");
      reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to change password",
      );
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword();
      toast.success("Password has been reset to the default password");
      setShowResetConfirm(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <div className="grid gap-6 max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password by entering your current password and a new
              one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  {...register("currentPassword")}
                />
                {errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Confirm new password"
                  {...register("confirmNewPassword")}
                />
                {errors.confirmNewPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmNewPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Forgot your current password? Reset it to the default password (
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                password12345
              </code>
              ).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showResetConfirm ? (
              <Button
                variant="destructive"
                onClick={() => setShowResetConfirm(true)}
              >
                Reset Password
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-destructive font-medium">
                  Are you sure? Your password will be reset to the default.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleResetPassword}
                    disabled={isResettingPassword}
                  >
                    {isResettingPassword ? "Resetting..." : "Yes, Reset"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
