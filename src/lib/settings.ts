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
      console.error('Error fetching auto-approval setting:', error)
      return true // Default to auto-approve if error
    }

    return data?.setting_value ?? true
  } catch (error) {
    console.error('Error in getAutoApprovalSetting:', error)
    return true // Default to auto-approve if error
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
      console.error('Error updating auto-approval setting:', error)
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