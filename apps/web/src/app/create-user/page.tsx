"use client"

import { useForm } from "react-hook-form"
import { AxiosError } from "axios"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  createUserSchema,
  type RegisterSchema
} from "@repo/shared"

import { useCreateUser } from "@/hooks/user/useCreateUser"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent
} from "@/components/ui/card"

export default function CreateUserPage() {
  const createUserMutation =
    useCreateUser()

  const form =
    useForm<RegisterSchema>({
      resolver:
        zodResolver(createUserSchema),

      defaultValues: {
        email: "",
        name: "",
        username: "",
        password: "",
        branchId:"7b22315a-f169-46df-ad09-27851de3635a",
        roleIds: ["a81e6815-5c49-4523-a9a7-aa1eb83cf48a"]
      }
    })

  const onSubmit = (
    data: RegisterSchema
  ) => {
    createUserMutation.mutate(data, {
      onSuccess: () => {
        toast.success(
          "User created successfully"
        )

        form.reset()
      },

      onError: (error) => {
        const axiosError = error as AxiosError<{
          message: string
        }>
      
        toast.error(
          axiosError.response?.data?.message ??
            "Something went wrong"
        )
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[450px]">
        <CardContent className="p-6">
          <form
            onSubmit={form.handleSubmit(
              onSubmit
            )}
            className="space-y-4"
          >
            <Input
              placeholder="Email"
              {...form.register("email")}
            />

            <Input
              placeholder="Name"
              {...form.register("name")}
            />

            <Input
              placeholder="Username"
              {...form.register(
                "username"
              )}
            />

            <Input
              type="password"
              placeholder="Password"
              {...form.register(
                "password"
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={
                createUserMutation.isPending
              }
            >
              {createUserMutation.isPending
                ? "Creating..."
                : "Create User"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}