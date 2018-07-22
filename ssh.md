# SSH commands


**Login with custom Port:**

	ssh -p 12345 user@1.2.3.4


**Rsync to local PC (this will not delete old files):**

	rsync -chavzP -e "ssh -i '/cygdrive/c/Users/John/.ssh/id_rsa'" user@1.2.3.4:/var/www/ /cygdrive/f/server.domain.com/backup


**Rsync to local PC (this will delete files that are no longer used on source):**
	
	rsync -chavzP ––delete -e "ssh -i '/cygdrive/c/Users/John/.ssh/id_rsa'" user@1.2.3.4:/var/www/ /cygdrive/f/server.domain.com/backup


**With automatic password, but avoid this at all times, will be logged as plain text on server in command log:**

	sshpass -p "YOUR_PASSWORD"
