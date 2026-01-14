"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function ImportForm() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
      setSuccess(null)
    }
  }

  const parseCSV = (text: string) => {
    const lines = text.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    const data = []

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "") continue

      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
      const obj: any = {}

      headers.forEach((header, index) => {
        obj[header] = values[index] || ""
      })

      data.push(obj)
    }

    return data
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a file")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const text = await file.text()
      const data = parseCSV(text)

      alert(
        `Database operations disabled. Would have imported ${data.length} members. Please run SQL scripts to set up the database.`,
      )

      setTimeout(() => {
        router.push("/dashboard/members")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while importing")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/members">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Members
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CSV File Upload</CardTitle>
          <CardDescription>
            Upload a CSV file with member data. The file should include headers: First Name, Last Name, Email, Phone,
            Company, Role/Trade, Location, Status, Member Since, Website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="file">Select CSV File</Label>
              <Input id="file" type="file" accept=".csv" onChange={handleFileChange} />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={!file || isLoading}>
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? "Importing..." : "Import Members"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CSV Format Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
            {`First Name,Last Name,Email,Phone,Company,Role/Trade,Location,Status,Member Since,Website
John,Doe,john@example.com,07123456789,Doe Ltd,Building Services,Edinburgh,Active,January 2025,www.example.com
Jane,Smith,jane@example.com,07987654321,Smith Co,Marketing,Glasgow,Active,February 2025,www.smithco.com`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
