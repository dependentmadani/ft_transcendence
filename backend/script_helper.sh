sleep 12

npx prisma migrate dev --name backend --create-only

exec $@