"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Box, Card, Spinner, Stack, Text } from "@sanity/ui"
import { useClient } from "sanity"

interface AuthCheckProps {
  children: React.ReactNode
}

export function AuthCheck({ children }: AuthCheckProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const client = useClient({ apiVersion: "2023-05-03" })

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check if the current user has access to the Neon data
        const response = await fetch("/api/sanity/auth-check", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${client.config().token}`,
          },
        })

        if (response.ok) {
          setIsAuthorized(true)
        } else {
          const data = await response.json()
          setError(data.message || "You do not have permission to access this data")
          setIsAuthorized(false)
        }
      } catch (err) {
        console.error("Auth check error:", err)
        setError("Failed to verify permissions. Please check your network connection.")
        setIsAuthorized(false)
      }
    }

    checkAuth()
  }, [client])

  if (isAuthorized === null) {
    return (
      <Box padding={5} style={{ textAlign: "center" }}>
        <Spinner />
        <Text size={2} style={{ marginTop: "1rem" }}>
          Checking permissions...
        </Text>
      </Box>
    )
  }

  if (isAuthorized === false) {
    return (
      <Card padding={4} radius={2} tone="critical">
        <Stack space={3}>
          <Text size={2} weight="semibold">
            Access Denied
          </Text>
          <Text size={1}>{error || "You do not have permission to access this data"}</Text>
        </Stack>
      </Card>
    )
  }

  return <>{children}</>
}
