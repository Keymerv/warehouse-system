// استيراد مكتبة Supabase من الـ CDN الرسمي
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// بيانات مشروعك الفعلي
const SUPABASE_URL = 'https://jpsybjkydhvoslrnwkoj.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_vRZkK2oAh-1SjWzSX0BcLQ_1TNHbKqO'

// إنشاء عميل Supabase الرئيسي وتصديره
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
