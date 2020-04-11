# WordPres Site Migration Script

```shell
#!/bin/sh

CONFIG_FILE=".my.cnf"
SOURCE="/home/xxxxxx/public_html/"      # files to copy to the remote server
REMOTE_HOST="root@xx.xxx.xx.xxx"        # the host to connect to
DESTINATION_PATH="/var/www/html/"       # remote host destination path to move the files into
SSH_PASS_FILE=".tmp_ssh_pass"           # password file location
SSH_PASS="xxxxxx"                       # password file location
DUMP_FILE="dump.sql"                    # mysql dump filename
DB_NAME="xxxxxx_db"                     # database name
DB_USER="xxxxxx_us"                     # database username
DB_PASS="xxxxxx"                        # database pass
DB_NAME_D="wordpress"                   # database name destination server
DB_USER_D="wordpress"                   # database username destination server
DB_PASS_D="xxxxxx";                     # database pass destination server
IMPORT="false"                          # only used on remote connection when importing dump file :)

while [ "$1" != "" ]; do
    PARAM=`echo $1 | awk -F= '{print $1}'`
    VALUE=`echo $1 | awk -F= '{print $2}'`
    case $PARAM in
        --import) IMPORT=$VALUE ;;
        *) echo "ERROR: unknown parameter \"$PARAM\""; usage exit 1 ;;
    esac
    shift
done

if [ "$IMPORT" == "true" ]
then

    # Update databas info in wp-config.php
    echo "Update database credentials in wp-config.php on destination server";
    cd $DESTINATION_PATH;
    sed -i "s/^.*DB_NAME.*$/define('DB_NAME', '$DB_NAME_D');/" wp-config.php
    sed -i "s/^.*DB_USER.*$/define('DB_USER', '$DB_USER_D');/" wp-config.php
    sed -i "s/^.*DB_PASS.*$/define('DB_PASS', '$DB_PASS_D');/" wp-config.php

    echo "Creating $CONFIG_FILE on destination server";
    cd ~/
    touch $CONFIG_FILE
    echo "[mysqldump]
user=$DB_USER_D
password=$DB_PASS_D
[mysql]
user=$DB_USER_D
password=$DB_PASS_D" > $CONFIG_FILE
    chmod 440 $CONFIG_FILE

    echo "Importing database...";
    cd $DESTINATION_PATH;
    # do not use pv if not installed on destination server
    #pv $DUMP_FILE | mysql -u $DB_USER_D $DB_NAME_D;
    mysql -u $DB_USER_D $DB_NAME_D < $DUMP_FILE
    echo "Database imported!";
    # Remove database dump file from remote server
    rm -rf $DUMP_FILE
    # Remove config file
    cd ~/
    rm -rf $CONFIG_FILE
    echo "Dump file and config file deleted!";

    # Set correct WordPress folder/file permissions
    # Reset to safe defaults
    cd $DESTINATION_PATH;
    echo "Changing ownership for folders and files...";
    find . -exec chown www-data:www-data {} \;
    echo "Changing permissions for directories to 750...";
    find . -type d -exec chmod 750 {} \;
    echo "Changing permissions for files to 640...";
    find . -type f -exec chmod 640 {} \;
    # Allow wordpress to manage wp-config.php (but prevent world access)
    echo "Changing group for wp-config.php file to www-data";
    chgrp www-data ./wp-config.php
    echo "Changing permission for wp-config.php to 400";
    chmod 400 ./wp-config.php
    # Allow wordpress to manage wp-content
    #echo "Changing group for wp-content to www-data";
    #find ./wp-content -exec chgrp www-data {} \;
    #echo "Changing permissions for directories inside wp-content to 750";
    #find ./wp-content -type d -exec chmod 750 {} \;
    #echo "Changing permissions for files inside wp-content to 640";
    #find ./wp-content -type f -exec chmod 640 {} \;
    # Perform graceful restart (zero downtime)
    # other commands can be found here: https://openlitespeed.org/kb/command-references-for-administration/
    echo "Gracefully restarting LSWS...";
    /usr/local/lsws/bin/lswsctrl restart
    echo "Graceful restart completed!";
    exit;
fi

echo "Creating $CONFIG_FILE file on source server";
cd ~/
touch $CONFIG_FILE
echo "[mysqldump]
user=$DB_USER
password=$DB_PASS
[mysql]
user=$DB_USER
password=$DB_PASS" > $CONFIG_FILE
chmod 440 $CONFIG_FILE

echo "Creating MySQL dump file... user/pass stored in '$CONFIG_FILE'";
sleep 3
cd $SOURCE
mysqldump --verbose -u $DB_USER $DB_NAME > $DUMP_FILE
echo "Dump completed!";

echo "Creating $CONFIG_FILE file on source server";
cd ~/
touch $SSH_PASS_FILE
echo "$SSH_PASS" > $SSH_PASS_FILE
chmod 440 $SSH_PASS_FILE

echo "Started syncing files from local to remote server...";
sshpass -P passphrase -f ~/$SSH_PASS_FILE rsync --delete -azvv -e ssh $SOURCE $REMOTE_HOST:$DESTINATION_PATH
#sshpass -P passphrase -f ~/$SSH_PASS_FILE rsync --delete --exclude=wp-config.php -azvv -e ssh $SOURCE $REMOTE_HOST:$DESTINATION_PATH
#sshpass -p $SSH_PASS rsync --delete --exclude=wp-config.php -azvv -e ssh $SOURCE $REMOTE_HOST:$DESTINATION_PATH
echo "Syncing completed!";

echo "Importing dump file on destination server...";
sshpass -P passphrase -f ~/$SSH_PASS_FILE ssh $REMOTE_HOST "bash -s" -- < $0 "--import=true"
#sshpass -p $SSH_PASS ssh $REMOTE_HOST "bash -s" -- < $0 "--import=true"

# Remove database dump file from local server
echo "Cleaning up dump file and config file on source server";
cd $SOURCE
rm -rf $DUMP_FILE
# Remove config file
cd ~/
rm -rf $CONFIG_FILE
echo "All done!";
exit;
    
```
