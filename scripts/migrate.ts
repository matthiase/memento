import { runMigrations } from "@/lib/db"

async function main() {
  await runMigrations()
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})