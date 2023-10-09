all:
	@docker compose -f docker-compose.yml up
  
down:
	@docker compose -f docker-compose.yml down --volumes;\
	rm -rf /tmp/data/backend /tmp/data/database 
  
re: down
	@docker compose -f docker-compose.yml up --build;\
	mkdir /tmp/data/backend /tmp/data/database 


clean:
	@docker stop $$(docker ps -aq);\
	docker rm $$(docker ps -aq);\
	docker rmi $$(docker images -aq);\
	docker volume rm $$(docker volume ls -q);\
	docker network rm $$(docker network ls -q);
  
.PHONY: all re down clean