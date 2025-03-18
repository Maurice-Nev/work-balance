require("dotenv").config({ path: ".env.test" }); 

process.env.NODE_ENV = "test"; 
process.env.NEXT_PUBLIC_SUPABASE_URL=""
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY=""


// name this file to jest.env.js and add variables 