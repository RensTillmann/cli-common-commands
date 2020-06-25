# Create a swarm

## Open ports on all nodes:
```
# TCP port 2377 for cluster management communications
ufw allow 2377/tcp
ufw allow proto tcp from 10.116.0.0/20 to 10.116.0.0/20 port 2377 comment 'swarm 2377 tcp'

# TCP and UDP port 7946 for communication among nodes
ufw allow 7946
ufw allow from 10.116.0.0/20 to 10.116.0.0/20 comment 'swarm 7946 tcp/udp'

# UDP port 4789 for overlay network traffic
ufw allow 4789/udp
ufw allow proto udp from 10.116.0.0/20 to 10.116.0.0/20 port 4789 comment 'swarm 4789 udp'

# When using an overlay network with encryption (--opt encrypted), you also need to ensure ip protocol 50 (ESP) traffic is allowed.
ufw allow proto esp from 10.116.0.0/20 to 10.116.0.0/20 comment 'ip protocol 50 (ESP)'
```

## Initialize the swarm:
```
ssh manager1
ifconfig
docker swarm init --advertise-addr 10.116.0.X
# Check state of swarm
docker info
# View information about nodes:
docker node ls
```

## Add nodes to the swarm
```
# Retrieve join token from manager
ssh manager1
docker swarm join-token worker
# SSH into the workers, and run the join command
# Check if the nodes were succesfully added to the swarm on the manger node
docker node ls
```

## Deploy a service to the swarm
```
ssh manager1
docker service create --replicas 1 --name helloworld alpine ping docker.com
docker service ls
# Inspect service
ssh manager1
docker service inspect --pretty <SERVICE-ID>
# See which nodes are running the service
docker service ps <SERVICE-ID>
# See details about the container for this task (Containers running in a service are called "tasks".)
ssh workerX
docker ps
```

## Publish a port for a service (ingress routing mesh)
```
# (You need to inspect the task to determine the port.)
docker service create \
  --name <SERVICE-NAME> \
  --publish published=<PUBLISHED-PORT>,target=<CONTAINER-PORT> \
  <IMAGE>
# NGINX example:
docker service create \
  --name my-web \
  --publish published=8080,target=80 \
  --replicas 2 \
  nginx
# Publish port for an existing service
docker service update \
  --publish-add published=<PUBLISHED-PORT>,target=<CONTAINER-PORT> \
  <SERVICE>
# Inspect the service's published port
docker service inspect --format="{{json .Endpoint.Spec.Ports}}" my-web
# Publish a port for TCP and/or UDP
docker service create --name dns-cache \
  --publish published=53,target=53 \
  --publish published=53,target=53,protocol=udp \
  dns-cache
# Bypass the routing mesh
docker service create --name dns-cache \
  --publish published=53,target=53,protocol=udp,mode=host \
  --mode global \
  dns-cache
```

## Scale the service in the swarm
```
ssh manager1
docker service scale <SERVICE-ID>=<NUMBER-OF-TASKS>
# See the updated task list
docker service ps <SERVICE-ID>
# See container running
docker ps
```

## Apply rolling updates to a service (using Redis service as an example here)
```
docker service create --replicas 3 --name redis --update-delay 10s redis:3.0.6
# Inspect the Redis service
docker service inspect --pretty redis
docker service ps redis
# Update the container image for redis
docker service update --image redis:3.0.7 redis
# Inspect update status
docker service inspect --pretty redis
# If your update paused due to failure
# In case of an update paused due to a FAILURE, restart the update
# (To avoid repeating certain update failures, you may need to reconfigure the service by passing flags to docker service update.)
docker service update redis
# Watch rolling updates
docker service ps redis
```

## Delete the service running on the swarm
```
docker service rm <SERVICE-ID>
# Verify removal of service
docker service inspect <SERVICE-ID>
# Even though the service no longer exists, the task containers take a few seconds to clean up. 
# You can use `docker ps` on the nodes to verify when the tasks have been removed.
ssh workerX
docker ps
```

## Drain a node on the swarm
```
ssh manager1
# Verify all nodes are actively available
docker node ls
# See how the swarm manager assigned the tasks to different nodes
docker service ps redis
# Drain a node that had a task assigned to it
docker node update --availability drain workerX
# Verify availability was updated
docker node inspect --pretty workerX
# Check how the swarm updated the task assignments accross nodes
docker service ps redis
# Return drained node to active state
docker node update --availability active workerX
# Verify availability was updated
docker node inspect --pretty workerX
```

## Set up a Docker registry
```
# Start the registry as a service on your swarm
docker service create --name registry --publish published=5000,target=5000 registry:2
# Check registry status
docker service ls
# Check that it's working with cURL:
curl http://localhost:5000/v2/
```

## Create Image
```
# Init modules and use vendor (vgo/dep)
export GO111MODULE=on
go mod init
go mod vendor # if you have vendor/ folder, will automatically integrate
go build

# Dockerfile
FROM golang:1.14.4
ADD . /app
WORKDIR /app
ENTRYPOINT ["./main"]

# Build image
go build && docker build -t <your_username>/repo . && docker run -p 80:8081 <your_username>/repo
                                     docker run -it --rm --name my-running-app app-image

# Push image to Docker hub
docker login
docker push <your_username>/repo


```





