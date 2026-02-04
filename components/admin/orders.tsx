"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Eye, ArrowUpDown } from "lucide-react"
import Link from "next/link"

type Order = {
  id: number
  orderId: string
  userId: string
  total: number
  status: string
  createdAt: string
  shippingName: string
  shippingAddressLine1: string
  shippingCity: string
  shippingState: string
  shippingPostalCode: string
  shippingCountry: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/orders")

      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data = await response.json()
      setOrders(data.orders)
    } catch (err) {
      setError("Error loading orders. Please try again.")
      console.error("Error fetching orders:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
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
          `${order.shippingCity}, ${order.shippingState}`.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortField === "createdAt") {
        return sortDirection === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }

      if (sortField === "total") {
        return sortDirection === "asc" ? a.total - b.total : b.total - a.total
      }

      // Default sort by orderId
      return sortDirection === "asc" ? a.orderId.localeCompare(b.orderId) : b.orderId.localeCompare(a.orderId)
    })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-2xl font-semibold">Orders</h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-[250px]"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">
                <button className="flex items-center" onClick={() => handleSort("orderId")}>
                  Order ID
                  <ArrowUpDown size={14} className="ml-1" />
                </button>
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Shipping Address</TableHead>
              <TableHead>
                <button className="flex items-center" onClick={() => handleSort("createdAt")}>
                  Date
                  <ArrowUpDown size={14} className="ml-1" />
                </button>
              </TableHead>
              <TableHead>
                <button className="flex items-center" onClick={() => handleSort("total")}>
                  Total
                  <ArrowUpDown size={14} className="ml-1" />
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>{order.shippingName}</TableCell>
                  <TableCell>
                    {order.shippingAddressLine1}, {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
                    , {order.shippingCountry}
                  </TableCell>
                  <TableCell>{format(new Date(order.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>£{(order.total / 100).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/orders/${order.orderId}`}>
                      <Button variant="ghost" size="sm">
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
