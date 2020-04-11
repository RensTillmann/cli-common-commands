# WordPres Site Migration Script

```shell
#!/bin/sh

echo "Home dir [source] e.g: /home/user1/public_html/: "
read -e HOMEDIR
echo "Database Name [source]: "
read -e DB_NAME
echo "Database User [source]: "
read -e DB_USER
echo "Database Password [source]: "
read -s DB_PASS
echo "Database Name [destination]: "
read -e DB_NAME_D
echo "Database User [destination]: "
read -e DB_USER_D
echo "Database Password [destination]: "
read -s DB_PASS_D

echo "Remote host  e.g: root@XX.XXX.XX.XXX: "
read -e REMOTE_HOST
echo "Remote path e.g: /var/www/html/: "
read -e REMOTE_PATH
echo "Authentication password: "
read -s SSH_PASS

echo "Confirm Migration (y/n): "
read -e RUN
if [ "$RUN" == n ] then
    exit
fi

CONFIG_FILE=".my.cnf"
SSH_PASS_FILE=".tmp_ssh_pass"           # password file location
DUMP_FILE="dump.sql"                    # mysql dump filename
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
    cd $REMOTE_PATH;
    pv $DUMP_FILE | mysql -u $DB_USER_D $DB_NAME_D;
    echo "Database imported!";
    # Remove database dump file from remote server
    rm -rf $DUMP_FILE
    # Remove config file
    cd ~/
    rm -rf $CONFIG_FILE
    echo "Dump file and config file deleted!";

    # Set correct WordPress folder/file permissions
    # Reset to safe defaults
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
cd $HOMEDIR
mysqldump --verbose -u $DB_USER $DB_NAME > $DUMP_FILE
echo "Dump completed!";

echo "Creating $CONFIG_FILE file on source server";
cd ~/
touch $SSH_PASS_FILE
echo "$SSH_PASS" > $SSH_PASS_FILE
chmod 440 $SSH_PASS_FILE

echo "Started syncing files from local to remote server...";
sshpass -P passphrase -f ~/$SSH_PASS_FILE rsync --delete -azvv -e ssh $HOMEDIR $REMOTE_HOST:$REMOTE_PATH
#sshpass -P passphrase -f ~/$SSH_PASS_FILE rsync --delete --exclude=wp-config.php -azvv -e ssh $HOMEDIR $REMOTE_HOST:$REMOTE_PATH
#sshpass -p $SSH_PASS rsync --delete --exclude=wp-config.php -azvv -e ssh $HOMEDIR $REMOTE_HOST:$REMOTE_PATH
echo "Syncing completed!";

echo "Importing dump file on destination server...";
sshpass -P passphrase -f ~/$SSH_PASS_FILE ssh $REMOTE_HOST "bash -s" -- < $0 "--import=true"
#sshpass -p $SSH_PASS ssh $REMOTE_HOST "bash -s" -- < $0 "--import=true"

# Remove database dump file from local server
echo "Cleaning up dump file and config file on source server";
cd $HOMEDIR
rm -rf $DUMP_FILE
# Remove config file
cd ~/
rm -rf $CONFIG_FILE
echo "All done!";
exit;
    
```
