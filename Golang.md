# Install Go

```
# upgrade to apply latest security updates
sudo apt-get update
sudo apt-get -y upgrade

# Download Go binary archive file from https://golang.org/dl/
wget https://dl.google.com/go/go1.14.4.linux-amd64.tar.gz

# Extract and install under /usr/local. You can also put this under the home directory (for shared hosting) or other location.
sudo tar -C /usr/local -xzf go1.14.4.linux-amd64.tar.gz

# Add /usr/local/go/bin to the PATH environment variable. 
# You can do this by adding this line to your /etc/profile (for a system-wide installation) or $HOME/.profile:
vim ~/.profile
export GOROOT=/usr/local/go
export GOPATH=$HOME/Projects/Proj1
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH

# Reload variables
source ~/.profile

# Verify Installation
go version

# Confirm environment variables are properly defined
go env

# More info about installing Golang here: https://golang.org/doc/install

```
