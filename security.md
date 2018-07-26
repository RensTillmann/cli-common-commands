# Security related commands

**Setting up public key auth:**

	# Lists the files in your .ssh directory, if they exist
	ls -al ~/.ssh
	
	# Create SSH key with OpenSSH
	ssh-keygen
	ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

	# start the ssh-agent in the background
	eval $(ssh-agent -s)

	#Add the SSH private key to the ssh-agent (replace id_rsa with the name of the private key file)
	ssh-add ~/.ssh/id_rsa

	# Copy to a server
	ssh-copy-id -i ~/.ssh/id_rsa user@host

	# Test the new key 
	ssh -i ~/.ssh/id_rsa user@host 


**Updating the system:**

	apt-get update
	apt-get upgrade

_(or use dist-upgrade or full-upgrade)_
_Info: [https://askubuntu.com/questions/81585/what-is-dist-upgrade-and-why-does-it-upgrade-more-than-upgrade](https://askubuntu.com/questions/81585/what-is-dist-upgrade-and-why-does-it-upgrade-more-than-upgrade)_


**For autmoatic updates:**

_([https://help.ubuntu.com/lts/serverguide/automatic-updates.html](https://help.ubuntu.com/lts/serverguide/automatic-updates.html))_


**Check which services are accessible:**

	sudo netstat -aptn|grep LISTEN


**Check for file changes in the past 24 hours:**

	find /usr -mtime -1 -ls

_Change /usr to the directory you wish to search for malicious activity_


**Install fail2ban:**

	apt-get install fail2ban

