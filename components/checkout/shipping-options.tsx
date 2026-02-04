"use client"

import { useState, useEffect, useCallback } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Truck, Plane, Box, AlertCircle } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"
import { Button } from "@/components/ui/button"

interface ShippingMethod {
  _id: string
  name: string
  carrier: string
  description?: string
  icon?: string
  basePrice: number
  freeShippingThreshold: number
  estimatedDelivery?: string
  weightSurcharges?: Array<{
    minWeight: number
    maxWeight: number
    surcharge: number
  }>
  zone: {
    _id: string
    name: string
    countries: string[]
    isDefault: boolean
  }
}

interface ShippingOptionsProps {
  onShippingCostChange: (cost: number) => void
  country?: string
}

const iconMap = {
  Truck: Truck,
  Plane: Plane,
  Box: Box,
}

// Fallback shipping methods if API fails
const fallbackMethods: ShippingMethod[] = [
  {
    _id: "fallback-standard",
    name: "Standard Delivery",
    carrier: "Standard",
    description: "Standard delivery service",
    icon: "Truck",
    basePrice: 4.99,
    freeShippingThreshold: 50,
    estimatedDelivery: "3-5 business days",
    weightSurcharges: [],
    zone: {
      _id: "fallback-zone",
      name: "Default",
      countries: [],
      isDefault: true,
    },
  },
  {
    _id: "fallback-express",
    name: "Express Delivery",
    carrier: "Express",
    description: "Fast delivery service",
    icon: "Plane",
    basePrice: 9.99,
    freeShippingThreshold: 75,
    estimatedDelivery: "1-2 business days",
    weightSurcharges: [],
    zone: {
      _id: "fallback-zone",
      name: "Default",
      countries: [],
      isDefault: true,
    },
  },
]

export default function ShippingOptions({ onShippingCostChange, country = "GB" }: ShippingOptionsProps) {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const { total, getTotalWeight } = useCart()

  // Fetch shipping methods when country changes
  useEffect(() => {
    let isMounted = true // Prevent state updates if component unmounts

    const fetchMethods = async () => {
      try {
        setLoading(true)
        setError(null)
        setSelectedMethod("") // Reset selection when country changes

        console.log("Fetching shipping methods for country:", country)

        const response = await fetch(`/api/shipping/methods?country=${country}`)

        if (!isMounted) return // Component unmounted, don't update state

        if (!response.ok) {
          const errorData = await response.json()
          console.error("API Error:", errorData)
          throw new Error(errorData.details || errorData.error || "Failed to fetch shipping methods")
        }

        const methods = await response.json()
        console.log("Received methods:", methods)

        if (!isMounted) return // Component unmounted, don't update state

        if (methods.length === 0) {
          console.log("No methods returned, using fallback")
          setShippingMethods(fallbackMethods)
          setUsingFallback(true)
          setSelectedMethod(fallbackMethods[0]._id)
        } else {
          setShippingMethods(methods)
          setUsingFallback(false)
          setSelectedMethod(methods[0]._id)
        }
      } catch (err) {
        if (!isMounted) return // Component unmounted, don't update state

        console.error("Error fetching shipping methods:", err)
        setError(err.message)

        // Use fallback methods
        setShippingMethods(fallbackMethods)
        setUsingFallback(true)
        setSelectedMethod(fallbackMethods[0]._id)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchMethods()

    return () => {
      isMounted = false // Cleanup function
    }
  }, [country])

  // Update shipping cost when selection or cart changes
  useEffect(() => {
    if (selectedMethod && shippingMethods.length > 0) {
      const method = shippingMethods.find((m) => m._id === selectedMethod)
      if (method) {
        const cost = calculateShippingCost(method)
        onShippingCostChange(cost)
      }
    }
  }, [selectedMethod, shippingMethods.length, total]) // Remove onShippingCostChange from dependencies

  // Add a separate useEffect to handle the fetchShippingMethods function
  const fetchShippingMethods = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setSelectedMethod("") // Reset selection when country changes

      console.log("Fetching shipping methods for country:", country)

      const response = await fetch(`/api/shipping/methods?country=${country}`)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error:", errorData)
        throw new Error(errorData.details || errorData.error || "Failed to fetch shipping methods")
      }

      const methods = await response.json()
      console.log("Received methods:", methods)

      if (methods.length === 0) {
        console.log("No methods returned, using fallback")
        setShippingMethods(fallbackMethods)
        setUsingFallback(true)
        setSelectedMethod(fallbackMethods[0]._id)
      } else {
        setShippingMethods(methods)
        setUsingFallback(false)
        setSelectedMethod(methods[0]._id)
      }
    } catch (err) {
      console.error("Error fetching shipping methods:", err)
      setError(err.message)

      // Use fallback methods
      setShippingMethods(fallbackMethods)
      setUsingFallback(true)
      setSelectedMethod(fallbackMethods[0]._id)
    } finally {
      setLoading(false)
    }
  }, [country])

  const calculateShippingCost = (method: ShippingMethod): number => {
    // Check if free shipping threshold is met
    if (method.freeShippingThreshold > 0 && total >= method.freeShippingThreshold) {
      return 0
    }

    let cost = method.basePrice

    // Add weight surcharges if applicable
    if (method.weightSurcharges && method.weightSurcharges.length > 0) {
      const totalWeight = getTotalWeight ? getTotalWeight() : 0

      for (const surcharge of method.weightSurcharges) {
        if (totalWeight >= surcharge.minWeight && totalWeight <= surcharge.maxWeight) {
          cost += surcharge.surcharge
          break
        }
      }
    }

    return cost
  }

  const handleMethodChange = (methodId: string) => {
    setSelectedMethod(methodId)
  }

  const getIcon = (iconName?: string) => {
    if (!iconName || !iconMap[iconName as keyof typeof iconMap]) {
      return Truck
    }
    return iconMap[iconName as keyof typeof iconMap]
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Shipping Options</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading shipping options for {country}...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Shipping Options</h2>
        {usingFallback && (
          <Button variant="outline" size="sm" onClick={fetchShippingMethods}>
            Retry
          </Button>
        )}
      </div>

      {error && !usingFallback && (
        <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {usingFallback && (
        <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Using default shipping options for {country}. Some features may be limited.</span>
        </div>
      )}

      <RadioGroup value={selectedMethod} onValueChange={handleMethodChange}>
        {shippingMethods.map((method) => {
          const cost = calculateShippingCost(method)
          const Icon = getIcon(method.icon)
          const isFree = cost === 0

          return (
            <div key={method._id} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50">
              <RadioGroupItem value={method._id} id={method._id} />
              <div className="flex items-center space-x-3 flex-1">
                <Icon className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <Label htmlFor={method._id} className="font-medium cursor-pointer">
                    {method.name} - {method.carrier}
                  </Label>
                  {method.description && <p className="text-sm text-gray-600 mt-1">{method.description}</p>}
                  {method.estimatedDelivery && (
                    <p className="text-sm text-gray-500 mt-1">Estimated delivery: {method.estimatedDelivery}</p>
                  )}
                  {method.freeShippingThreshold > 0 && total < method.freeShippingThreshold && (
                    <p className="text-sm text-blue-600 mt-1">
                      Free shipping on orders over £{method.freeShippingThreshold.toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-medium">{isFree ? "FREE" : `£${cost.toFixed(2)}`}</span>
                </div>
              </div>
            </div>
          )
        })}
      </RadioGroup>

      {shippingMethods.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>No shipping options available for {country}</p>
          <Button variant="outline" size="sm" onClick={fetchShippingMethods} className="mt-2">
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
}
