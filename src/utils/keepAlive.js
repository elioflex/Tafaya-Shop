// Keep backend alive by pinging every 10 minutes
import API_URL from '../config'

let pingInterval = null

export const startKeepAlive = () => {
  // Don't run in development
  if (!import.meta.env.PROD) return
  
  // Ping immediately
  pingBackend()
  
  // Then ping every 10 minutes (600000ms)
  pingInterval = setInterval(pingBackend, 600000)
}

export const stopKeepAlive = () => {
  if (pingInterval) {
    clearInterval(pingInterval)
    pingInterval = null
  }
}

const pingBackend = async () => {
  try {
    await fetch(`${API_URL}/api/health`, {
      method: 'GET',
      cache: 'no-cache'
    })
    console.log('Backend pinged successfully')
  } catch (error) {
    console.error('Failed to ping backend:', error)
  }
}
