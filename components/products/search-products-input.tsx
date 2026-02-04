"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"

interface SearchProductsInputProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchProductsInput({ value, onChange }: SearchProductsInputProps) {
  const [inputValue, setInputValue] = useState(value)

  // Update internal state when external value changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onChange(inputValue)
  }

  const handleClear = () => {
    setInputValue("")
    onChange("")
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-charcoal-light" size={20} />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full pl-12 pr-10 py-3 border border-cream-dark rounded-md focus:outline-none focus:ring-gold focus:border-gold transition-colors"
          placeholder="Search candles by name, scent, or collection..."
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-charcoal-light hover:text-charcoal transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  )
}
