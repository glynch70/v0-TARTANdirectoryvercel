// Fetch and analyze the CSV data
async function fetchCSVData() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bni_contacts_combined-Ulp9S6k6Gwm51HJy5pR2Q0cquhkBgW.csv",
    )
    const csvText = await response.text()

    console.log("CSV Data Preview:")
    console.log(csvText.substring(0, 500) + "...")

    // Parse CSV
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())
    console.log("Headers:", headers)

    const members = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim())
      if (values.length >= 4) {
        members.push({
          name: values[0],
          company: values[1],
          category: values[2],
          phone: values[3],
        })
      }
    }

    console.log(`Total members: ${members.length}`)
    console.log("Sample members:", members.slice(0, 5))

    // Get unique categories
    const categories = [...new Set(members.map((m) => m.category))].sort()
    console.log("Categories:", categories)

    return members
  } catch (error) {
    console.error("Error fetching CSV:", error)
    return []
  }
}

// Execute the function
fetchCSVData()
