import * as React from "react"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, User } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Separator } from "@workspace/ui/components/separator"

import { authClient } from "@/lib/auth-client"
import { getSessionFn } from "@/lib/auth-utils"

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters long"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const Route = createFileRoute("/account")({
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: "/account",
        },
      })
    }
    return { session }
  },
  component: AccountPage,
})

function AccountPage() {
  const { session } = Route.useRouteContext()
  const [loading, setLoading] = React.useState(false)
  const user = session.user

  const profileForm = useForm({
    defaultValues: {
      name: user.name || "",
    },
    validators: {
      onChange: profileSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true)
      const { error } = await authClient.updateUser({
        name: value.name,
      })

      if (error) {
        toast.error(error.message || "Failed to update profile")
      } else {
        toast.success("Profile updated successfully")
      }
      setLoading(false)
    },
  })

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onChange: passwordSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true)
      const { error } = await authClient.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      })

      if (error) {
        toast.error(error.message || "Failed to change password")
      } else {
        toast.success("Password changed successfully")
        passwordForm.reset()
      }
      setLoading(false)
    },
  })

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile and account preferences.</p>
        </div>

        <Separator />

        <div className="grid gap-8">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="text-2xl">
                    {user.name.charAt(0) || <User className="h-10 w-10" />}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  profileForm.handleSubmit()
                }}
                className="space-y-4"
              >
                <profileForm.Field
                  name="name"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Display Name</FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError />
                    </Field>
                  )}
                />
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Change your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  passwordForm.handleSubmit()
                }}
                className="space-y-4"
              >
                <passwordForm.Field
                  name="currentPassword"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
                      <Input
                        id={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError />
                    </Field>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <passwordForm.Field
                    name="newPassword"
                    children={(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                        <Input
                          id={field.name}
                          type="password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError />
                      </Field>
                    )}
                  />
                  <passwordForm.Field
                    name="confirmPassword"
                    children={(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Confirm New Password</FieldLabel>
                        <Input
                          id={field.name}
                          type="password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError />
                      </Field>
                    )}
                  />
                </div>
                <Button type="submit" variant="secondary" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Permanently delete your account and all data.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                    const { error } = await authClient.deleteUser()
                    if (error) {
                      toast.error(error.message || "Failed to delete account")
                    } else {
                      window.location.href = "/"
                    }
                  }
                }}
              >
                Delete Account
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
