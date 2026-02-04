"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminOrders from "@/components/admin/orders"
import AdminProducts from "@/components/admin/products"
import AdminCustomers from "@/components/admin/customers"
import AdminSettings from "@/components/admin/settings"
import { LayoutDashboard, Package, Users, Settings } from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-semibold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Products</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Customers</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="border rounded-lg p-6">
          <AdminOrders />
        </TabsContent>

        <TabsContent value="products" className="border rounded-lg p-6">
          <AdminProducts />
        </TabsContent>

        <TabsContent value="customers" className="border rounded-lg p-6">
          <AdminCustomers />
        </TabsContent>

        <TabsContent value="settings" className="border rounded-lg p-6">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
