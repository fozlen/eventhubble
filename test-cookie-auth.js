// Test cookie-based authentication
const API_BASE_URL = 'https://eventhubble.onrender.com'

async function testCookieAuth() {
  console.log('🧪 Testing Cookie-Based Authentication')
  console.log('=====================================')
  console.log('API URL:', API_BASE_URL)

  try {
    // Test 1: Health check
    console.log('\n1️⃣ Health Check')
    const healthResponse = await fetch(`${API_BASE_URL}/health`)
    const healthData = await healthResponse.json()
    console.log('Health status:', healthData.status)
    console.log('Environment:', healthData.environment)

    // Test 2: Login test
    console.log('\n2️⃣ Login Test')
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@eventhubble.com',
        password: 'admin123'
      }),
      credentials: 'include'
    })

    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      console.log('✅ Login successful')
      console.log('User:', loginData.data?.user?.email)
      console.log('CSRF Token in response:', !!loginData.data?.csrfToken)
      
      // Test 3: Cookie authentication
      console.log('\n3️⃣ Cookie Authentication Test')
      const cookieResponse = await fetch(`${API_BASE_URL}/api/logos`, {
        method: 'GET',
        credentials: 'include'
      })
      
      console.log('Cookie auth status:', cookieResponse.status)
      if (cookieResponse.ok) {
        console.log('✅ Cookie authentication successful')
      } else {
        const errorData = await cookieResponse.json()
        console.log('❌ Cookie authentication failed:', errorData)
      }
      
      // Test 4: Upload endpoint test with cookies
      console.log('\n4️⃣ Upload Endpoint Test (Cookies)')
      const uploadResponse = await fetch(`${API_BASE_URL}/api/logos`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Test Logo Cookie Auth',
          variant: 'test',
          url: 'https://example.com/test-logo-cookie.png'
        })
      })
      
      console.log('Upload status:', uploadResponse.status)
      if (uploadResponse.ok) {
        console.log('✅ Upload with cookies successful')
      } else {
        const errorData = await uploadResponse.json()
        console.log('❌ Upload failed:', errorData)
      }
      
    } else {
      const errorData = await loginResponse.json()
      console.log('❌ Login failed:', errorData)
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testCookieAuth() 