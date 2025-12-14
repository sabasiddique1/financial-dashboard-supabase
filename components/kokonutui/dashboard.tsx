"use client"

import { User } from "@supabase/supabase-js"
import Content from "./content"
import PublicContent from "./public-content"
import Layout from "./layout"

interface DashboardProps {
  user?: User | null
}

export default function Dashboard({ user }: DashboardProps) {

  // If user is not authenticated, show public dashboard only
  if (!user) {
    return (
      <Layout>
        <PublicContent />
      </Layout>
    )
  }

  // If user is authenticated, show full dashboard with user data
  return (
    <Layout>
      <Content user={user} />
    </Layout>
  )
}
