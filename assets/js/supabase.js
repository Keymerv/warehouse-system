import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://jpsybjkydhvoslrnwkoj.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_vRZkK2oAh-1SjWzSX0BcLQ_1TNHbKqO'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
