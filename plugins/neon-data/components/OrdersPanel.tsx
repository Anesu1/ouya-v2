"use client"

import { useEffect, useState } from "react"
import { Box, Button, Card, Flex, Grid, Select, Spinner, Stack, Text, TextInput } from "@sanity/ui"
import { SearchIcon, SyncIcon } from "@sanity/icons"
import { useClient } from "sanity"
import { formatDistanceToNow } from "date-fns"
import OrderDetails from "./OrderDetails"

interface Order {
  id: number
  orderId: string
  userId: string
  total: number
  status: string
  createdAt: string
  shippingName: string
  shippingEmail?: string
}

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const client = useClient({ apiVersion: "2023-05-03" })

  const fetchOrders = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/sanity/orders", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${client.config().token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`)
      }

      const data = await response.json()
      setOrders(data.orders)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Failed to load orders. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter((order) => {
    // Apply status filter
    if (statusFilter !== "all" && order.status.toLowerCase() !== statusFilter) {
      return false
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        order.orderId.toLowerCase().includes(searchLower) ||
        order.shippingName.toLowerCase().includes(searchLower) ||
        (order.shippingEmail && order.shippingEmail.toLowerCase().includes(searchLower))
      )
    }

    return true
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  if (selectedOrder) {
    return <OrderDetails orderId={selectedOrder} onBack={() => setSelectedOrder(null)} />
  }

  return (
    <Stack space={4}>
      <Flex justify="space-between" align="center">
        <Text size={2} weight="semibold">
          Orders
        </Text>
        <Button icon={SyncIcon} mode="ghost" onClick={fetchOrders} disabled={isLoading} text="Refresh" />
      </Flex>

      <Grid columns={[1, 1, 3]} gap={3}>
        <Box>
          <TextInput
            icon={SearchIcon}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
            placeholder="Search orders..."
            value={searchTerm}
          />
        </Box>
        <Box>
          <Select onChange={(event) => setStatusFilter(event.currentTarget.value)} value={statusFilter}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </Box>
      </Grid>

      {isLoading ? (
        <Flex align="center" justify="center" padding={5}>
          <Spinner />
        </Flex>
      ) : error ? (
        <Card padding={4} radius={2} tone="critical">
          <Text>{error}</Text>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card padding={4} radius={2} tone="default">
          <Text align="center">No orders found</Text>
        </Card>
      ) : (
        <Stack space={2}>
          {filteredOrders.map((order) => (
            <Card
              key={order.orderId}
              padding={3}
              radius={2}
              shadow={1}
              onClick={() => setSelectedOrder(order.orderId)}
              style={{ cursor: "pointer" }}
            >
              <Grid columns={[1, 2, 4]} gap={3}>
                <Stack space={2}>
                  <Text size={1} weight="semibold">
                    Order #{order.orderId}
                  </Text>
                  <Text size={0} muted>
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </Text>
                </Stack>
                <Stack space={2}>
                  <Text size={1}>{order.shippingName}</Text>
                  <Text size={0} muted>
                    {order.shippingEmail || "No email"}
                  </Text>
                </Stack>
                <Text size={1} weight="semibold">
                  £{(order.total / 100).toFixed(2)}
                </Text>
                <Flex align="center" justify="flex-end">
                  <Box
                    style={{
                      backgroundColor: getStatusColor(order.status),
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {order.status}
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
