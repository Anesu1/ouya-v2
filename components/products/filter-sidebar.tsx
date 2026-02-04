"use client"

import type React from "react"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp } from "lucide-react"

type FilterState = {
  search: string
  collection: string[]
  priceRange: [number, number] | null
  fragranceNotes: string[]
  productType: string[]
}

type FilterSidebarProps = {
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
  onClearAll: () => void
  collections: string[]
  fragranceNotes: string[]
  productTypes: string[]
  minPrice: number
  maxPrice: number
  sortOption: string
  onSortChange: (option: string) => void
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClearAll,
  collections,
  fragranceNotes,
  productTypes,
  minPrice,
  maxPrice,
  sortOption,
  onSortChange,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    sort: true,
    collections: true,
    price: true,
    fragranceNotes: true,
    productType: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Set initial price range if not already set
  const priceRange = filters.priceRange || [minPrice, maxPrice]

  const handlePriceChange = (values: number[]) => {
    onFilterChange({ priceRange: [values[0], values[1]] as [number, number] })
  }

  const handleCollectionChange = (collection: string, checked: boolean) => {
    if (checked) {
      onFilterChange({ collection: [...filters.collection, collection] })
    } else {
      onFilterChange({
        collection: filters.collection.filter((c) => c !== collection),
      })
    }
  }

  const handleFragranceNoteChange = (note: string, checked: boolean) => {
    if (checked) {
      onFilterChange({ fragranceNotes: [...filters.fragranceNotes, note] })
    } else {
      onFilterChange({
        fragranceNotes: filters.fragranceNotes.filter((n) => n !== note),
      })
    }
  }

  const handleProductTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      onFilterChange({ productType: [...filters.productType, type] })
    } else {
      onFilterChange({
        productType: filters.productType.filter((t) => t !== type),
      })
    }
  }

  const FilterSection = ({
    title,
    expanded,
    toggleExpanded,
    children,
    count = 0,
  }: {
    title: string
    expanded: boolean
    toggleExpanded: () => void
    children: React.ReactNode
    count?: number
  }) => (
    <div className="mb-6">
      <button
        onClick={toggleExpanded}
        className="flex items-center justify-between w-full text-lg font-medium text-gray-900 mb-2"
      >
        <div className="flex items-center">
          <span>{title}</span>
          {count > 0 && (
            <span className="ml-2 text-sm bg-gray-100 text-gray-700 rounded-full w-5 h-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </div>
        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {expanded && <div className="mt-3">{children}</div>}
    </div>
  )

  return (
    <div className="divide-y divide-gray-200">
      {/* Sort options */}
      <FilterSection title="Sort By" expanded={expandedSections.sort} toggleExpanded={() => toggleSection("sort")}>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="sort-featured"
              name="sort"
              type="radio"
              className="h-4 w-4 text-black focus:ring-black border-gray-300"
              checked={sortOption === "featured"}
              onChange={() => onSortChange("featured")}
            />
            <label htmlFor="sort-featured" className="ml-3 text-sm text-gray-600">
              Featured
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="sort-price-asc"
              name="sort"
              type="radio"
              className="h-4 w-4 text-black focus:ring-black border-gray-300"
              checked={sortOption === "price-asc"}
              onChange={() => onSortChange("price-asc")}
            />
            <label htmlFor="sort-price-asc" className="ml-3 text-sm text-gray-600">
              Price: Low to High
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="sort-price-desc"
              name="sort"
              type="radio"
              className="h-4 w-4 text-black focus:ring-black border-gray-300"
              checked={sortOption === "price-desc"}
              onChange={() => onSortChange("price-desc")}
            />
            <label htmlFor="sort-price-desc" className="ml-3 text-sm text-gray-600">
              Price: High to Low
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="sort-newest"
              name="sort"
              type="radio"
              className="h-4 w-4 text-black focus:ring-black border-gray-300"
              checked={sortOption === "newest"}
              onChange={() => onSortChange("newest")}
            />
            <label htmlFor="sort-newest" className="ml-3 text-sm text-gray-600">
              Newest
            </label>
          </div>
        </div>
      </FilterSection>

      {/* Collection filter */}
      <FilterSection
        title="Collections"
        expanded={expandedSections.collections}
        toggleExpanded={() => toggleSection("collections")}
        count={filters.collection.length}
      >
        <div className="space-y-4">
          {collections.map((collection) => (
            <div key={collection} className="flex items-center">
              <Checkbox
                id={`collection-${collection}`}
                checked={filters.collection.includes(collection)}
                onCheckedChange={(checked) => handleCollectionChange(collection, checked === true)}
              />
              <label htmlFor={`collection-${collection}`} className="ml-3 text-sm text-gray-600">
                {collection.charAt(0).toUpperCase() + collection.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price range filter */}
      <FilterSection
        title="Price Range"
        expanded={expandedSections.price}
        toggleExpanded={() => toggleSection("price")}
        count={filters.priceRange ? 1 : 0}
      >
        <div className="pt-2 pb-6">
          <Slider
            defaultValue={[priceRange[0], priceRange[1]]}
            min={minPrice}
            max={maxPrice}
            step={1}
            onValueChange={handlePriceChange}
          />
          <div className="flex items-center justify-between mt-4">
            <div className="border border-gray-300 rounded-md px-3 py-2">
              <span className="text-gray-500 text-xs">£</span>
              <span className="ml-1 text-gray-900">{priceRange[0]}</span>
            </div>
            <div className="border border-gray-300 rounded-md px-3 py-2">
              <span className="text-gray-500 text-xs">£</span>
              <span className="ml-1 text-gray-900">{priceRange[1]}</span>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Fragrance notes filter */}
      <FilterSection
        title="Fragrance Notes"
        expanded={expandedSections.fragranceNotes}
        toggleExpanded={() => toggleSection("fragranceNotes")}
        count={filters.fragranceNotes.length}
      >
        <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
          {fragranceNotes.map((note) => (
            <div key={note} className="flex items-center">
              <Checkbox
                id={`note-${note}`}
                checked={filters.fragranceNotes.includes(note)}
                onCheckedChange={(checked) => handleFragranceNoteChange(note, checked === true)}
              />
              <label htmlFor={`note-${note}`} className="ml-3 text-sm text-gray-600">
                {note}
              </label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Product type filter */}
      <FilterSection
        title="Product Type"
        expanded={expandedSections.productType}
        toggleExpanded={() => toggleSection("productType")}
        count={filters.productType.length}
      >
        <div className="space-y-4">
          {productTypes
            .filter((type) => type !== "Default Title")
            .map((type) => (
              <div key={type} className="flex items-center">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.productType.includes(type)}
                  onCheckedChange={(checked) => handleProductTypeChange(type, checked === true)}
                />
                <label htmlFor={`type-${type}`} className="ml-3 text-sm text-gray-600">
                  {type}
                </label>
              </div>
            ))}
        </div>
      </FilterSection>

      {/* Clear all filters button */}
      <div className="pt-4">
        <button onClick={onClearAll} className="text-black hover:underline text-sm font-medium">
          Clear all filters
        </button>
      </div>
    </div>
  )
}
