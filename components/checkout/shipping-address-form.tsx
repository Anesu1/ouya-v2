"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { z } from "zod"
import { useSession } from "next-auth/react"

const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  addressLine1: z.string().min(3, "Address must be at least 3 characters"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(5, "Phone number is required"),
  saveAddress: z.boolean().optional(),
})

export type ShippingAddress = z.infer<typeof addressSchema>

interface ShippingAddressFormProps {
  onAddressChange: (address: ShippingAddress) => void
  initialAddress?: Partial<ShippingAddress>
  isSubmitting?: boolean
}

export default function ShippingAddressForm({
  onAddressChange,
  initialAddress = {},
  isSubmitting = false,
}: ShippingAddressFormProps) {
  const { data: session } = useSession()
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<string>("")
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [address, setAddress] = useState<ShippingAddress>({
    name: initialAddress.name || "",
    addressLine1: initialAddress.addressLine1 || "",
    addressLine2: initialAddress.addressLine2 || "",
    city: initialAddress.city || "",
    state: initialAddress.state || "",
    postalCode: initialAddress.postalCode || "",
    country: initialAddress.country || "GB", // Default to UK
    phone: initialAddress.phone || "",
    saveAddress: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch saved addresses if user is logged in
  useEffect(() => {
    const fetchAddresses = async () => {
      if (session?.user) {
        setIsLoadingAddresses(true)
        try {
          const response = await fetch("/api/account/addresses")
          if (response.ok) {
            const data = await response.json()
            setSavedAddresses(data.addresses || [])
          }
        } catch (error) {
          console.error("Error fetching addresses:", error)
        } finally {
          setIsLoadingAddresses(false)
        }
      }
    }

    fetchAddresses()
  }, [session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    // Validate and notify parent component
    validateField(name, type === "checkbox" ? checked : value)
    onAddressChange({
      ...address,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const validateField = (name: string, value: any) => {
    try {
      addressSchema.shape[name as keyof typeof addressSchema.shape].parse(value)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [name]: error.errors[0].message,
        }))
        return false
      }
    }
    return true
  }

  const handleSavedAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const addressId = e.target.value
    setSelectedSavedAddress(addressId)

    if (addressId) {
      const selectedAddress = savedAddresses.find((addr) => addr.id.toString() === addressId)
      if (selectedAddress) {
        const newAddress = {
          name: selectedAddress.name,
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2 || "",
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode,
          country: selectedAddress.country,
          phone: selectedAddress.phone || "",
          saveAddress: false, // No need to save again
        }
        setAddress(newAddress)
        onAddressChange(newAddress)
        setErrors({})
      }
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>

      {session?.user && (
        <div className="mt-4">
          <label htmlFor="savedAddress" className="block text-sm font-medium text-gray-700">
            Select a saved address
          </label>
          <div className="mt-1">
            <select
              id="savedAddress"
              name="savedAddress"
              value={selectedSavedAddress}
              onChange={handleSavedAddressSelect}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
              disabled={isLoadingAddresses}
            >
              <option value="">-- Use a new address --</option>
              {savedAddresses.map((addr) => (
                <option key={addr.id} value={addr.id.toString()}>
                  {addr.name} - {addr.addressLine1}, {addr.city}
                </option>
              ))}
            </select>
            {isLoadingAddresses && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Loading saved addresses...
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="name"
              name="name"
              value={address.name}
              onChange={handleChange}
              className={`block w-full border ${
                errors.name ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
            Address line 1
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              value={address.addressLine1}
              onChange={handleChange}
              className={`block w-full border ${
                errors.addressLine1 ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
            />
            {errors.addressLine1 && <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
            Address line 2 (optional)
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={address.addressLine2}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleChange}
              className={`block w-full border ${
                errors.city ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State / Province
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="state"
              name="state"
              value={address.state}
              onChange={handleChange}
              className={`block w-full border ${
                errors.state ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
            />
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
            Postal code
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={address.postalCode}
              onChange={handleChange}
              className={`block w-full border ${
                errors.postalCode ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
            />
            {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <div className="mt-1">
            <select
              id="country"
              name="country"
              value={address.country}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
            >
              <optgroup label="United Kingdom">
                <option value="GB">United Kingdom</option>
              </optgroup>
              <optgroup label="Europe">
                <option value="AL">Albania</option>
                <option value="AD">Andorra</option>
                <option value="AT">Austria</option>
                <option value="BY">Belarus</option>
                <option value="BE">Belgium</option>
                <option value="BA">Bosnia and Herzegovina</option>
                <option value="BG">Bulgaria</option>
                <option value="HR">Croatia</option>
                <option value="CY">Cyprus</option>
                <option value="CZ">Czech Republic</option>
                <option value="DK">Denmark</option>
                <option value="EE">Estonia</option>
                <option value="FI">Finland</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
                <option value="GI">Gibraltar</option>
                <option value="GR">Greece</option>
                <option value="GG">Guernsey</option>
                <option value="HU">Hungary</option>
                <option value="IS">Iceland</option>
                <option value="IE">Ireland</option>
                <option value="IM">Isle of Man</option>
                <option value="IT">Italy</option>
                <option value="JE">Jersey</option>
                <option value="XK">Kosovo</option>
                <option value="LV">Latvia</option>
                <option value="LI">Liechtenstein</option>
                <option value="LT">Lithuania</option>
                <option value="LU">Luxembourg</option>
                <option value="MK">North Macedonia</option>
                <option value="MT">Malta</option>
                <option value="MD">Moldova</option>
                <option value="MC">Monaco</option>
                <option value="ME">Montenegro</option>
                <option value="NL">Netherlands</option>
                <option value="NO">Norway</option>
                <option value="PL">Poland</option>
                <option value="PT">Portugal</option>
                <option value="RO">Romania</option>
                <option value="RU">Russia</option>
                <option value="SM">San Marino</option>
                <option value="RS">Serbia</option>
                <option value="SK">Slovakia</option>
                <option value="SI">Slovenia</option>
                <option value="ES">Spain</option>
                <option value="SE">Sweden</option>
                <option value="CH">Switzerland</option>
                <option value="UA">Ukraine</option>
                <option value="VA">Vatican City</option>
              </optgroup>
              <optgroup label="North America">
                <option value="AI">Anguilla</option>
                <option value="AG">Antigua and Barbuda</option>
                <option value="AW">Aruba</option>
                <option value="BS">Bahamas</option>
                <option value="BB">Barbados</option>
                <option value="BZ">Belize</option>
                <option value="BM">Bermuda</option>
                <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                <option value="VG">British Virgin Islands</option>
                <option value="CA">Canada</option>
                <option value="KY">Cayman Islands</option>
                <option value="CR">Costa Rica</option>
                <option value="CU">Cuba</option>
                <option value="CW">Curaçao</option>
                <option value="DM">Dominica</option>
                <option value="DO">Dominican Republic</option>
                <option value="SV">El Salvador</option>
                <option value="GL">Greenland</option>
                <option value="GD">Grenada</option>
                <option value="GP">Guadeloupe</option>
                <option value="GT">Guatemala</option>
                <option value="HT">Haiti</option>
                <option value="HN">Honduras</option>
                <option value="JM">Jamaica</option>
                <option value="MQ">Martinique</option>
                <option value="MX">Mexico</option>
                <option value="MS">Montserrat</option>
                <option value="NI">Nicaragua</option>
                <option value="PA">Panama</option>
                <option value="PR">Puerto Rico</option>
                <option value="BL">Saint Barthélemy</option>
                <option value="KN">Saint Kitts and Nevis</option>
                <option value="LC">Saint Lucia</option>
                <option value="MF">Saint Martin (French part)</option>
                <option value="VC">Saint Vincent and the Grenadines</option>
                <option value="SX">Sint Maarten (Dutch part)</option>
                <option value="TT">Trinidad and Tobago</option>
                <option value="TC">Turks and Caicos Islands</option>
                <option value="US">United States</option>
                <option value="VI">U.S. Virgin Islands</option>
              </optgroup>
              <optgroup label="South America">
                <option value="AR">Argentina</option>
                <option value="BO">Bolivia</option>
                <option value="BR">Brazil</option>
                <option value="CL">Chile</option>
                <option value="CO">Colombia</option>
                <option value="EC">Ecuador</option>
                <option value="GY">Guyana</option>
                <option value="PY">Paraguay</option>
                <option value="PE">Peru</option>
                <option value="SR">Suriname</option>
                <option value="UY">Uruguay</option>
                <option value="VE">Venezuela</option>
              </optgroup>
              <optgroup label="Africa">
                <option value="DZ">Algeria</option>
                <option value="AO">Angola</option>
                <option value="BJ">Benin</option>
                <option value="BW">Botswana</option>
                <option value="BF">Burkina Faso</option>
                <option value="BI">Burundi</option>
                <option value="CM">Cameroon</option>
                <option value="CV">Cape Verde</option>
                <option value="CF">Central African Republic</option>
                <option value="TD">Chad</option>
                <option value="KM">Comoros</option>
                <option value="CG">Congo</option>
                <option value="CD">Congo, Democratic Republic of the</option>
                <option value="CI">Côte d'Ivoire</option>
                <option value="DJ">Djibouti</option>
                <option value="EG">Egypt</option>
                <option value="GQ">Equatorial Guinea</option>
                <option value="ER">Eritrea</option>
                <option value="ET">Ethiopia</option>
                <option value="GA">Gabon</option>
                <option value="GM">Gambia</option>
                <option value="GH">Ghana</option>
                <option value="GN">Guinea</option>
                <option value="GW">Guinea-Bissau</option>
                <option value="KE">Kenya</option>
                <option value="LS">Lesotho</option>
                <option value="LR">Liberia</option>
                <option value="LY">Libya</option>
                <option value="MG">Madagascar</option>
                <option value="MW">Malawi</option>
                <option value="ML">Mali</option>
                <option value="MR">Mauritania</option>
                <option value="MU">Mauritius</option>
                <option value="MA">Morocco</option>
                <option value="MZ">Mozambique</option>
                <option value="NA">Namibia</option>
                <option value="NE">Niger</option>
                <option value="NG">Nigeria</option>
                <option value="RW">Rwanda</option>
                <option value="ST">São Tomé and Príncipe</option>
                <option value="SN">Senegal</option>
                <option value="SC">Seychelles</option>
                <option value="SL">Sierra Leone</option>
                <option value="SO">Somalia</option>
                <option value="ZA">South Africa</option>
                <option value="SS">South Sudan</option>
                <option value="SD">Sudan</option>
                <option value="SZ">Eswatini</option>
                <option value="TZ">Tanzania</option>
                <option value="TG">Togo</option>
                <option value="TN">Tunisia</option>
                <option value="UG">Uganda</option>
                <option value="ZM">Zambia</option>
                <option value="ZW">Zimbabwe</option>
              </optgroup>
              <optgroup label="Asia">
                <option value="AF">Afghanistan</option>
                <option value="AM">Armenia</option>
                <option value="AZ">Azerbaijan</option>
                <option value="BH">Bahrain</option>
                <option value="BD">Bangladesh</option>
                <option value="BT">Bhutan</option>
                <option value="BN">Brunei</option>
                <option value="KH">Cambodia</option>
                <option value="CN">China</option>
                <option value="GE">Georgia</option>
                <option value="IN">India</option>
                <option value="ID">Indonesia</option>
                <option value="IR">Iran</option>
                <option value="IQ">Iraq</option>
                <option value="IL">Israel</option>
                <option value="JP">Japan</option>
                <option value="JO">Jordan</option>
                <option value="KZ">Kazakhstan</option>
                <option value="KW">Kuwait</option>
                <option value="KG">Kyrgyzstan</option>
                <option value="LA">Laos</option>
                <option value="LB">Lebanon</option>
                <option value="MY">Malaysia</option>
                <option value="MV">Maldives</option>
                <option value="MN">Mongolia</option>
                <option value="MM">Myanmar</option>
                <option value="NP">Nepal</option>
                <option value="KP">North Korea</option>
                <option value="OM">Oman</option>
                <option value="PK">Pakistan</option>
                <option value="PS">Palestine</option>
                <option value="PH">Philippines</option>
                <option value="QA">Qatar</option>
                <option value="SA">Saudi Arabia</option>
                <option value="SG">Singapore</option>
                <option value="KR">South Korea</option>
                <option value="LK">Sri Lanka</option>
                <option value="SY">Syria</option>
                <option value="TW">Taiwan</option>
                <option value="TJ">Tajikistan</option>
                <option value="TH">Thailand</option>
                <option value="TR">Turkey</option>
                <option value="TM">Turkmenistan</option>
                <option value="AE">United Arab Emirates</option>
                <option value="UZ">Uzbekistan</option>
                <option value="VN">Vietnam</option>
                <option value="YE">Yemen</option>
              </optgroup>
              <optgroup label="Oceania">
                <option value="AS">American Samoa</option>
                <option value="AU">Australia</option>
                <option value="CK">Cook Islands</option>
                <option value="FJ">Fiji</option>
                <option value="PF">French Polynesia</option>
                <option value="GU">Guam</option>
                <option value="KI">Kiribati</option>
                <option value="MH">Marshall Islands</option>
                <option value="FM">Micronesia</option>
                <option value="NC">New Caledonia</option>
                <option value="NZ">New Zealand</option>
                <option value="NU">Niue</option>
                <option value="NF">Norfolk Island</option>
                <option value="MP">Northern Mariana Islands</option>
                <option value="PW">Palau</option>
                <option value="PG">Papua New Guinea</option>
                <option value="PN">Pitcairn</option>
                <option value="WS">Samoa</option>
                <option value="SB">Solomon Islands</option>
                <option value="TK">Tokelau</option>
                <option value="TO">Tonga</option>
                <option value="TV">Tuvalu</option>
                <option value="UM">U.S. Minor Outlying Islands</option>
                <option value="VU">Vanuatu</option>
                <option value="WF">Wallis and Futuna</option>
              </optgroup>
            </select>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone number
          </label>
          <div className="mt-1">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              className={`block w-full border ${
                errors.phone ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm`}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
        </div>

        {session?.user && (
          <div className="sm:col-span-2">
            <div className="flex items-center">
              <input
                id="saveAddress"
                name="saveAddress"
                type="checkbox"
                checked={address.saveAddress}
                onChange={handleChange}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="saveAddress" className="ml-2 block text-sm text-gray-700">
                Save this address for future orders
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
