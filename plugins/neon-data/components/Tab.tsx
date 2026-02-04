"use client"
import { Tab as SanityTab } from "@sanity/ui"

interface TabProps {
  "aria-controls": string
  id: string
  label: string
  onClick: () => void
  selected: boolean
}

export function Tab(props: TabProps) {
  const { "aria-controls": ariaControls, id, label, onClick, selected } = props

  return (
    <SanityTab aria-controls={ariaControls} id={id} label={label} onClick={onClick} selected={selected} space={2} />
  )
}
