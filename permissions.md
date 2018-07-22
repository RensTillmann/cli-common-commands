# Permission commands

**So that you don't mess up other permissions already on the file, use the flag +, such as via:**

	sudo chmod -R o+rw /htdocs/domain.com/public_html
	sudo chown {replace_with_username} /htdocs/domain.com/public_html

	sudo usermod -d /var/www/site john
	chown root:root /var/www/site
	sudo chown -R www-data:www-data /var/www/site
	chmod 755 /var/www/site
