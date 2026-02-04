import { sanityClient } from "./sanity"

export type ShippingCarrier = {
  id: string
  name: string
  description: string
  price: number
  estimatedDelivery: string
  icon: string // This will be rendered as a React component in the UI
  logo?: string
}

// Get the shipping zone for a country
export async function getShippingZone(countryCode: string): Promise<string> {
  try {
    // First, try to find a specific zone for this country
    const zones = await sanityClient.fetch(
      `
      *[_type == "shippingZone" && $countryCode in countries][0] {
        name
      }
    `,
      { countryCode },
    )

    if (zones && zones.name) {
      return zones.name
    }

    // If no specific zone found, get the default zone
    const defaultZone = await sanityClient.fetch(`
      *[_type == "shippingZone" && isDefault == true][0] {
        name
      }
    `)

    if (defaultZone && defaultZone.name) {
      return defaultZone.name
    }

    // Fallback to "Rest of World" if no zones defined
    return "Rest of World"
  } catch (error) {
    console.error("Error fetching shipping zone:", error)
    return "Rest of World" // Fallback
  }
}

// Calculate shipping options based on cart weight and destination
export async function calculateShippingOptions(
  cartWeight: number, // in grams
  destination: string, // country code
  subtotal: number, // cart subtotal in dollars
): Promise<ShippingCarrier[]> {
  try {
    // Get the zone for this country
    const zoneName = await getShippingZone(destination)

    // Fetch shipping methods for this zone
    const shippingMethods = await sanityClient.fetch(
      `
      *[_type == "shippingMethod" && zone->name == $zoneName] {
        _id,
        name,
        carrier,
        description,
        icon,
        "logo": logo.asset->url,
        basePrice,
        freeShippingThreshold,
        estimatedDelivery,
        weightSurcharges
      }
    `,
      { zoneName },
    )

    // If no shipping methods found in Sanity, return empty array
    if (!shippingMethods || shippingMethods.length === 0) {
      console.warn(`No shipping methods found for zone: ${zoneName}`)
      return []
    }

    // Transform to the expected format and apply pricing rules
    const carriers: ShippingCarrier[] = shippingMethods.map((method) => {
      // Start with base price
      let price = method.basePrice

      // Apply free shipping if threshold is met
      if (method.freeShippingThreshold > 0 && subtotal >= method.freeShippingThreshold) {
        price = 0
      }

      // Apply weight surcharges if applicable
      if (method.weightSurcharges && method.weightSurcharges.length > 0) {
        for (const surcharge of method.weightSurcharges) {
          if (cartWeight >= surcharge.minWeight && (!surcharge.maxWeight || cartWeight <= surcharge.maxWeight)) {
            price += surcharge.surcharge
            break
          }
        }
      }

      return {
        id: method._id,
        name: method.name,
        description: method.description || `${method.carrier} shipping`,
        price: price,
        estimatedDelivery: method.estimatedDelivery || "Standard delivery time",
        icon: method.icon || "Box",
        logo: method.logo,
      }
    })

    return carriers
  } catch (error) {
    console.error("Error calculating shipping options:", error)
    return [] // Return empty array on error
  }
}

// Calculate cart weight based on items
export function calculateCartWeight(items: any[]): number {
  return items.reduce((total, item) => {
    // Get weight from variant or use default weight
    const weight = item.weight || 200 // Default to 200g if weight not specified
    return total + weight * item.quantity
  }, 0)
}
