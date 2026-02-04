"use client"

import { useEffect, useState } from "react"
import { Box, Button, Card, Flex, Grid, Spinner, Stack, Text } from "@sanity/ui"
import { ArrowLeftIcon } from "@sanity/icons"
import { useClient } from "sanity"
import { format } from "date-fns"

interface UserDetailsProps {
  userId: string
  onBack: () => void
}

interface Order {
  orderId: string
  total: number
  status: string
  createdAt: string
}

interface Address {
  id: number
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

interface User {
  id: number
  userId: string
  name: string
  email: string
  createdAt: string
  orders: Order[]
  addresses: Address[]
}

export default function UserDetails({ userId, onBack }: UserDetailsProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const client = useClient({ apiVersion: "2023-05-03" })

  useEffect(() => {
    async function fetchUserDetails() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/sanity/users/${userId}`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${client.config().token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch user details: ${response.status}`)
        }

        const data = await response.json()
        setUser(data.user)
      } catch (err) {
        console.error("Error fetching user details:", err)
        setError("Failed to load user details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserDetails()
  }, [userId])

  if (isLoading) {
    return (
      <Flex align="center" justify="center" padding={5}>
        <Spinner />
      </Flex>
    )
  }

  if (error || !user) {
    return (
      <Card padding={4} radius={2} tone="critical">
        <Text>{error || "User not found"}</Text>
        <Button icon={ArrowLeftIcon} mode="ghost" onClick={onBack} text="Back to Users" style={{ marginTop: "1rem" }} />
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FFC107"
      case "processing":
        return "#3498DB"
      case "pending":
        return "#FFC107"
      case "processing":
        return "#3498DB"
      case "shipped":
        return "#9B59B6"
      case "delivered":
        return "#2ECC71"
      case "cancelled":
        return "#E74C3C"
      case "paid":
        return "#2ECC71"
      default:
        return "#95A5A6"
    }
  }

  return (
    <Stack space={4}>
      <Flex align="center">
        <Button icon={ArrowLeftIcon} mode="ghost" onClick={onBack} text="Back to Users" />
        <Box flex={1} marginLeft={3}>
          <Text size={2} weight="semibold">
            {user.name || "No name"}
          </Text>
        </Box>
      </Flex>

      <Grid columns={[1, 1, 2]} gap={4}>
        <Stack space={3}>
          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={1} weight="semibold">
                User Information
              </Text>
              <Grid columns={2} gap={3}>
                <Text size={1}>Name:</Text>
                <Text size={1}>{user.name || "Not provided"}</Text>

                <Text size={1}>Email:</Text>
                <Text size={1}>{user.email}</Text>

                <Text size={1}>Joined:</Text>
                <Text size={1}>{format(new Date(user.createdAt), "PPP")}</Text>

                <Text size={1}>Orders:</Text>
                <Text size={1}>{user.orders.length}</Text>
              </Grid>
            </Stack>
          </Card>

          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={1} weight="semibold">
                Saved Addresses
              </Text>
              {user.addresses.length === 0 ? (
                <Text size={1}>No saved addresses</Text>
              ) : (
                <Stack space={3}>
                  {user.addresses.map((address) => (
                    <Card key={address.id} padding={2} radius={2} tone="default">
                      <Stack space={1}>
                        <Flex align="center" justify="space-between">
                          <Text size={1} weight="semibold">
                            {address.name}
                          </Text>
                          {address.isDefault && (
                            <Box
                              style={{
                                backgroundColor: "#E8F5E9",
                                color: "#2E7D32",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "10px",
                              }}
                            >
                              Default
                            </Box>
                          )}
                        </Flex>
                        <Text size={0}>{address.addressLine1}</Text>
                        {address.addressLine2 && <Text size={0}>{address.addressLine2}</Text>}
                        <Text size={0}>
                          {address.city}, {address.state} {address.postalCode}
                        </Text>
                        <Text size={0}>{address.country}</Text>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              )}
            </Stack>
          </Card>
        </Stack>

        <Stack space={3}>
          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={1} weight="semibold">
                Order History
              </Text>
              {user.orders.length === 0 ? (
                <Text size={1}>No orders yet</Text>
              ) : (
                <Stack space={3}>
                  {user.orders.map((order) => (
                    <Card key={order.orderId} padding={2} radius={2} tone="default">
                      <Grid columns={2} gap={3}>
                        <Stack space={1}>
                          <Text size={1} weight="semibold">
                            Order #{order.orderId}
                          </Text>
                          <Text size={0} muted>
                            {format(new Date(order.createdAt), "PP")}
                          </Text>
                        </Stack>
                        <Stack space={1}>
                          <Text size={1} align="right">
                            £{(order.total / 100).toFixed(2)}
                          </Text>
                          <Flex justify="flex-end">
                            <Box
                              style={{
                                backgroundColor: getStatusColor(order.status),
                                color: "#fff",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "10px",
                              }}
                            >
                              {order.status}
                            </Box>
                          </Flex>
                        </Stack>
                      </Grid>
                    </Card>
                  ))}
                </Stack>
              )}
            </Stack>
          </Card>
        </Stack>
      </Grid>
    </Stack>
  )
}
