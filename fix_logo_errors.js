// Quick script to fix logo reference errors
import fs from 'fs';
import path from 'path';

const filesToFix = [
  'src/pages/EventDetailPage.jsx',
  'src/pages/CategoriesPage.jsx', 
  'src/pages/AdminEventManagementPage.jsx',
  'src/pages/AdminDashboardPage.jsx',
  'src/pages/BlogDetailPage.jsx',
  'src/pages/AdminLoginPage.jsx',
  'src/pages/SearchResultsPage.jsx',
  'src/components/MobileHeader.jsx'
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add LogoService import if not exists
    if (!content.includes('import LogoService') && content.includes('CacheService.getLogo')) {
      content = content.replace(
        'import CacheService from',
        'import CacheService from\nimport LogoService from \'../services/logoService\''
      );
    }
    
    // Replace CacheService.getLogo with LogoService.getLogo
    content = content.replace(/CacheService\.getLogo/g, 'LogoService.getLogo');
    
    // Replace src={logo} with src={getLogo()}
    content = content.replace(/src=\{logo\}/g, 'src={getLogo()}');
    
    // Replace CacheService.API_BASE_URL with LogoService.API_BASE_URL
    content = content.replace(/CacheService\.API_BASE_URL/g, 'LogoService.API_BASE_URL');
    
    fs.writeFileSync(file, content);
    console.log(`Fixed: ${file}`);
  }
});

console.log('Logo errors fixed!'); 