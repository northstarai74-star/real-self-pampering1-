# Self Pampering

## Deployment configuration

### Airtable certificate storage

The certificate register is stored in Airtable. Create a table named
`Certificates` (or set `AIRTABLE_TABLE_NAME`) with these text fields:

- `Certificate Number`
- `Holder`
- `Course`
- `Issued`
- `Expires`
- `Level`

Create an Airtable personal access token with record read/write access to the
base, then configure these server-side environment variables:

- `AIRTABLE_PERSONAL_ACCESS_TOKEN`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_NAME` (optional; defaults to `Certificates`)

### Supabase customer inquiries

Customer inquiry submissions are stored in the `customer_queries` Supabase
table. Configure these variables so submissions persist across Vercel
deployments:

- `VITE_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side secret)

Without these, the app falls back to in-memory storage, which is not durable on
Vercel.

### Admin password

Set `ADMIN_PASSWORD` to a strong, unique password for the admin dashboard.

For local development, set the variables in the shell before starting the
server. In Vercel, add them under **Project Settings → Environment Variables**
for each environment you deploy. Never expose secret keys through `VITE_`
variables or commit them to source control. `.env.example` lists all required
variable names.
