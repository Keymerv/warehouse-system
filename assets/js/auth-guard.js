import { supabase } from './supabase.js';

// دالة فحص الجلسة والصلاحيات المركزية
async function protectRoute() {
    // 1. فحص وجود جلسة تسجيل دخول نشطة
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        window.location.href = 'login.html';
        return;
    }

    // 2. معرفة اسم الصفحة الحالية تلقائياً من الرابط
    const path = window.location.pathname;
    const pageName = path.split('/').pop().replace('.html', '');

    // إذا كانت الصفحة هي الرئيسية أو تسجيل الدخول، يتخطى فحص الصلاحيات الفرعية
    if (!pageName || pageName === 'dashboard' || pageName === 'index' || pageName === 'login') {
        return;
    }

    // 3. جلب بيانات دور المستخدم والصلاحيات المسموحة من جدول profiles
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, allowed_pages')
        .eq('id', session.user.id)
        .single();

    if (profileError || !profile) {
        console.error('خطأ في قراءة بيانات الصلاحيات:', profileError);
        return;
    }

    // 4. إذا كان مدير/أدمن يتم السماح له بدخول كل الصفحات مباشرة
    if (profile.role === 'admin' || profile.role === 'مدير') {
        return;
    }

    // 5. التحقق مما إذا كانت الصفحة الحالية مسموحة للموظف
    const allowedPages = profile.allowed_pages || [];

    // الربط التلقائي بين اسم الملف ومفتاح الصلاحية
    let isAllowed = allowedPages.includes(pageName);

    // معالجة خاصة لصفحة الطلبات (سواء سميت feeding أو orders)
    if (pageName === 'orders' && (allowedPages.includes('feeding') || allowedPages.includes('orders'))) {
        isAllowed = true;
    }

    // إذا لم تكن الصفحة مسموحة، يظهر التنبيه ويتم توجيهه للرئيسية
    if (!isAllowed) {
        alert('تنبيه: لا تملك صلاحية لدخول هذه الصفحة!');
        window.location.href = 'dashboard.html';
    }
}

// تنفيذ الحماية فور تحميل الصفحة
protectRoute();
