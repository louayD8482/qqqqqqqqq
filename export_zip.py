import os
import zipfile

def export_full_project(zip_name):
    # قائمة المجلدات والملفات المطلوبة بالكامل للآيفون والأندرويد والويب
    items_to_compress = [
        'src',
        'public',
        'assets',
        'ios',
        'android',
        'package.json',
        'capacitor.config.json',
        'index.html',
        'vite.config.ts',
        'tsconfig.json',
        'tsconfig.node.json',
        'server.ts',
        'metadata.json',
        'README.md',
        'README_NATIVE_APP.md',
        'export_zip.py'
    ]
    
    # ضمان وجود مجلد public إذا أردنا وضع نسخة قابلة للتحميل المباشر في المتصفح
    os.makedirs('public', exist_ok=True)
    
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for item in items_to_compress:
            if os.path.exists(item):
                if os.path.isdir(item):
                    for root, dirs, files in os.walk(item):
                        for file in files:
                            file_path = os.path.join(root, file)
                            # استبعاد ملفات الـ node_modules و الـ git وملفات الـ zip السابقة
                            if 'node_modules' not in file_path and '.git' not in file_path and not file.endswith('.zip'):
                                zipf.write(file_path, file_path)
                elif os.path.isfile(item):
                    zipf.write(item, item)
                    
    print(f"تم إنشاء ملف التصدير الشامل بنجاح: {zip_name}")

if __name__ == "__main__":
    # توليد ملف app-complete.zip الأساسي
    export_full_project('app-complete.zip')
    # نسخة إضافية في مجلد public للتحميل السريع والمباشر من المتصفح
    export_full_project('public/app-complete.zip')
    export_full_project('app-complete-ios-android.zip')
    export_full_project('public/app-complete-ios-android.zip')
