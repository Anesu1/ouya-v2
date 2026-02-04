"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Globe, Package, Truck, CheckCircle, AlertCircle } from "lucide-react"
import { getCountriesByZone } from "@/lib/sanity-shipping"
import { SHIPPING_ZONES } from "@/lib/shipping-zones-config"

export default function ShippingManagement() {
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const countriesByZone = getCountriesByZone()

  const handleSetupShipping = async () => {
    setIsSettingUp(true)
    setError(null)

    try {
      const response = await fetch("/api/shipping/setup", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setSetupComplete(true)
      } else {
        setError(data.error || "Failed to setup shipping data")
      }
    } catch (err) {
      setError("Network error occurred while setting up shipping data")
    } finally {
      setIsSettingUp(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Shipping Management</h2>
          <p className="text-gray-600">Configure shipping zones and methods for your store</p>
        </div>
        <Button onClick={handleSetupShipping} disabled={isSettingUp || setupComplete}>
          {isSettingUp ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up...
            </>
          ) : setupComplete ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Setup Complete
            </>
          ) : (
            <>
              <Package className="mr-2 h-4 w-4" />
              Setup Shipping Data
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {setupComplete && (
        <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
          <CheckCircle className="h-5 w-5" />
          <span>Shipping zones and methods have been successfully configured in Sanity!</span>
        </div>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Shipping Zones Overview
            </CardTitle>
            <CardDescription>
              Your store supports shipping to{" "}
              {Object.values(SHIPPING_ZONES).reduce((acc, zone) => acc + zone.countries.length, 0)} countries across{" "}
              {Object.keys(SHIPPING_ZONES).length} zones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(countriesByZone).map(([zoneKey, zone]) => (
                <Card key={zoneKey} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{zone.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{zone.countries.length} countries</Badge>
                      {SHIPPING_ZONES[zoneKey as keyof typeof SHIPPING_ZONES]?.isDefault && (
                        <Badge variant="outline">Default Zone</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 mb-2">Sample countries:</p>
                      <div className="flex flex-wrap gap-1">
                        {zone.countries.slice(0, 6).map((country) => (
                          <Badge key={country.code} variant="outline" className="text-xs">
                            {country.name}
                          </Badge>
                        ))}
                        {zone.countries.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{zone.countries.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Methods Summary
            </CardTitle>
            <CardDescription>
              Each zone has multiple shipping options with different pricing and delivery times
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(SHIPPING_ZONES).map(([zoneKey, zone]) => (
                <div key={zoneKey} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{zone.name}</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="text-sm">
                      <span className="font-medium">Standard Delivery:</span>
                      <span className="text-gray-600 ml-2">
                        {zoneKey === "UK"
                          ? "£2.99 - £3.99"
                          : zoneKey === "EUROPE"
                            ? "£8.99"
                            : zoneKey === "NORTH_AMERICA"
                              ? "£12.99"
                              : zoneKey === "ASIA_PACIFIC"
                                ? "£14.99"
                                : zoneKey === "MIDDLE_EAST"
                                  ? "£16.99"
                                  : zoneKey === "AFRICA"
                                    ? "£18.99"
                                    : zoneKey === "SOUTH_AMERICA"
                                      ? "£19.99"
                                      : "£22.99"}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Express Delivery:</span>
                      <span className="text-gray-600 ml-2">
                        {zoneKey === "UK"
                          ? "£6.99"
                          : zoneKey === "EUROPE"
                            ? "£15.99"
                            : zoneKey === "NORTH_AMERICA"
                              ? "£24.99"
                              : zoneKey === "ASIA_PACIFIC"
                                ? "£29.99"
                                : zoneKey === "MIDDLE_EAST"
                                  ? "£32.99"
                                  : zoneKey === "AFRICA"
                                    ? "£35.99"
                                    : zoneKey === "SOUTH_AMERICA"
                                      ? "£39.99"
                                      : "£45.99"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
