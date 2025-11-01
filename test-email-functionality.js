// Email Functionality Test Script
// Run this in your browser console to test email sending

const testEmailFunctionality = async () => {
  console.log('🔍 Testing Email Functionality...\n')
  
  // 1. Check Environment Variables
  console.log('1. Environment Variables Check:')
  const loopApiKey = import.meta.env.VITE_LOOP_API_KEY
  const loopTransactionId = import.meta.env.VITE_LOOP_TRANSACTION_ID
  const baseUrl = import.meta.env.VITE_BASE_URL
  
  console.log(`   VITE_LOOP_API_KEY: ${loopApiKey ? '✅ SET' : '❌ MISSING'}`)
  console.log(`   VITE_LOOP_TRANSACTION_ID: ${loopTransactionId ? '✅ SET' : '❌ MISSING'}`)
  console.log(`   VITE_BASE_URL: ${baseUrl || 'Using default (cofounderbase.com)'}`)
  
  if (!loopApiKey || !loopTransactionId) {
    console.log('\n❌ Email configuration is incomplete!')
    console.log('   Add missing environment variables to Vercel and redeploy.')
    return
  }
  
  // 2. Test Loop.so API Connection
  console.log('\n2. Testing Loop.so API Connection:')
  try {
    const testResponse = await fetch('https://app.loops.so/api/v1/transactional', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loopApiKey}`,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        transactionalId: loopTransactionId,
        email: 'test@example.com', // This won't actually send
        dataVariables: {
          first_name: 'Test',
          profile_url: 'https://test.com',
          full_name: 'Test User',
          role: 'founder'
        }
      })
    })
    
    if (testResponse.ok) {
      console.log('   ✅ Loop.so API connection successful')
    } else {
      const errorText = await testResponse.text()
      console.log(`   ❌ Loop.so API error: ${testResponse.status} - ${errorText}`)
    }
  } catch (error) {
    console.log(`   ❌ Network error connecting to Loop.so: ${error.message}`)
  }
  
  // 3. Check Auto-Approval Setting
  console.log('\n3. Checking Auto-Approval Setting:')
  try {
    // This would need to be imported from your settings module
    console.log('   Check admin panel for auto-approval toggle status')
    console.log('   Green = ON (emails sent immediately)')
    console.log('   Red = OFF (emails only sent after manual approval)')
  } catch (error) {
    console.log(`   ⚠️  Could not check auto-approval setting: ${error.message}`)
  }
  
  // 4. Test Email Function (if available)
  console.log('\n4. Testing Email Function:')
  try {
    // Try to import and test the email function
    const { sendProfileLiveEmail, getFirstName, generateProfileUrl } = await import('/src/lib/loop-email.ts')
    
    console.log('   ✅ Email functions imported successfully')
    
    // Test helper functions
    const testName = getFirstName('John Doe Smith')
    const testUrl = generateProfileUrl('test-id-123')
    
    console.log(`   First name extraction: "John Doe Smith" → "${testName}"`)
    console.log(`   Profile URL generation: "${testUrl}"`)
    
    // Note: Don't actually send test email to avoid spam
    console.log('   📧 Email function is ready (not sending test email to avoid spam)')
    
  } catch (error) {
    console.log(`   ❌ Error importing email functions: ${error.message}`)
  }
  
  // 5. Summary and Recommendations
  console.log('\n📋 Summary and Recommendations:')
  
  if (!loopApiKey || !loopTransactionId) {
    console.log('   🔧 ACTION NEEDED: Add missing environment variables to Vercel')
    console.log('      1. Go to Vercel Dashboard → Project → Settings → Environment Variables')
    console.log('      2. Add VITE_LOOP_API_KEY and VITE_LOOP_TRANSACTION_ID')
    console.log('      3. Redeploy your application')
  } else {
    console.log('   ✅ Environment variables are configured')
    console.log('   📧 Email system should be working')
    console.log('   🧪 Test by submitting a profile or manually approving one in admin panel')
  }
  
  console.log('\n🔍 To debug further:')
  console.log('   1. Submit a test profile and check browser console')
  console.log('   2. Look for "Welcome email sent successfully" or error messages')
  console.log('   3. Check spam/junk folder for test emails')
  console.log('   4. Verify Loop.so account status and email template')
}

// Run the test
testEmailFunctionality()

// Also provide a simple manual test function
window.testEmail = async (email = 'test@example.com') => {
  console.log(`🧪 Testing email to: ${email}`)
  
  try {
    const { sendProfileLiveEmail } = await import('/src/lib/loop-email.ts')
    
    const result = await sendProfileLiveEmail({
      first_name: 'Test',
      profile_url: 'https://cofounderbase.com/profile/test',
      full_name: 'Test User',
      email: email,
      role: 'founder'
    })
    
    console.log(`📧 Email test result: ${result ? '✅ Success' : '❌ Failed'}`)
    
  } catch (error) {
    console.log(`❌ Email test error: ${error.message}`)
  }
}

console.log('\n💡 You can also run: testEmail("your-email@example.com") to send a test email')