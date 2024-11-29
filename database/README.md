#### Helpful Commands

##### Running the redis server in a docker container
```
docker run -d \
    --name redis-dev \
    -p 6379:6379 \
    -v $(pwd)/data:/data \
    redis:latest \
    redis-server --appendonly yes
```

##### Log into the docker container
```
docker exec -it redis-dev bash 
```

##### Redis CLI 
```
redis-cli
```

##### Get all the keys in Redis
```
keys *
```
