مناحل شيخ الجبل — نسخة GitHub Pages + Firebase

1. ارفع جميع ملفات هذا المجلد إلى مستودع GitHub في الفرع main.
2. تأكد أن index.html موجود في المجلد الرئيسي.
3. اذهب إلى Settings > Pages.
4. من Build and deployment اختر Source = GitHub Actions.
5. سيبدأ Workflow باسم Deploy to GitHub Pages تلقائياً بعد رفع الملفات.

Firebase:
- المشروع: sheikh-apiaries-stamp-card
- فعّل Email/Password و Google من Authentication.
- أضف نطاق GitHub Pages إلى Authorized domains.
- فعّل Firestore Database.

ملاحظة: apiKey الخاص بتطبيق Firebase للويب ليس مفتاحاً سرياً، وتتم حماية البيانات بواسطة Firestore Rules.
