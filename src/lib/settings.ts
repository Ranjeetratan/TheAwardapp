import { supabase } from './supabase'

export interface AdminSetting {
  id: string
  setting_key: string
  setting_value: boolean
  created_at: string
  updated_at: string
}

// Get auto-approval setting
export const getAutoApprovalSetting = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'auto_approve_profiles')
      .single()

    if (error) {
      // If setting doesn't exist, default to true (show all profiles)
      return true
    }

    return data?.setting_value ?? true
  } catch (error) {
    return true // Default to show all profiles
  }
}

// Update auto-approval setting
export const updateAutoApprovalSetting = async (enabled: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_settings')
      .upsert({
        setting_key: 'auto_approve_profiles',
        setting_value: enabled,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error updating auto-approval setting:', {
        message: error.message,
        timestamp: new Date().toISOString()
      })
      return false
    }

    return true
  } catch (error) {
    console.error('Error in updateAutoApprovalSetting:', error)
    return false
  }
}

// Get all admin settings
export const getAllSettings = async (): Promise<AdminSetting[]> => {
  try {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .order('setting_key')

    if (error) {
      console.error('Error fetching settings:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getAllSettings:', error)
    return []
  }
}