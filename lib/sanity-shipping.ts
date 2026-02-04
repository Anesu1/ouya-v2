import { sanityClient } from "./sanity"
import type { ShippingCarrier } from "./shipping"
import { getZoneForCountry, getShippingMethodsForZone, COUNTRY_NAMES, SHIPPING_ZONES } from "./shipping-zones-config"

// Types for Sanity shipping data
export type SanityShippingZone = {
  _id: string
  name: string
  countries: string[]
  isDefault: boolean
}

export type SanityShippingMethod = {
  _id: string
  name: string
  carrier: string
  description: string
  icon: string
  logo?: {
    asset: {
      url: string
    }
  }
  zone: {
    _ref: string
  }
  basePrice: number
  freeShippingThreshold: number
  estimatedDelivery: string
  weightSurcharges?: {
    minWeight: number
    maxWeight: number
    surcharge: number
  }[]
}

// Fetch shipping zones from Sanity
export async function getShippingZones(): Promise<SanityShippingZone[]> {
  try {
    const zones = await sanityClient.fetch(`
      *[_type == "shippingZone"] {
        _id,
        name,
        countries,
        isDefault
      }
    `)
    return zones
  } catch (error) {
    console.error("Error fetching shipping zones from Sanity:", error)
    return []
  }
}

// Fetch shipping methods from Sanity
export async function getShippingMethods(): Promise<SanityShippingMethod[]> {
  try {
    const methods = await sanityClient.fetch(`
      *[_type == "shippingMethod"] {
        _id,
        name,
        carrier,
        description,
        icon,
        "logo": logo.asset->url,
        zone,
        basePrice,
        freeShippingThreshold,
        estimatedDelivery,
        weightSurcharges
      }
    `)
    return methods
  } catch (error) {
    console.error("Error fetching shipping methods from Sanity:", error)
    return []
  }
}

// Get shipping zone for a country (with fallback to config)
export async function getShippingZoneForCountry(countryCode: string): Promise<string | null> {
  try {
    const zones = await getShippingZones()

    // If Sanity has zones, use them
    if (zones.length > 0) {
      // Find zone that includes the country
      const zone = zones.find((zone) => zone.countries.includes(countryCode))

      if (zone) {
        return zone._id
      }

      // If no specific zone found, return default zone
      const defaultZone = zones.find((zone) => zone.isDefault)
      return defaultZone ? defaultZone._id : null
    }

    // Fallback to config-based zone mapping
    const zoneKey = getZoneForCountry(countryCode)
    return `zone-${zoneKey.toLowerCase()}`
  } catch (error) {
    console.error("Error getting shipping zone for country:", error)
    // Fallback to config
    const zoneKey = getZoneForCountry(countryCode)
    return `zone-${zoneKey.toLowerCase()}`
  }
}

// Get shipping methods with fallback to config
export async function getShippingMethodsForCountry(countryCode: string): Promise<SanityShippingMethod[]> {
  try {
    const zoneId = await getShippingZoneForCountry(countryCode)

    if (!zoneId) {
      return []
    }

    const allMethods = await getShippingMethods()
    const zoneMethods = allMethods.filter((method) => method.zone._ref === zoneId)

    // If no methods found in Sanity, use config fallback
    if (zoneMethods.length === 0) {
      const zoneKey = getZoneForCountry(countryCode)
      const configMethods = getShippingMethodsForZone(zoneKey)

      // Transform config methods to Sanity format
      return configMethods.map((method, index) => ({
        _id: `fallback-${zoneKey.toLowerCase()}-${index}`,
        name: method.name,
        carrier: method.carrier,
        description: method.description,
        icon: method.icon,
        zone: {
          _ref: `zone-${zoneKey.toLowerCase()}`,
        },
        basePrice: method.basePrice,
        freeShippingThreshold: method.freeShippingThreshold,
        estimatedDelivery: method.estimatedDelivery,
        weightSurcharges: method.weightSurcharges,
      }))
    }

    return zoneMethods
  } catch (error) {
    console.error("Error getting shipping methods for country:", error)
    return []
  }
}

// Calculate shipping options based on cart weight, destination, and subtotal
export async function calculateShippingOptionsFromSanity(
  cartWeight: number, // in grams
  destination: string, // country code
  subtotal: number, // cart subtotal in dollars
): Promise<ShippingCarrier[]> {
  try {
    const methods = await getShippingMethodsForCountry(destination)

    if (methods.length === 0) {
      return []
    }

    // Transform to ShippingCarrier format
    const carriers: ShippingCarrier[] = methods.map((method) => {
      // Calculate final price based on weight surcharges
      let finalPrice = method.basePrice

      // Apply free shipping if threshold is met
      if (method.freeShippingThreshold > 0 && subtotal >= method.freeShippingThreshold) {
        finalPrice = 0
      }
      // Apply weight surcharges if applicable
      else if (method.weightSurcharges && method.weightSurcharges.length > 0) {
        for (const surcharge of method.weightSurcharges) {
          if (cartWeight >= surcharge.minWeight && cartWeight <= surcharge.maxWeight) {
            finalPrice += surcharge.surcharge
            break
          }
        }
      }

      return {
        id: method._id,
        name: method.name,
        description: method.description,
        price: finalPrice,
        estimatedDelivery: method.estimatedDelivery,
        icon: method.icon,
        logo: method.logo,
      }
    })

    return carriers
  } catch (error) {
    console.error("Error calculating shipping options from Sanity:", error)
    return []
  }
}

// Helper function to get country name
export function getCountryName(countryCode: string): string {
  return COUNTRY_NAMES[countryCode] || countryCode
}

// Helper function to get all countries grouped by zone
export function getCountriesByZone() {
  const result: Record<string, { name: string; countries: Array<{ code: string; name: string }> }> = {}

  Object.entries(SHIPPING_ZONES).forEach(([zoneKey, zone]) => {
    result[zoneKey] = {
      name: zone.name,
      countries: zone.countries
        .map((code) => ({
          code,
          name: getCountryName(code),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }
  })

  return result
}
