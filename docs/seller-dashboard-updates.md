# تحديثات السيلر داشبورد - البيانات الديناميكية

## نظرة عامة
تم تحديث صفحة السيلر داشبورد لتكون جميع البيانات ديناميكية من اللوكال ستورج بدلاً من البيانات الثابتة.

## الملفات المحدثة

### 1. `pages/sellerdashboard/index.html`
- تم تحديث الإحصائيات لتكون ديناميكية
- تم تحديث جدول المنتجات الحديثة
- تم تحديث بيانات الطلبات
- تم إضافة ملفات JavaScript الجديدة

### 2. `src/js/seller-dashboard.js` (جديد)
- إدارة شاملة للسيلر داشبورد
- استخدام مدراء البيانات المنفصلين
- تحديث تلقائي للبيانات كل 30 ثانية
- إدارة الرسم البياني

### 3. `src/js/products-data.js` (جديد)
- إدارة بيانات المنتجات
- فلترة المنتجات حسب السيلر
- إحصائيات المنتجات
- البحث والتصفية

### 4. `src/js/orders-data.js` (جديد)
- إدارة بيانات الطلبات
- فلترة الطلبات حسب السيلر
- إحصائيات الطلبات
- بيانات الرسم البياني

## الميزات الجديدة

### الإحصائيات الديناميكية
- **إجمالي الإيرادات**: محسوبة من الطلبات المكتملة
- **إجمالي المنتجات**: عدد منتجات السيلر
- **إجمالي الطلبات**: عدد الطلبات التي تحتوي على منتجات السيلر
- **إجمالي الوحدات المباعة**: من الطلبات المكتملة

### جدول المنتجات الحديثة
- عرض آخر 5 منتجات تم إضافتها
- حالة الموافقة (معتمدة، معلقة، مرفوضة)
- معلومات المنتج الأساسية

### بيانات الطلبات
- **الطلبات الحديثة**: آخر 3 طلبات
- **أفضل المنتجات مبيعاً**: حسب عدد الوحدات المباعة

### الرسم البياني
- بيانات المبيعات لآخر 7 أيام
- الإيرادات والوحدات المباعة
- تحديث تلقائي

## كيفية العمل

### 1. تحميل البيانات
```javascript
// تحميل المنتجات
const productsData = localStorage.getItem("products");
this.products = productsData ? JSON.parse(productsData) : [];

// تحميل الطلبات
const ordersData = localStorage.getItem("seller_orders");
this.orders = ordersData ? JSON.parse(ordersData) : [];
```

### 2. فلترة البيانات
```javascript
// فلترة المنتجات للسيلر
this.sellerProducts = this.products.filter(product => 
    product.sellerId == this.currentUser.id
);

// فلترة الطلبات للسيلر
this.sellerOrders = this.orders.filter(order => {
    return order.products && order.products.some(product => 
        this.isProductBelongsToSeller(product.id)
    );
});
```

### 3. حساب الإحصائيات
```javascript
// إحصائيات الطلبات
const orderStats = this.ordersManager.getOrderStatistics();
// إحصائيات المنتجات
const productStats = this.productsManager.getProductsStatistics();
```

## التحديث التلقائي

### 1. عند تغيير التبويب
```javascript
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        this.refreshData();
    }
});
```

### 2. كل 30 ثانية
```javascript
setInterval(() => {
    this.refreshData();
}, 30000);
```

## إدارة الأخطاء

### 1. تحميل البيانات
```javascript
try {
    const data = localStorage.getItem("key");
    this.items = data ? JSON.parse(data) : [];
} catch (error) {
    console.error("Error loading data:", error);
    this.items = [];
}
```

### 2. فك التشفير
```javascript
try {
    const bytes = CryptoJS.AES.decrypt(data, "secret_key");
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
} catch (error) {
    console.error("Decryption failed:", error);
    return "{}";
}
```

## الأمان

### 1. التحقق من المستخدم
```javascript
if (!currentUser) {
    window.location.href = '../../pages/login/index.html';
    return;
}

if (currentUser.role !== "seller" && currentUser.role !== "admin") {
    window.location.href = '../../index.html';
    return;
}
```

### 2. فلترة البيانات
- السيلر يرى فقط منتجاته وطلباته
- الأدمن يرى جميع البيانات
- التحقق من ملكية المنتجات في الطلبات

## الأداء

### 1. تحميل البيانات مرة واحدة
- تحميل البيانات عند بدء التطبيق
- تحديث البيانات عند الحاجة

### 2. تحديث ذكي
- تحديث فقط العناصر المتغيرة
- عدم إعادة تحميل البيانات الثابتة

### 3. إدارة الذاكرة
- تنظيف الرسوم البيانية القديمة
- إدارة مراجع DOM

## الاستخدام

### 1. تسجيل الدخول كسيلر
```javascript
// بيانات السيلر
{
    "id": 105,
    "firstName": "saeed",
    "lastName": "ebrahim",
    "email": "saeed@gmail.com",
    "role": "seller"
}
```

### 2. عرض البيانات
- الإحصائيات تظهر تلقائياً
- الجداول تتحدث تلقائياً
- الرسوم البيانية تتحدث تلقائياً

### 3. إضافة منتجات جديدة
- المنتجات الجديدة تظهر في الجدول
- الإحصائيات تتحدث تلقائياً

## الدعم

### المتصفحات المدعومة
- Chrome (الإصدار 60+)
- Firefox (الإصدار 55+)
- Safari (الإصدار 12+)
- Edge (الإصدار 79+)

### المتطلبات
- JavaScript مفعل
- LocalStorage مدعوم
- CryptoJS متاح

## استكشاف الأخطاء

### 1. البيانات لا تظهر
- تحقق من تسجيل الدخول
- تحقق من وجود بيانات في localStorage
- تحقق من console للأخطاء

### 2. الإحصائيات غير صحيحة
- تحقق من sellerId في المنتجات
- تحقق من status في الطلبات
- تحقق من حساب الإيرادات

### 3. الرسم البياني لا يعمل
- تحقق من تحميل Chart.js
- تحقق من وجود canvas element
- تحقق من بيانات الرسم البياني
