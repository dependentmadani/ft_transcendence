sleep 12

npx prisma migrate reset

npx prisma migrate dev --name backend

exec $@