# Create User/FTP account


**Create group:**

	sudo groupadd clients

**Create user:**
	
	sudo adduser john

	sudo useradd -m john -g www-data -s /usr/sbin/nologin
	sudo useradd -m john -g clients -s /usr/sbin/nologin

### Always use adduser and deluser (when deleting users)

_What is the difference between the commands adduser and useradd on Ubuntu?_

_`useradd` is native binary compiled with the system. But, `adduser` is a perl script which uses useradd binary in back-end._
_`adduser` is more user friendly and interactive than its back-end  useradd. There's no difference in features provided._
_`useradd` command wont create `'/home/username'` directory but `adduser` command will, but `useradd` with the `-m` option will create the home directory._


**Set user password:**
	
	sudo passwd john

**Set user root:**
	
	sudo chown root /home/john

**Create folder:**
	
	sudo mkdir /home/john/www

**Change ownership of created folder:**
	
	sudo chown john:clients /home/john/www


**Delete all instances of user (delete user):**
	
	sudo userdel -r john
	sudo userdel john
	sudo rm -rf /home/john


**Create the user like this:**

	sudo adduser ftpuser


**Change ownership:**

	sudo chown root:root /home/ftpuser
	sudo chown root:root /var/www/site


	sudo mkdir /home/ftpuser/files

	sudo chown ftpuser:ftpuser /home/ftpuser/files
	sudo chown -R www-data:www-data /var/www/site
	

**Change permissions:**

	chmod 755 /var/www/site


**Change user home directory:**

	sudo usermod -d /var/www/site john


**Change user password:**

	sudo passwd john