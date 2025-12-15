"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TestAuthPage() {
  const [testEmail, setTestEmail] = useState("")
  const [testPassword, setTestPassword] = useState("")
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const testConnection = async () => {
    setLoading(true)
    setResult("Testing connection...")
    
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT SET"
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "NOT SET"
      
      setResult(`✅ Environment Variables:\nURL: ${url}\nKey: ${key}\n\n`)
      
      // Test auth endpoint
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setResult(prev => prev + `⚠️ Session check: ${error.message}\n(This is normal if not logged in)\n\n`)
      } else {
        setResult(prev => prev + `✅ Supabase client initialized successfully\n\n`)
      }
      
      setResult(prev => prev + "✅ Connection test complete!")
    } catch (err: any) {
      setResult(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testSignup = async () => {
    if (!testEmail || !testPassword) {
      setResult("❌ Please enter email and password")
      return
    }

    setLoading(true)
    setResult("Creating account...")
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: "Test User",
          },
        },
      })

      if (error) {
        setResult(`❌ Signup Failed:\n${error.message}\n\nError Code: ${error.status || "Unknown"}\n\nPossible issues:\n- Email already exists\n- Password too weak\n- Supabase project paused\n- Network issue`)
      } else {
        setResult(`✅ Signup Successful!\n\nUser ID: ${data.user?.id}\nEmail: ${data.user?.email}\nEmail Confirmed: ${data.user?.email_confirmed_at ? "Yes" : "No (check email)"}\n\nYou can now try logging in!`)
      }
    } catch (err: any) {
      setResult(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    if (!testEmail || !testPassword) {
      setResult("❌ Please enter email and password")
      return
    }

    setLoading(true)
    setResult("Logging in...")
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      })

      if (error) {
        setResult(`❌ Login Failed:\n${error.message}\n\nError Code: ${error.status || "Unknown"}\n\nPossible issues:\n- Wrong credentials\n- Email not verified\n- Account doesn't exist`)
      } else {
        setResult(`✅ Login Successful!\n\nUser ID: ${data.user?.id}\nEmail: ${data.user?.email}\nSession: Active`)
      }
    } catch (err: any) {
      setResult(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-background to-muted">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Authentication Test</CardTitle>
            <CardDescription>Test your Supabase connection and authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button onClick={testConnection} disabled={loading} className="w-full">
                Test Connection
              </Button>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Test Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Test Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="TestPassword123!"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={testSignup} disabled={loading} variant="outline">
                  Test Signup
                </Button>
                <Button onClick={testLogin} disabled={loading} variant="outline">
                  Test Login
                </Button>
              </div>
            </div>

            {result && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <pre className="text-sm whitespace-pre-wrap font-mono">{result}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <strong>1. "Invalid API key" or "Invalid credentials"</strong>
              <p className="text-muted-foreground">Check your .env.local file has correct SUPABASE_URL and SUPABASE_ANON_KEY</p>
            </div>
            <div>
              <strong>2. "Email already registered"</strong>
              <p className="text-muted-foreground">The email is already in use. Try a different email or login instead.</p>
            </div>
            <div>
              <strong>3. "Email not confirmed"</strong>
              <p className="text-muted-foreground">Check your email for verification link, or disable email confirmation in Supabase dashboard.</p>
            </div>
            <div>
              <strong>4. "Network error" or "Failed to fetch"</strong>
              <p className="text-muted-foreground">Check if your Supabase project is active (not paused) and the URL is correct.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



