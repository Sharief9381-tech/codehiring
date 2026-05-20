// Clears all database data except the user king@gmail.com

const PRESERVE_EMAIL = 'king@gmail.com'

async function clearExceptKing() {
  console.log(`Starting cleanup — preserving user: ${PRESERVE_EMAIL}\n`)

  // Check server
  try {
    const health = await fetch('http://localhost:3000/api/health')
    if (!health.ok) throw new Error()
  } catch {
    console.error('Server is not running. Start it with: npm run dev')
    return
  }

  const response = await fetch('http://localhost:3000/api/debug/clear-except-king', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preserveEmail: PRESERVE_EMAIL })
  })

  const data = await response.json()

  if (response.ok && data.success) {
    console.log('Done:', data.message)
    if (data.details) data.details.forEach(d => console.log(' -', d))
  } else {
    console.error('Failed:', data.error || data.message)
  }
}

clearExceptKing().catch(console.error)
