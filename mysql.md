# MySQL commands

_Good reference with more info: [https://www.dreamvps.com/tutorials/how-to-use-mysql/](https://www.dreamvps.com/tutorials/how-to-use-mysql/)_


**MySQL login:**

	mysql -u root -p

**Create dump from remote server:**

```
mysqldump --no-tablespaces -P 3310 -h rdbms.strato.de -u username -p dbname > dump.sql
```

**Create dump on local server:**

```
mysqldump --no-tablespaces -u username -p dbname > dump.sql
```

**Copy over to other host:**

```
Local to remote: scp /var/www/html/dump.sql root@1.2.3.4:/var/www/html
Remote to local: scp root@1.2.3.4:/var/www/html/dump.sql /var/www/html
```

**Import MySQL dumb file:**

```
mysql -h localhost -u user_us -D database_db -p < /var/www/vhosts/domain.com/httpdocs/dump.sql
```


**Create new user:**

	CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';
	GRANT ALL PRIVILEGES ON * . * TO 'newuser'@'localhost';
	FLUSH PRIVILEGES;

**Create new user (remote connections):**

	GRANT ALL ON *.* TO 'user'@'localhost' IDENTIFIED BY 'passwd' WITH GRANT OPTION;
	GRANT ALL ON *.* TO 'user'@'%' IDENTIFIED BY 'passwd' WITH GRANT OPTION;
	FLUSH PRIVILEGES;


**Show GRANTS for all users:**

	SELECT sql_grants FROM common_schema.sql_show_grants;


**Show GRANTS for particular users:**
	
	SELECT sql_grants FROM common_schema.sql_show_grants WHERE user='app';


**List of MySQL user information:**

	select * from mysql.user;.
	select User, Host from mysql.user;
	select User, Host, Password from mysql.user;
	select DISTINCT User FROM mysql.user;

**List all the fields in the mysql.user table:**

	desc mysql.user;


**Restart MySQL:**

	/etc/init.d/mysql restart
	


**List of other common possible permissions for users:**

`ALL PRIVILEGES` - as we saw previously, this would allow a MySQL user all access to a designated database (or if no database is selected, across the system)
`CREATE` - allows them to create new tables or databases
`DROP` - allows them to them to delete tables or databases
`DELETE` - allows them to delete rows from tables
`INSERT` - allows them to insert rows into tables
`SELECT` - allows them to use the Select command to read through databases
`UPDATE` - allow them to update table rows
`GRANT OPTION` - allows them to grant or remove other users' privileges
GRANT [type of permission] ON [database name].[table name] TO '[john]'@'localhost';
REVOKE [type of permission] ON [database name].[table name] FROM '[john]'@'localhost';
DROP USER 'john'@'localhost';

**Test out your new user, log out and sign in:**
	
	quit
	mysql -u john -p

**List all databases:**

	SHOW DATABASES;

**Create new database:**

	CREATE DATABASE database_name;

**Delete database:**

	DROP DATABASE database_name;

**Select a database to use:**

	USE webrehab;

**Show tables of selected database:**

	SHOW tables;

**Create new table in database:**

	CREATE TABLE customers (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(20), food VARCHAR(30), confirmed CHAR(1), signup_date DATE);

**Give a description which will remind ourselves about the tables organization:**

	DESCRIBE customers;

_Note that, throughout this, even if the MySQL command line won’t pay attention to cases, the table and database names are case sensitive: customers is not POTLUCK or Potluck._

**Create new row/record in table:**

	INSERT INTO `customers` (`id`,`name`,`food`,`confirmed`,`signup_date`) VALUES (NULL, "John", "Casserole","Y", '2012-04-11');

**Select row/record:**

	SELECT * FROM customers;

**Update row/record:**

	UPDATE `customers` SET `confirmed` = 'Y' WHERE `customers`.`name` ='Sandy';

**Delete row/record from table:**
	
	DELETE from customers  where name='Sandy';


**Add new column to table:**
	
	ALTER TABLE customers ADD email VARCHAR(40);

**Add new column after specified column of a table:**

	ALTER TABLE customers ADD email VARCHAR(40) AFTER name; 

**Remove/delete column from table:**
	
	ALTER TABLE customers DROP email;


**Optimize Tables:**

	mysqlcheck -u john -p --auto-repair --optimize --all-databases

**MySQL Tuner:**

	./mysqltuner.pl

**Slow query log:**
	
	/var/log/mysql/mysql-slow.log

**MySQL config:**

	/etc/mysql/my.cnf
	
**Reset MySQL password:**

	sudo service mysql stop
	sudo mkdir /var/run/mysqld
	sudo chown mysql: /var/run/mysqld
	sudo mysqld_safe --skip-grant-tables --skip-networking &

On another console, log in without a password:

	mysql -uroot mysql
	UPDATE mysql.user SET authentication_string=PASSWORD('YOURNEWPASSWORD'), plugin='mysql_native_password' WHERE User='root' AND Host='localhost'; EXIT;
	sudo mysqladmin -S /var/run/mysqld/mysqld.sock shutdown
	sudo service mysql start
