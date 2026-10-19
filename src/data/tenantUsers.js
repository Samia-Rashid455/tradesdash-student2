// Sample users for each tenant (key = tenant id)
export const tenantUsers = {
  1: [
    { name: 'Ali Khan', email: 'ali@quickfix.co.uk', role: 'Owner' },
    { name: 'Dan Moore', email: 'dan@quickfix.co.uk', role: 'Engineer' },
    { name: 'Priya Shah', email: 'priya@quickfix.co.uk', role: 'Office admin' },
  ],
  2: [
    { name: 'Sara Ahmed', email: 'sara@fenwick.co.uk', role: 'Owner' },
    { name: 'Luke Fenwick', email: 'luke@fenwick.co.uk', role: 'Engineer' },
  ],
  3: [
    { name: 'Usman Raza', email: 'usman@razaheating.co.uk', role: 'Owner' },
    { name: 'Zain Ali', email: 'zain@razaheating.co.uk', role: 'Engineer' },
  ],
  4: [
    { name: 'Tom Briggs', email: 'tom@topnotch.co.uk', role: 'Owner' },
    { name: 'Joe Hart', email: 'joe@topnotch.co.uk', role: 'Roofer' },
  ],
  5: [
    { name: 'Hina Malik', email: 'hina@brightspark.co.uk', role: 'Owner' },
    { name: 'Omar Sheikh', email: 'omar@brightspark.co.uk', role: 'Engineer' },
    { name: 'Kate Dunn', email: 'kate@brightspark.co.uk', role: 'Office admin' },
  ],
  6: [{ name: 'James Cole', email: 'james@hotwaterheroes.co.uk', role: 'Owner' }],
}

// Sample usage numbers for each tenant
export const tenantUsage = {
  1: { quotes: 42, invoices: 38, whatsapp: 120 },
  2: { quotes: 9, invoices: 4, whatsapp: 15 },
  3: { quotes: 27, invoices: 22, whatsapp: 64 },
  4: { quotes: 18, invoices: 16, whatsapp: 40 },
  5: { quotes: 66, invoices: 59, whatsapp: 210 },
  6: { quotes: 3, invoices: 1, whatsapp: 5 },
}

export const planLimits = {
  Starter: 3,
  Pro: 10,
}