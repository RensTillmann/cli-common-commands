# SSH commands


**Login with custom Port:**

	ssh -p 12345 user@1.2.3.4


**Rsync to local PC (this will not delete old files):**

	rsync -chavzP -e "ssh -i '/cygdrive/c/Users/John/.ssh/id_rsa'" user@1.2.3.4:/var/www/ /cygdrive/f/server.domain.com/backup


**Rsync to local PC (this will delete files that are no longer used on source):**
	
	rsync -chavzP ––delete -e "ssh -i '/cygdrive/c/Users/John/.ssh/id_rsa'" user@1.2.3.4:/var/www/ /cygdrive/f/server.domain.com/backup


**With automatic password, but avoid this at all times, will be logged as plain text on server in command log:**

	sshpass -p "YOUR_PASSWORD"


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
