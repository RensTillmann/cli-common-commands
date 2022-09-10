## Quick commands (if you know what you are doing)

```bash

One liner:

df -h;
sudo fallocate -l 1G /swapfile;
ls -lh /swapfile;
sudo chmod 600 /swapfile;
sudo mkswap /swapfile;
sudo swapon /swapfile;
sudo cp /etc/fstab /etc/fstab.bak;
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab;
sudo sysctl vm.swappiness=10;
sudo sysctl vm.vfs_cache_pressure=50;
sudo vim /etc/sysctl.conf

vm.swappiness=10
vm.vfs_cache_pressure=50


df -h
sudo fallocate -l 1G /swapfile
ls -lh /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
sudo sysctl vm.swappiness=10
sudo sysctl vm.vfs_cache_pressure=50
sudo vim /etc/sysctl.conf
vm.swappiness=10
vm.vfs_cache_pressure=50
```

## Step by step

1. Add swap if necessary

1.1 Check if the system has any configured Swap

```bash
sudo swapon --show
```

1.2 Verify that there is no active Swap

```bash
free -h
```

1.3 Create swap file on an existing partition, find the current disk

Example: **/dev/vda1**

```bash
df -h
```

1.4 Create a Swap file

```bash
sudo fallocate -l 1G /swapfile
```

1.5 Verify that the correct amount of space was reserved:

```bash
ls -lh /swapfile
```

1.6 Make the file only accessible to root by typing:

```bash
sudo chmod 600 /swapfile
```

1.7 Verify the permissions:

```bash
ls -lh /swapfile
```

1.8 Mark the file as swap space:

```bash
sudo mkswap /swapfile
```

1.9 Enable the swap file:

```bash
sudo swapon /swapfile
```

1.10 Verify that the swap is available:

```bash
sudo swapon --show
free -h
```

1.11 Make the Swap File Permanent

```bash
sudo cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

1.12 Tweak Swap Settings

```bash
sudo sysctl vm.swappiness=10
sudo vim /etc/sysctl.conf
vm.swappiness=10

sudo sysctl vm.vfs_cache_pressure=50
sudo vim /etc/sysctl.conf
vm.vfs_cache_pressure=50
```
