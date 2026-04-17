import { redirect } from "next/navigation"

// Sanity Studio is deployed separately at https://ouya-oenda.sanity.studio
// Run `npx sanity deploy` to push updates to the hosted studio.
export default function StudioPage() {
  redirect(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio`)
}
