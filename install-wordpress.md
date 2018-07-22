# Install Wordpress

**Create a database:**

	mysql -u root -p

	CREATE DATABASE {database_name}_db;

	CREATE USER {username}_us@localhost IDENTIFIED BY 'password';

	GRANT ALL PRIVILEGES ON {database_name}_db.* TO {username}_us@localhost;

	FLUSH PRIVILEGES;

	exit

**Download WP repository:**
	
	cd ~
	wget http://wordpress.org/latest.tar.g

**Extract contents:**
	
	tar xzvf latest.tar.gz

**Update components that our WP instance will need:**

	sudo apt-get update
	sudo apt-get install php5-gd libssh2-php

**Edit config file:**

	cd ~/wordpress
	cp wp-config-sample.php wp-config.php
	vi wp-config.php


**Create new root directory:**

	sudo mkdir -p /var/www/domain.com/public_html

**Copy the files to this location:**

	sudo rsync -avP ~/wordpress/ /var/www/domain.com/public_html/

**Set permissions:**

	cd /var/www/domain.com/public_html/
	sudo chown -R :www-data /var/www/domain.com/public_html/*

**Create the uploads folder:**

	sudo mkdir -p /var/www/domain.com/public_html/wp-content/uploads
	sudo chown -R :www-data /var/www/domain.com/public_html/wp-content/uploads




# Install Wordpress with Cache plugin


**1. Install Nginx Helper plugin:**
_a. Add following line to wp-config.php and replace cache directory:_

	define('RT_WP_NGINX_HELPER_CACHE_PATH', '/etc/nginx/cache/domain.com');

_b. Set Purge Method to: Delete local server cache files_


**2. Set correct folder permission:**

	sudo chown -R john:www-data /var/www/domain.com/html
	sudo find /var/www/domain.com/html -type d -exec chmod g+s {} \;
	sudo chmod g+w /var/www/domain.com/html/wp-content
	sudo chmod -R g+w /var/www/domain.com/html/wp-content/themes
	sudo chmod -R g+w /var/www/domain.com/html/wp-content/plugins
	sudo find /var/www/domain.com/html/ -type d -exec chmod 755 {} \;
	sudo find /var/www/domain.com/html/ -type f -exec chmod 644 {} \;

**vsftpd add new user:**

	sudo adduser sammy
	usermod --home /var/www/ sammy
	sudo mkdir /home/sammy/ftp
	sudo chown nobody:nogroup /home/sammy/ftp
	sudo chmod a-w /home/sammy/ftp
	sudo ls -la /home/sammy/ftp
	sudo mkdir /home/sammy/ftp/files
	sudo chown sammy:sammy /home/sammy/ftp/files
	sudo ls -la /home/sammy/ftp
	echo "vsftpd test file" | sudo tee /home/sammy/ftp/files/test.txt