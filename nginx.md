# Nginx commands

**Tail NGINX error log:**

	tail -20 /var/log/nginx/error.log


### Create a new domain:

**Create the folders:**

	mkdir -p /var/www/domain.com/public_html
	mkdir /var/www/domain.com/logs
	chown -R www-data:www-data /var/www/domain.com


**Create server for domain:**

	// only use the below when you have an existing/example domain available:
	cp /etc/nginx/sites-available/example.com /etc/nginx/sites-available/domain.com


**Update UNIX Sockets Configuration:**

	vi /etc/nginx/sites-available/domain.com

**Config file:**

	server {
	    listen   80;
	    server_name www.domain.com domain.com;
	    access_log /var/www/domain.com/logs/access.log;
	    error_log /var/www/domain.com/logs/error.log;
	    root /var/www/domain.com/public_html;
	    index index.php index.html index.htm;
	    location / {
	        try_files $uri $uri/ /index.php?q=$uri&$args;
	    }
	    error_page 404 /404.html;
	    error_page 500 502 503 504 /50x.html;
	    location = /50x.html {
	        root /usr/share/nginx/html;
	    }
	    location ~ \.php$ {
	        try_files $uri =404;
	        if ($uri !~ "^/images/") {
	            fastcgi_pass unix:/var/run/php5-fpm.sock;
	        }
	        fastcgi_index index.php;
	        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
	        include fastcgi_params;
	    }
	}


**Create symlink for domain:**

	ln -s /etc/nginx/sites-available/domain.com /etc/nginx/sites-enabled/domain.com

**Remove Symlink:**

	unlink /etc/nginx/sites-enabled/domain.com
	ls -l /etc/alternatives

_update-alternatives --config x-cursor-theme_
_(info: https://linux.die.net/man/8/update-alternatives)_
_(info: https://askubuntu.com/questions/233190/what-exactly-does-update-alternatives-do)_

	
