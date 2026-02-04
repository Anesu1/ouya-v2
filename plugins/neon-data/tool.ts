import { BarChartIcon } from "@sanity/icons"
import type { Tool } from "sanity"
import NeonDataTool from "./components/NeonDataTool"

export const neonDataTool: Tool = {
  name: "neon-data",
  title: "Database",
  icon: BarChartIcon,
  component: NeonDataTool,
}
