# Create Swarm

```
# TCP port 2377 for cluster management communications
ufw allow 2377/tcp

# TCP and UDP port 7946 for communication among nodes
ufw allow 7946

# UDP port 4789 for overlay network traffic
ufw allow 4789/udp

# When using an overlay network with encryption (--opt encrypted), you also need to ensure ip protocol 50 (ESP) traffic is allowed.
ufw allow proto esp from 10.116.0.0/20 to 10.116.0.0/20 comment 'ip protocol 50 (ESP)'


```

