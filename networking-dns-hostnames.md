# DNS & Hostnames & Networking

References:
(https://help.ubuntu.com/lts/serverguide/network-configuration.html.en)[https://help.ubuntu.com/lts/serverguide/network-configuration.html.en]


**Get hostname and FQDN:**

	hostname
	hostname --fqdn


**Change hostname and hosts:**

	hostnamectl --static set-hostname webserver1

Oor we can edit it in the host file:

	sudo vi /etc/hostname
	sudo vi /etc/hosts


**Network manager utility:**
	
	sudo apt install network-manager
	sudo /etc/init.d/network-manager start
	nmtui


**IP & interfaces info:**

	ifconfig
	ifconfig -a | less
	ifconfig -v | less
	ifconfig -s
	ip addr show

	ifstat # statistics of interfaces
	iftop # processes/usages of interfaces


**Route tables:**

	routel
	routel | less
	route -n
	netstat -r


**Adding route temporarily:**
	
	route add 10.1.1.0 gw 192.168.1.1

**Adding static route (permanently):**

	sudo vi /etc/network/interfaces

	auto eth0
	iface eth0 inet static
	    address 192.168.1.2
	    netmask 255.255.255.0
	    # network 192.168.1.0
	    # broadcast 192.168.1.255
	    # gateway 192.168.1.1
	    up route add -net 192.168.0.0 netmask 255.255.0.0 gw 192.168.1.1
	    up route add -net 172.16.0.0 netmask 255.240.0.0 gw 192.168.1.1

**Show info from specific interface only:**

	ifconfig eth0

**Change IP of interface temporarily:**

	ifconfig eth0 192.168.1.20
	
	ip addr delete 192.168.1.2 dev enp0s3
	ip addr add 192.168.1.200/24 dev enp0s3


**Change IP of interface permanently:**

	mtui

	netconfig


**Restart network interface:**

	systemctl restart network

	ip addr flush interface-name
	systemctl restart networking.service

_Be Careful, You should not flush IP Address through a SSH connection, Because you will lose the connection to the server immediately after you flushed the network interface._

If you really need to restart network in Ubuntu 16 through a SSH connection, then execute the ip addr flush command and systemctl command as a sequence of commands using bash &&.

	ip addr flush interface-name && systemctl restart networking.service

Restart network

	ifdown eth0 && ifup eth0 	# Ubuntu 14.04 or later
	service networking restart 	# Ubuntu 12.04 or earlier