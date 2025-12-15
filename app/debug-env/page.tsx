"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugEnvPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const testConnection = async () => {
    if (!supabaseUrl) {
      alert("❌ NEXT_PUBLIC_SUPABASE_URL is not set!")
      return
    }

    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey || '',
          'Authorization': `Bearer ${supabaseKey || ''}`,
        },
      })
      
      if (response.ok) {
        alert(`✅ Connection successful! Status: ${response.status}`)
      } else {
        alert(`⚠️ Connection returned status: ${response.status}`)
      }
    } catch (error: any) {
      alert(`❌ Connection failed: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Environment Variables Debug</CardTitle>
          <CardDescription>
            Check what environment variables are available in the browser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>
              <div className="mt-1 p-2 bg-muted rounded text-sm font-mono break-all">
                {supabaseUrl || "❌ NOT SET"}
              </div>
            </div>
            
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>
              <div className="mt-1 p-2 bg-muted rounded text-sm font-mono break-all">
                {supabaseKey 
                  ? `${supabaseKey.substring(0, 40)}... (${supabaseKey.length} chars)` 
                  : "❌ NOT SET"}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={testConnection} className="w-full">
              Test Supabase Connection
            </Button>
          </div>

          <div className="pt-4 border-t text-sm text-muted-foreground space-y-2">
            <p><strong>If variables show as "NOT SET":</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Check your <code className="bg-muted px-1 rounded">.env.local</code> file exists</li>
              <li>Restart your dev server: <code className="bg-muted px-1 rounded">pkill -f "next dev" && npm run dev</code></li>
              <li>Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)</li>
            </ol>
            
            <p className="pt-2"><strong>If URL is set but connection fails:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Verify the URL in Supabase Dashboard → Settings → API</li>
              <li>The project reference ID might be incorrect</li>
              <li>Run: <code className="bg-muted px-1 rounded">node fix-supabase-config.js</code></li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



