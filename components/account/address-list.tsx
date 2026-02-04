"use client"

import { useState, useEffect } from "react"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"

type Address = {
  id: number
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
}

export default function AddressList({ userId }: { userId: string }) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null)

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`/api/account/addresses?userId=${userId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch addresses")
        }

        const data = await response.json()
        setAddresses(data.addresses)
      } catch (err) {
        setError("Failed to load addresses. Please try again later.")
        console.error("Error fetching addresses:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAddresses()
  }, [userId])

  const handleSetDefaultAddress = async (addressId: number) => {
    try {
      const response = await fetch(`/api/account/addresses/${addressId}/default`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error("Failed to set default address")
      }

      // Update addresses in state
      setAddresses((prevAddresses) =>
        prevAddresses.map((address) => ({
          ...address,
          isDefault: address.id === addressId,
        })),
      )
    } catch (err) {
      console.error("Error setting default address:", err)
      // Show error message
    }
  }

  const handleDeleteAddress = async (addressId: number) => {
    try {
      const response = await fetch(`/api/account/addresses/${addressId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete address")
      }

      // Remove address from state
      setAddresses((prevAddresses) => prevAddresses.filter((address) => address.id !== addressId))
    } catch (err) {
      console.error("Error deleting address:", err)
      // Show error message
    }
  }

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
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Saved Addresses</h2>
        <button
          onClick={() => setIsAddingAddress(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          <Plus className="-ml-0.5 mr-2 h-4 w-4" />
          Add address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">No addresses saved</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Add an address to make checkout faster.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {addresses.map((address) => (
              <li key={address.id} className="px-4 py-4 sm:px-6">
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-gray-900">{address.name}</h4>
                      {address.isDefault && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{address.addressLine1}</p>
                    {address.addressLine2 && <p className="text-sm text-gray-500">{address.addressLine2}</p>}
                    <p className="text-sm text-gray-500">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-500">{address.country}</p>
                    {address.phone && <p className="text-sm text-gray-500">{address.phone}</p>}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setEditingAddressId(address.id)}
                      className="text-gray-400 hover:text-gray-500"
                      aria-label="Edit address"
                    >
                      <Pencil size={18} />
                    </button>
                    {!address.isDefault && (
                      <>
                        <button
                          onClick={() => handleSetDefaultAddress(address.id)}
                          className="text-sm text-black hover:text-gray-700"
                        >
                          Set as default
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-gray-400 hover:text-gray-500"
                          aria-label="Delete address"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Address form modal would go here */}
    </div>
  )
}
