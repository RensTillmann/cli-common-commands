# Create a swarm

## Docker Swarm Mode and Traefik for an HTTPS cluster

```
### On the main manager node, run:
docker swarm init

### Additional MANAGER node
docker swarm join-token manager
### Copy paste on manager node
docker swarm join --token SWMTKN-1-5tl7yaasdfd9qt9j0easdfnml4lqbosbasf14p13-f3hem9ckmkhasdf3idrzk5gz 172.173.174.175:2377

### Additional WORKER node
docker swarm join-token worker
### Copy paste on worker node
docker swarm join --token SWMTKN-1-5tl7ya98erd9qtasdfml4lqbosbhfqv3asdf4p13-dzw6ugasdfk0arn0 172.173.174.175:2377
 
### Create a network that will be shared with Traefik and the containers that should be accessible from the outside, with:
docker network create --driver=overlay traefik-public
### Create a volume in where Traefik will store HTTPS certificates:
docker volume create traefik-public-certificates 
### Get the Swarm node ID of this node and store it in an environment variable:
### (you can store certificates in Consul and deploy Traefik in each node as a fully distributed load balancer)
export NODE_ID=$(docker info -f '{{.Swarm.NodeID}}')
### Create a tag in this node, so that Traefik is always deployed to the same node and uses the existing volume:
docker node update --label-add traefik-public.traefik-public-certificates=true $NODE_ID
### Create an environment variable with your email, to be used for the generation of Let’s Encrypt certificates:
export EMAIL=<YOUR@EMAIL.COM>
### Create an environment variable with the name of the host
export USE_HOSTNAME=sub.domain.com
### (or if you hostname configured)
export USE_HOSTNAME=$HOSTNAME

### You will access the Traefik dashboard at `traefik.<your hostname>`, e.g. `traefik.sub.domain.com`. 
### So, make sure that your DNS records point `traefik.<your hostname>` to one of the IPs of the cluster.
### Better if it is the IP where the Traefik service runs (the manager node you are currently connected to).

### Create an environment variable with a username (you will use it for the HTTP Basic Auth), for example:
export USERNAME=admin
### Create an environment variable with the password, e.g.:
export PASSWORD=changethis
### Use openssl to generate the "hashed" version of the password and store it in an environment variable:
export HASHED_PASSWORD=$(openssl passwd -apr1 $PASSWORD)
### You can check the contents with:
echo $HASHED_PASSWORD
### Create a Traefik service, copy this long command in the terminal:
### Must be v1.7.24 or below, because with v2.0+ it fails to create the service
docker service create \
    --name traefik \
    --constraint=node.labels.traefik-public.traefik-public-certificates==true \
    --publish 80:80 \
    --publish 443:443 \
    --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
    --mount type=volume,source=traefik-public-certificates,target=/certificates \
    --network traefik-public \
    --label "traefik.frontend.rule=Host:traefik.$USE_HOSTNAME" \
    --label "traefik.enable=true" \
    --label "traefik.port=8080" \
    --label "traefik.tags=traefik-public" \
    --label "traefik.docker.network=traefik-public" \
    --label "traefik.redirectorservice.frontend.entryPoints=http" \
    --label "traefik.redirectorservice.frontend.redirect.entryPoint=https" \
    --label "traefik.webservice.frontend.entryPoints=https" \
    --label "traefik.frontend.auth.basic.users=${USERNAME}:${HASHED_PASSWORD}" \
    traefik:v1.7.24-alpine \
    --docker \
    --docker.swarmmode \
    --docker.watch \
    --docker.exposedbydefault=false \
    --constraints=tag==traefik-public \
    --entrypoints='Name:http Address::80' \
    --entrypoints='Name:https Address::443 TLS' \
    --acme \
    --acme.email=$EMAIL \
    --acme.storage=/certificates/acme.json \
    --acme.entryPoint=https \
    --acme.httpChallenge.entryPoint=http\
    --acme.onhostrule=true \
    --acme.acmelogging=true \
    --logLevel=INFO \
    --accessLog \
    --api
    
### You will be able to securely access the web UI at `https://traefik.<your domain>` using the created username and password.

### To check if it worked, check the logs:
docker service logs traefik | less

### And open `https://traefik.<your domain>` in your browser, you will be asked for the username and password that 
### you set up before, and you will be able to see the Traefik web UI interface. Once you deploy a stack, 
### you will be able to see it there and see how the different hosts and paths map to different Docker services / containers.

```

    
    
    
    
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

# Push image to Docker Hub
docker login
docker push <your_username>/repo

# Pull image from Docker Hub
docker pull <your_username>/repo

```


## Traefik Swarm Mode Cluster Example

```
# Create a network for Traefik to use
docker network create --driver=overlay traefik-net

# Deploy Traefik as a docker service in our clust, needs to run on a manager node
docker service create \
    --name traefik \
    --constraint=node.role==manager \
    --publish 80:80 --publish 8080:8080 \
    --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
    --network traefik-net \
    traefik:latest \
    --docker \
    --docker.swarmMode \
    --docker.domain=traefik \
    --docker.watch \
    --api
    

# Deploy the app
# Non-Sticky webserver
docker service create \
    --name whoaminonsticky \
    --label traefik.port=80 \
    --network traefik-net \
    containous/whoami
# Sticky webserver
docker service create \
    --name whoamisticky \
    --label traefik.port=80 \
    --network traefik-net \
    --label traefik.backend.loadbalancer.sticky=true \
    containous/whoami"
    
    
    
    
    
# docker-compose.yml example file:
version: '3'

services:
  reverse-proxy:
    image: traefik:v2.2
    command: --api.insecure=false --providers.docker
    ports:
      # The HTTP port
      - "80:80"
      # The Web UI (enabled by --api.insecure=true)
      - "8080:8080"
    volumes:
      # So that Traefik can listen to the Docker events
      - /var/run/docker.sock:/var/run/docker.sock

  whoami:
    # A container that exposes an API to show its IP address
    image: containous/whoami
    labels:
      - "traefik.http.routers.whoami.rule=Host(`whoami.docker.localhost`)"

  api:
    image: renstillmann/app
    labels:
      - "traefik.http.routers.api.rule=Host(`api.domain.com`)"

```

**Confirm Traefik loadbalancer is working properly:**
```
curl -H Host:whoami.docker.localhost http://127.0.0.1/ping
docker service create \
    --name traefik \
    --constraint=node.role==manager \
    --publish 80:80 --publish 8080:8080 \
    --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
    --network traefik-net \
    traefik:v2.2 \
    --docker.swarmMode \
    --docker.domain=traefik \
    --docker.watch \
    --api
```


    
