"use client"

import { useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mail, Phone, MapPin, AlertCircle, Check } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

type OrderItem = {
  id: number
  title: string
  quantity: number
  price: number
  image: string
  productId: string
  variantId: string
}

type Order = {
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
}

type User = {
  id: number
  userId: string
  name: string
  email: string
}

export default function AdminOrderDetails({
  order,
  items,
  user,
}: {
  order: Order
  items: OrderItem[]
  user: User | null
}) {
  const [status, setStatus] = useState(order.status)
  const [isUpdating, setIsUpdating] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [customerNote, setCustomerNote] = useState("")
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const handleStatusUpdate = async () => {
    setIsUpdating(true)
    setUpdateSuccess(false)
    setUpdateError(null)

    try {
      const response = await fetch(`/api/admin/orders/${order.orderId}/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          trackingNumber: trackingNumber || null,
          customerNote: customerNote || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order status")
      }

      setUpdateSuccess(true)

      // If status is updated to "shipped", send notification email
      if (status === "shipped") {
        try {
          await fetch(`/api/admin/orders/${order.orderId}/send-notification`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "shipping_confirmation",
              trackingNumber,
              customerNote,
            }),
          })
        } catch (emailError) {
          console.error("Failed to send notification email:", emailError)
          // Don't fail the whole operation if just the email fails
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      setUpdateError("Failed to update order status. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "paid":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left column - Order details and items */}
      <div className="lg:col-span-2 space-y-8">
        {/* Order summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Order ID</p>
                <p className="mt-1">{order.orderId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge className={`mt-1 ${getStatusColor(order.status)}`}>{order.status}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="mt-1">£{(order.total / 100).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Shipping</p>
                <p className="mt-1">£{(order.shippingCost / 100).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>
              {items.length} {items.length === 1 ? "item" : "items"} in this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-12 w-12 relative rounded overflow-hidden mr-3">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-gray-500">SKU: {item.variantId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>£{(item.price / 100 / item.quantity).toFixed(2)}</TableCell>
                    <TableCell className="text-right">£{(item.price / 100).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right">£{((order.total - order.shippingCost) / 100).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Shipping
                  </TableCell>
                  <TableCell className="text-right">£{(order.shippingCost / 100).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">£{(order.total / 100).toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Right column - Customer info and status update */}
      <div className="space-y-8">
        {/* Customer information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="mt-1">{order.shippingName}</p>
            </div>

            {user && (
              <>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                  <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                    {user.email}
                  </a>
                </div>
              </>
            )}

            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-500 mr-2" />
              <a href={`tel:${order.shippingPhone}`} className="text-blue-600 hover:underline">
                {order.shippingPhone}
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Shipping address */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <div>
                <p>{order.shippingName}</p>
                <p>{order.shippingAddressLine1}</p>
                {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
                <p>
                  {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
                </p>
                <p>{order.shippingCountry}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">Shipping Method</p>
              <p className="mt-1">{order.shippingCarrier || "Standard Shipping"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Update order status */}
        <Card>
          <CardHeader>
            <CardTitle>Update Order Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {updateSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center mb-4">
                <Check className="h-5 w-5 mr-2" />
                Order status updated successfully
              </div>
            )}

            {updateError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center mb-4">
                <AlertCircle className="h-5 w-5 mr-2" />
                {updateError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {status === "shipped" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number (optional)</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    placeholder="Enter tracking number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Note to Customer (optional)</label>
                  <Textarea
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Add a note to the shipping confirmation email"
                    className="min-h-[100px]"
                  />
                </div>
              </>
            )}

            <Button onClick={handleStatusUpdate} disabled={isUpdating || status === order.status} className="w-full">
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
