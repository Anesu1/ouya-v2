import { definePlugin } from "sanity"
import { neonDataTool as tool } from "./tool"

export const neonDataTool = definePlugin(() => {
  return {
    name: "neon-data-tool",
    tools: [tool],
  }
})
