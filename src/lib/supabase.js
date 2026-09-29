import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pxhhlywtwaoolnixcnpg.supabase.co'
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_-SR7t8dhSZl20edDscsb_g_Y15lahpD'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
    console.warn('Supabase environment variables are missing from process/env. Using fallbacks.')
}

export const supabase = createClient(
    supabaseUrl,
    supabasePublishableKey
)