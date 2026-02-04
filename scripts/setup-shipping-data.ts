import { sanityClient } from "../lib/sanity"
import { SHIPPING_ZONES, SHIPPING_METHODS } from "../lib/shipping-zones-config"

// Script to populate Sanity with shipping zones and methods
async function setupShippingData() {
  console.log("Setting up shipping zones and methods in Sanity...")

  try {
    // Create shipping zones
    const zonePromises = Object.entries(SHIPPING_ZONES).map(async ([key, zone]) => {
      const zoneDoc = {
        _type: "shippingZone",
        _id: `zone-${key.toLowerCase()}`,
        name: zone.name,
        countries: zone.countries,
        isDefault: zone.isDefault,
      }

      console.log(`Creating zone: ${zone.name}`)
      return await sanityClient.createOrReplace(zoneDoc)
    })

    const createdZones = await Promise.all(zonePromises)
    console.log(`Created ${createdZones.length} shipping zones`)

    // Create shipping methods
    const methodPromises = Object.entries(SHIPPING_METHODS).map(async ([zoneKey, methods]) => {
      const zoneId = `zone-${zoneKey.toLowerCase()}`

      return Promise.all(
        methods.map(async (method, index) => {
          const methodDoc = {
            _type: "shippingMethod",
            _id: `method-${zoneKey.toLowerCase()}-${index}`,
            name: method.name,
            carrier: method.carrier,
            description: method.description,
            icon: method.icon,
            zone: {
              _type: "reference",
              _ref: zoneId,
            },
            basePrice: method.basePrice,
            freeShippingThreshold: method.freeShippingThreshold,
            estimatedDelivery: method.estimatedDelivery,
            weightSurcharges: method.weightSurcharges,
          }

          console.log(`Creating method: ${method.name} for ${zoneKey}`)
          return await sanityClient.createOrReplace(methodDoc)
        }),
      )
    })

    const createdMethods = await Promise.all(methodPromises)
    const totalMethods = createdMethods.flat().length
    console.log(`Created ${totalMethods} shipping methods`)

    console.log("✅ Shipping data setup completed successfully!")

    // Log summary
    console.log("\n📊 Summary:")
    console.log(`- Zones created: ${createdZones.length}`)
    console.log(`- Methods created: ${totalMethods}`)
    console.log(
      `- Countries covered: ${Object.values(SHIPPING_ZONES).reduce((acc, zone) => acc + zone.countries.length, 0)}`,
    )
  } catch (error) {
    console.error("❌ Error setting up shipping data:", error)
    throw error
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupShippingData()
    .then(() => {
      console.log("Setup completed!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Setup failed:", error)
      process.exit(1)
    })
}

export { setupShippingData }
