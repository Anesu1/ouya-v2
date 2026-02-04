"use client"

import { useEffect, useState } from "react"
import { Box, Button, Card, Flex, Grid, Select, Spinner, Stack, Text } from "@sanity/ui"
import { ArrowLeftIcon } from "@sanity/icons"
import { useClient } from "sanity"
import { format } from "date-fns"

interface OrderDetailsProps {
  orderId: string
  onBack: () => void
}

interface OrderItem {
  id: number
  title: string
  quantity: number
  price: number
  image: string
}

interface Order {
  id: number
  orderId: string
  userId: string
  total: number
  status: string
  createdAt: string
  shippingCarrier: string
  shippingCost: number
  shippingName: string
  shippingAddressLine1: string
  shippingAddressLine2: string | null
  shippingCity: string
  shippingState: string
  shippingPostalCode: string
  shippingCountry: string
  shippingPhone: string
  items: OrderItem[]
  user?: {
    name: string
    email: string
  }
}

export default function OrderDetails({ orderId, onBack }: OrderDetailsProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newStatus, setNewStatus] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)
  const client = useClient({ apiVersion: "2023-05-03" })

  useEffect(() => {
    async function fetchOrderDetails() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/sanity/orders/${orderId}`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${client.config().token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch order details: ${response.status}`)
        }

        const data = await response.json()
        setOrder(data.order)
        setNewStatus(data.order.status)
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError("Failed to load order details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  const updateOrderStatus = async () => {
    if (!order || newStatus === order.status) return

    setIsUpdating(true)

    try {
      const response = await fetch(`/api/sanity/orders/${orderId}/update-status`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${client.config().token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update order status: ${response.status}`)
      }

      // Update local state
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
    } catch (err) {
      console.error("Error updating order status:", err)
      setError("Failed to update order status. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <Flex align="center" justify="center" padding={5}>
        <Spinner />
      </Flex>
    )
  }

  if (error || !order) {
    return (
      <Card padding={4} radius={2} tone="critical">
        <Text>{error || "Order not found"}</Text>
        <Button
          icon={ArrowLeftIcon}
          mode="ghost"
          onClick={onBack}
          text="Back to Orders"
          style={{ marginTop: "1rem" }}
        />
      </Card>
    )
  }

  return (
    <Stack space={4}>
      <Flex align="center">
        <Button icon={ArrowLeftIcon} mode="ghost" onClick={onBack} text="Back to Orders" />
        <Box flex={1} marginLeft={3}>
          <Text size={2} weight="semibold">
            Order #{order.orderId}
          </Text>
        </Box>
      </Flex>

      <Grid columns={[1, 1, 2]} gap={4}>
        <Stack space={3}>
          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={1} weight="semibold">
                Order Summary
              </Text>
              <Grid columns={2} gap={3}>
                <Text size={1}>Date:</Text>
                <Text size={1}>{format(new Date(order.createdAt), "PPP")}</Text>

                <Text size={1}>Status:</Text>
                <Text size={1}>{order.status}</Text>

                <Text size={1}>Total:</Text>
                <Text size={1} weight="semibold">
                  £{(order.total / 100).toFixed(2)}
                </Text>

                <Text size={1}>Shipping:</Text>
                <Text size={1}>£{(order.shippingCost / 100).toFixed(2)}</Text>

                <Text size={1}>Carrier:</Text>
                <Text size={1}>{order.shippingCarrier || "Not specified"}</Text>
              </Grid>
            </Stack>
          </Card>

          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={1} weight="semibold">
                Customer Information
              </Text>
              {order.user ? (
                <Grid columns={2} gap={3}>
                  <Text size={1}>Name:</Text>
                  <Text size={1}>{order.user.name}</Text>

                  <Text size={1}>Email:</Text>
                  <Text size={1}>{order.user.email}</Text>

                  <Text size={1}>Phone:</Text>
                  <Text size={1}>{order.shippingPhone}</Text>
                </Grid>
              ) : (
                <Text size={1}>Customer information not available</Text>
              )}
            </Stack>
          </Card>

          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={1} weight="semibold">
                Shipping Address
              </Text>
              <Stack space={1}>
                <Text size={1}>{order.shippingName}</Text>
                <Text size={1}>{order.shippingAddressLine1}</Text>
                {order.shippingAddressLine2 && <Text size={1}>{order.shippingAddressLine2}</Text>}
                <Text size={1}>
                  {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
                </Text>
                <Text size={1}>{order.shippingCountry}</Text>
              </Stack>
            </Stack>
          </Card>

          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={1} weight="semibold">
                Update Status
              </Text>
              <Flex>
                <Box flex={1} marginRight={2}>
                  <Select value={newStatus} onChange={(event) => setNewStatus(event.currentTarget.value)}>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                </Box>
                <Button
                  text="Update"
                  onClick={updateOrderStatus}
                  disabled={isUpdating || newStatus === order.status}
                  loading={isUpdating}
                />
              </Flex>
            </Stack>
          </Card>
        </Stack>

        <Stack space={3}>
          <Card padding={3} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={1} weight="semibold">
                Order Items
              </Text>
              {order.items.length === 0 ? (
                <Text size={1}>No items in this order</Text>
              ) : (
                <Stack space={3}>
                  {order.items.map((item) => (
                    <Card key={item.id} padding={2} radius={2} tone="default">
                      <Flex>
                        <Box marginRight={3} style={{ width: "50px", height: "50px", position: "relative" }}>
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        </Box>
                        <Stack space={2} flex={1}>
                          <Text size={1}>{item.title}</Text>
                          <Flex justify="space-between">
                            <Text size={0}>Qty: {item.quantity}</Text>
                            <Text size={0} weight="semibold">
                              £{(item.price / 100).toFixed(2)}
                            </Text>
                          </Flex>
                        </Stack>
                      </Flex>
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
