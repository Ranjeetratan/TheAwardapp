// Loop Email Integration for CofounderBase
// Sends notification emails when profiles go live

interface LoopEmailData {
  first_name: string
  profile_url: string
  full_name?: string
  email?: string
  role?: string
}

export const sendProfileLiveEmail = async (profileData: LoopEmailData): Promise<boolean> => {
  const LOOP_API_KEY = import.meta.env.VITE_LOOP_API_KEY
  const LOOP_TRANSACTION_ID = import.meta.env.VITE_LOOP_TRANSACTION_ID

  if (!LOOP_API_KEY || !LOOP_TRANSACTION_ID) {
    console.warn('Loop email configuration missing - emails will not be sent')
    console.log('Profile data that would have been emailed:', profileData)
    // Return true to not block the form submission
    return true
  }

  try {
    const response = await fetch('https://app.loops.so/api/v1/transactional', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOOP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionalId: LOOP_TRANSACTION_ID,
        email: profileData.email,
        dataVariables: {
          first_name: profileData.first_name,
          profile_url: profileData.profile_url,
          full_name: profileData.full_name || profileData.first_name,
          role: profileData.role || 'member'
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Loop email error:', errorData)
      return false
    }

    const result = await response.json()
    console.log('Profile live email sent successfully:', result)
    return true

  } catch (error) {
    console.error('Error sending profile live email:', error)
    return false
  }
}

// Helper function to extract first name from full name
export const getFirstName = (fullName: string): string => {
  return fullName.split(' ')[0] || fullName
}

// Helper function to generate profile URL
export const generateProfileUrl = (profileId: string): string => {
  const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://cofounderbase.com'
  return `${BASE_URL}/profile/${profileId}`
}