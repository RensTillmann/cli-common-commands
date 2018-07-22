# Service start/stop commands

**Nginx:**

	/etc/init.d/nginx start
	sudo service nginx restart
	sudo service nginx reload

**Apache:**

	sudo /etc/init.d/apache2 restart

**php-fastcgi:**

	chmod +x /etc/init.d/php-fastcgi
	update-rc.d php-fastcgi defaults
	sudo /etc/init.d/php-fastcgi start

**php5-fpm (PHP processor):**

	sudo service php5-fpm restart (if it throws an error use below):
	sudo pkill php5-fpm; sudo service php5-fpm start

**mysql:**
	
	sudo service mysql restart
	/etc/init.d/mysql restart
