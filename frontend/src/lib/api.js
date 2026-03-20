const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:5174'

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`

  let res
  try {
    res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })
  } catch (err) {
    // Network/DNS/connection issues
    throw new Error(
      `Could not reach TrustHire backend at ${API_BASE_URL}. Please ensure the backend server is running.`,
    )
  }

  let data = null
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      data = await res.json()
    } catch {
      // ignore JSON parse errors and fall back to generic text
    }
  }

  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`
    throw new Error(message)
  }

  return data
}

export async function analyzeOffer({ text }) {
  return request('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}


