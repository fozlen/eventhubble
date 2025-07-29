import fs from 'fs';

const filesToFix = [
  'src/pages/AdminEventManagementPage.jsx',
  'src/pages/AdminLoginPage.jsx',
  'src/pages/CategoriesPage.jsx',
  'src/components/MobileHeader.jsx'
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add LogoService import if not exists
    if (!content.includes('import LogoService') && content.includes('getLogo()')) {
      content = content.replace(
        'import React',
        'import React\nimport LogoService from \'../services/logoService\''
      );
    }
    
    // Add getLogo function if not exists
    if (!content.includes('const getLogo = () =>') && content.includes('getLogo()')) {
      // Find a good place to add the function (after navigate or useNavigate)
      if (content.includes('useNavigate')) {
        content = content.replace(
          'const navigate = useNavigate()',
          'const navigate = useNavigate()\n\n  // Get logo function\n  const getLogo = () => {\n    return import.meta.env.PROD ? \'/Logo.png\' : \'/assets/Logo.png\'\n  }'
        );
      } else if (content.includes('const navigate')) {
        content = content.replace(
          'const navigate =',
          'const navigate =\n\n  // Get logo function\n  const getLogo = () => {\n    return import.meta.env.PROD ? \'/Logo.png\' : \'/assets/Logo.png\'\n  }\n\n  const navigate ='
        );
      }
    }
    
    fs.writeFileSync(file, content);
    console.log(`Fixed: ${file}`);
  }
});

console.log('getLogo functions added!'); 