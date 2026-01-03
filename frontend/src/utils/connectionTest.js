// Connection test utility
export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    
    // Test basic connectivity
    const response = await fetch('/api/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Backend connection successful:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('Backend connection failed:', error);
    return { success: false, error: error.message };
  }
};

export const testAuthEndpoint = async () => {
  try {
    console.log('Testing auth endpoint...');
    
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Auth endpoint response status:', response.status);
    
    if (response.status === 401) {
      console.log('Auth endpoint working (requires authentication as expected)');
      return { success: true, message: 'Auth endpoint working' };
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Auth endpoint test successful:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('Auth endpoint test failed:', error);
    return { success: false, error: error.message };
  }
};

// Run connection tests
export const runConnectionTests = async () => {
  console.log('=== Starting Connection Tests ===');
  
  const backendTest = await testBackendConnection();
  const authTest = await testAuthEndpoint();
  
  console.log('=== Test Results ===');
  console.log('Backend Test:', backendTest.success ? '✅ PASS' : '❌ FAIL');
  console.log('Auth Test:', authTest.success ? '✅ PASS' : '❌ FAIL');
  
  if (!backendTest.success) {
    console.error('Backend connection issue:', backendTest.error);
    console.log('Possible solutions:');
    console.log('1. Ensure backend server is running on port 5000');
    console.log('2. Check if MongoDB is running');
    console.log('3. Verify CORS configuration');
    console.log('4. Check proxy configuration in setupProxy.js');
  }
  
  if (!authTest.success) {
    console.error('Auth endpoint issue:', authTest.error);
  }
  
  return {
    backend: backendTest,
    auth: authTest,
    overall: backendTest.success && authTest.success
  };
};
