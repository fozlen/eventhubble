import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables missing!')
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createOrUpdateAdmin() {
  try {
    const adminEmail = 'admin@eventhubble.com'
    const adminPassword = 'admin123' // Yeni şifre
    const passwordHash = await bcrypt.hash(adminPassword, 10)
    
    console.log('🔍 Checking if admin user exists...')
    
    // Check if admin exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .single()
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }
    
    if (existingUser) {
      console.log('📝 Updating existing admin user...')
      
      // Update existing admin
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          password_hash: passwordHash,
          full_name: 'Event Hubble Admin',
          role: 'admin',
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('email', adminEmail)
        .select()
        .single()
      
      if (updateError) throw updateError
      
      console.log('✅ Admin user updated successfully!')
      console.log('📧 Email:', adminEmail)
      console.log('🔑 Password:', adminPassword)
      console.log('👤 User ID:', updatedUser.id)
      
    } else {
      console.log('➕ Creating new admin user...')
      
      // Create new admin
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          email: adminEmail,
          password_hash: passwordHash,
          full_name: 'Event Hubble Admin',
          role: 'admin',
          is_active: true,
          preferences: {}
        }])
        .select()
        .single()
      
      if (createError) throw createError
      
      console.log('✅ Admin user created successfully!')
      console.log('📧 Email:', adminEmail)
      console.log('🔑 Password:', adminPassword)
      console.log('👤 User ID:', newUser.id)
    }
    
    console.log('\n🎉 Admin credentials ready for login!')
    console.log('🌐 Go to: https://eventhubble.com/admin/login')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createOrUpdateAdmin() 