# Redis Development Environment Setup

This document provides detailed information about setting up and interacting with a Redis development environment using Docker.

## Getting Started

### Setting up Redis Server

There are two ways to set up the Redis server:

#### 1. Using Docker Compose (Recommended)
```
docker-compose up -d
```

This command:
- Starts Redis container based on the configuration in docker-compose.yml
- `-d` flag runs the container in detached mode (in the background)
- Creates a persistent volume for data storage
- Exposes Redis on port 6379

#### 2. Using Docker Run Command
```
docker run -d \
    --name redis-dev \
    -p 6379:6379 \
    -v $(pwd)/data:/data \
    redis:latest \
    redis-server --appendonly yes
```

This command:
- `-d`: Runs container in detached mode
- `--name redis-dev`: Names the container 'redis-dev'
- `-p 6379:6379`: Maps container's port 6379 to host's port 6379
- `-v $(pwd)/data:/data`: Creates a volume for persistent data storage
- `--appendonly yes`: Enables Redis persistence

### Accessing Redis

#### Accessing Container Shell
```
docker exec -it redis-dev bash 
```

This command:
- `exec`: Executes a command in a running container
- `-it`: Provides an interactive terminal
- `redis-dev`: The name of the container
- `bash`: The command to run (opens a bash shell)

#### Using Redis CLI
```
redis-cli
```

This opens the Redis command-line interface where you can execute Redis commands directly.

### Common Redis Commands

#### List All Keys
```
keys *
```

This command shows all keys stored in the Redis database. Note: Use with caution in production as it can be slow on large datasets.

### Stopping the Server

If using docker-compose:
```
docker-compose down
```

If using docker run:
```
docker stop redis-dev
docker rm redis-dev
```

