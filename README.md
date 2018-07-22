# Just some useful CLI commands

See each .md for catogorized commands.

**Most used/common:**

	ssh -p 12345 user@1.2.3.4

	git add --all
	git commit -m "added commands"
	git push -u origin master


	mysql -h localhost -u user_us -D database_db -p < /var/www/vhosts/domain.com/httpdocs/dump.sql

	
	find . -type f -exec grep "example" '{}' \; -print
	find /home/username/ -name "*.log"


	scp -r user@1.2.3.4:/path/to/foo /some/remote/directory
	scp ~/Desktopfile.txt user@1.2.3.4:/some/remote/directory
	scp user@1.2.3.4:/some/remote/directory/file.txt ~/Desktop
	scp -r user@1.2.3.4:/path/to/foo /some/remote/directory


	sudo chown -R john:www-data /var/www/domain.com/html
	sudo find /var/www/domain.com/html -type d -exec chmod g+s {} \;
	sudo chmod g+w /var/www/domain.com/html/wp-content
	sudo chmod -R g+w /var/www/domain.com/html/wp-content/themes
	sudo chmod -R g+w /var/www/domain.com/html/wp-content/plugins
	sudo find /var/www/domain.com/html/ -type d -exec chmod 755 {} \;
	sudo find /var/www/domain.com/html/ -type f -exec chmod 644 {} \;


	sudo apt-get update
	sudo apt-get upgrade
	sudo apt-get install build-essential
	sudo apt-get install gcc


	du -sh *
	cp -r /home/hope/files/* /home/hope/backup


	/etc/init.d/nginx start
	sudo service nginx restart
	sudo service nginx reload

	sudo /etc/init.d/apache2 restart

	chmod +x /etc/init.d/php-fastcgi
	update-rc.d php-fastcgi defaults
	sudo /etc/init.d/php-fastcgi start

	sudo service php5-fpm restart (if it throws an error use below):
	sudo pkill php5-fpm; sudo service php5-fpm start

	sudo service mysql restart
	/etc/init.d/mysql restart
