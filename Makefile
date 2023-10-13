all:
	@mkdir /tmp/data;\
	mkdir /tmp/data/backend /tmp/data/database;\
	docker compose -f docker-compose.yml up
  
down:
	@rm -rf /tmp/data;\
	docker compose -f docker-compose.yml down --volumes
	
  
re: down
	@mkdir /tmp/data;\
	mkdir /tmp/data/backend /tmp/data/database;\
	docker compose -f docker-compose.yml up --build;\


clean:
	@docker stop $$(docker ps -aq);\
	docker rm $$(docker ps -aq);\
	docker rmi $$(docker images -aq);\
	docker volume rm $$(docker volume ls -q);\
	docker network rm $$(docker network ls -q);
  
.PHONY: all re down clean