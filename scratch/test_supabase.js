import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pxhhlywtwaoolnixcnpg.supabase.co'
const supabaseKey = 'sb_publishable_-SR7t8dhSZl20edDscsb_g_Y15lahpD'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
  const data = {
    name: 'Nahash',
    email: 'duotsy@gmail.com',
    message: 'Subject: logo making\nPhone: 9778237894\nso i want rython lo',
  }
  const { data: result, error } = await supabase.from('contact_submissions').insert([data])
  if (error) {
    console.error('Error inserting:', error)
  } else {
    console.log('Success:', result)
  }
}

testInsert()
