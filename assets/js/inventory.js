let editingRow = null;
let currentLang = localStorage.getItem('lang') || 'ar';

const inventoryTranslations = {
    ar: {
        inventory_title: "إدارة المخزون - Keymerv Warehouse",
        brand_name: "Keymerv Warehouse",
        nav_overview: "الرئيسية",
        nav_orders: "طلبات التغذية",
        nav_supply: "التوريد والموردين",
        nav_inventory: "إدارة المخزون",
        nav_branches: "الفروع",
        nav_settings: "الإعدادات",
        user_name: "أحمد الغامدي",
        user_role: "مدير المستودع الرئيسي",
        logout: "خروج",
        inventory_header: "إدارة المخزون الرئيسي",
        stat_total_items: "إجمالي الأصناف",
        stat_low_stock: "أصناف وشيك نفاذها",
        stat_out_stock: "أصناف منتهية",
        search_placeholder: "ابحث عن صنف أو كود SKU...",
        filter_all: "جميع الأصناف",
        filter_available: "الأصناف المتوفرة",
        filter_low: "قاربت على النفاذ",
        filter_out: "الأصناف المنتهية",
        delete_selected_btn: "🗑️ حذف المحدد",
        download_template_btn: "📄 تنزيل نموذج الإكسيل",
        upload_excel_btn: "📊 رفع شيت الإكسيل",
        download_all_btn: "📥 تصدير الأصناف",
        add_item_btn: "+ إضافة صنف",
        pagination_show: "عرض",
        pagination_per_page: "صنف لكل صفحة",
        pagination_info: "عرض {count} من أصل {total} صنف",
        th_sku: "كود SKU",
        th_item_name: "اسم الصنف",
        th_category: "التصنيف",
        th_quantity: "الكمية الحالية",
        th_min_limit: "الحد الأدنى",
        th_unit: "الوحدة",
        th_status: "الحالة",
        th_actions: "الإجراءات",
        edit_btn: "تعديل",
        status_available: "متوفر",
        status_low: "قارب على النفاذ",
        status_out: "منتهي",
        unit_piece: "قطعة",
        unit_bag: "كيس",
        unit_carton: "كرتون",
        unit_gram: "بالغرام",
        modal_add_title: "إضافة صنف جديد",
        modal_edit_title: "تعديل صنف"
    },
    en: {
        inventory_title: "Inventory Management - Keymerv Warehouse",
        brand_name: "Keymerv Warehouse",
        nav_overview: "Overview",
        nav_orders: "Replenishment Orders",
        nav_supply: "Supply & Suppliers",
        nav_inventory: "Inventory Management",
        nav_branches: "Branches",
        nav_settings: "Settings",
        user_name: "Ahmed Al-Ghamdi",
        user_role: "Main Warehouse Manager",
        logout: "Logout",
        inventory_header: "Main Inventory Management",
        stat_total_items: "Total Items",
        stat_low_stock: "Low Stock Items",
        stat_out_stock: "Out of Stock",
        search_placeholder: "Search item name or SKU...",
        filter_all: "All Items",
        filter_available: "Available Items",
        filter_low: "Low Stock",
        filter_out: "Out of Stock",
        delete_selected_btn: "🗑️ Delete Selected",
        download_template_btn: "📄 Download Template",
        upload_excel_btn: "📊 Upload Excel Sheet",
        download_all_btn: "📥 Export Items",
        add_item_btn: "+ Add Item",
        pagination_show: "Show",
        pagination_per_page: "items per page",
        pagination_info: "Showing {count} of {total} items",
        th_sku: "SKU Code",
        th_item_name: "Item Name",
        th_category: "Category",
        th_quantity: "Current Qty",
        th_min_limit: "Min Limit",
        th_unit: "Unit",
        th_status: "Status",
        th_actions: "Actions",
        edit_btn: "Edit",
        status_available: "Available",
        status_low: "Low Stock",
        status_out: "Out of Stock",
        unit_piece: "Piece",
        unit_bag: "Bag",
        unit_carton: "Carton",
        unit_gram: "Gram",
        modal_add_title: "Add New Item",
        modal_edit_title: "Edit Item"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('input', () => clearFieldError(input));
        input.addEventListener('change', () => clearFieldError(input));
    });
    applyInventoryLanguage(currentLang);
    updateStatsAndCounter();
});

function clearFieldError(input) {
    const container = input.closest('.field-container');
    if (!container) return;

    const errorSpan = container.querySelector('.error-msg');
    input.classList.remove('border-rose-500');
    if (errorSpan) {
        errorSpan.classList.add('hidden');
        errorSpan.innerText = '';
    }
}

function showFieldError(input, message) {
    const container = input.closest('.field-container');
    if (!container) return;

    const errorSpan = container.querySelector('.error-msg');
    input.classList.add('border-rose-500');
    if (errorSpan) {
        errorSpan.innerText = message;
        errorSpan.classList.remove('hidden');
    }
}

function validateModalForm() {
    let isValid = true;
    const requiredFields = [
        { id: 'modal-sku', msgAr: 'كود SKU مطلوب', msgEn: 'SKU code is required' },
        { id: 'modal-name-ar', msgAr: 'اسم الصنف بالعربي مطلوب', msgEn: 'Arabic name is required' },
        { id: 'modal-name-en', msgAr: 'اسم الصنف بالانجليزي مطلوب', msgEn: 'English name is required' },
        { id: 'modal-cat-ar', msgAr: 'التصنيف بالعربي مطلوب', msgEn: 'Arabic category is required' },
        { id: 'modal-cat-en', msgAr: 'التصنيف بالانجليزي مطلوب', msgEn: 'English category is required' },
        { id: 'modal-qty', msgAr: 'الكمية الحالية مطلوبة', msgEn: 'Current quantity is required' },
        { id: 'modal-min', msgAr: 'الحد الأدنى مطلوب', msgEn: 'Minimum limit is required' },
        { id: 'modal-unit', msgAr: 'يرجى اختيار الوحدة', msgEn: 'Please select a unit' }
    ];

    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input || !input.value || !input.value.trim()) {
            const msg = currentLang === 'ar' ? field.msgAr : field.msgEn;
            showFieldError(input, msg);
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });

    return isValid;
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', currentLang);
    applyInventoryLanguage(currentLang);
}

function applyInventoryLanguage(lang) {
    const htmlRoot = document.getElementById('html-root');
    htmlRoot.setAttribute('lang', lang);
    htmlRoot.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    document.getElementById('lang-btn').innerText = lang === 'ar' ? 'English' : 'عربي';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (inventoryTranslations[lang] && inventoryTranslations[lang][key]) {
            el.innerText = inventoryTranslations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (inventoryTranslations[lang] && inventoryTranslations[lang][key]) {
            el.placeholder = inventoryTranslations[lang][key];
        }
    });

    document.querySelectorAll('.inventory-row').forEach(row => {
        const nameAr = row.getAttribute('data-name-ar');
        const nameEn = row.getAttribute('data-name-en');
        const catAr = row.getAttribute('data-cat-ar');
        const catEn = row.getAttribute('data-cat-en');
        const unitVal = row.getAttribute('data-unit-val');

        if (nameAr && nameEn) row.querySelector('.row-name').innerText = lang === 'ar' ? nameAr : nameEn;
        if (catAr && catEn) row.querySelector('.row-category').innerText = lang === 'ar' ? catAr : catEn;
        if (unitVal) {
            const unitText = inventoryTranslations[lang][`unit_${unitVal}`] || unitVal;
            row.querySelector('.row-unit').innerText = unitText;
        }
    });
}
