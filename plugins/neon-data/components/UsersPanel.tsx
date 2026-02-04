"use client"

import { useEffect, useState } from "react"
import { Box, Button, Card, Flex, Grid, Spinner, Stack, Text, TextInput } from "@sanity/ui"
import { SearchIcon, SyncIcon } from "@sanity/icons"
import { useClient } from "sanity"
import { formatDistanceToNow } from "date-fns"
import UserDetails from "./UserDetails"

interface User {
  id: number
  userId: string
  name: string
  email: string
  createdAt: string
  orderCount?: number
}

export default function UsersPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const client = useClient({ apiVersion: "2023-05-03" })

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/sanity/users", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${client.config().token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`)
      }

      const data = await response.json()
      setUsers(data.users)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to load users. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower)
  })

  if (selectedUser) {
    return <UserDetails userId={selectedUser} onBack={() => setSelectedUser(null)} />
  }

  return (
    <Stack space={4}>
      <Flex justify="space-between" align="center">
        <Text size={2} weight="semibold">
          Users
        </Text>
        <Button icon={SyncIcon} mode="ghost" onClick={fetchUsers} disabled={isLoading} text="Refresh" />
      </Flex>

      <Box>
        <TextInput
          icon={SearchIcon}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
          placeholder="Search users by name or email..."
          value={searchTerm}
        />
      </Box>

      {isLoading ? (
        <Flex align="center" justify="center" padding={5}>
          <Spinner />
        </Flex>
      ) : error ? (
        <Card padding={4} radius={2} tone="critical">
          <Text>{error}</Text>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card padding={4} radius={2} tone="default">
          <Text align="center">No users found</Text>
        </Card>
      ) : (
        <Stack space={2}>
          {filteredUsers.map((user) => (
            <Card
              key={user.userId}
              padding={3}
              radius={2}
              shadow={1}
              onClick={() => setSelectedUser(user.userId)}
              style={{ cursor: "pointer" }}
            >
              <Grid columns={[1, 2, 3]} gap={3}>
                <Stack space={2}>
                  <Text size={1} weight="semibold">
                    {user.name || "No name"}
                  </Text>
                  <Text size={0} muted>
                    {user.email}
                  </Text>
                </Stack>
                <Text size={0} muted>
                  Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </Text>
                <Flex align="center" justify="flex-end">
                  <Box
                    style={{
                      backgroundColor: "#E0E0E0",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      color: "#616161",
                      fontSize: "12px",
                    }}
                  >
                    {user.orderCount || 0} orders
                  </Box>
                </Flex>
              </Grid>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  )
}
