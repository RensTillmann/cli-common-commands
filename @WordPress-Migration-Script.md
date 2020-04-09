# WordPres Site Migration Script

```shell
#!/bin/sh

SOURCE="/home/XXXXX/public_html/"   # files to copy to the remote server
REMOTE_HOST="root@XX.XXX.XX.XXX"    # the host to connect to
DESTINATION_PATH="/var/www/html/"   # remote host destination path to move the files into
SSH_PASS="/home/XXXXX/.password"    # password file location
DUMP_FILE="dump.sql"                # mysql dump filename
DB_NAME="XXXXX_db"                  # database name
DB_USER="XXXXX_us"                  # database username
IMPORT="false"                      # only used on remote connection when importing dump file :)

#./wp-migration.sh --source=/home/XXXXX/public_html/ \
#                  --remote-host=root@XX.XXX.XX.XXX \
#                  --destination-path=/var/www/html/ \
#                  --ssh-pass=/home/XXXXX/.password \
#                  --dump-file=dump.sql \
#                  --db-name=XXXXX_db \
#                  --db-user=XXXXX_us

function usage()
{
    echo "Usage: $0 --db-path"
    echo "\t-h --help"
    echo "\t--source=$SOURCE"
    echo "\t--remote-host=$REMOTE_HOST"
    echo "\t--destination-path=$DESTINATION_PATH"
    echo "\t--ssh-pass=$SSH_PASS"
    echo "\t--dump-file=$DUMP_FILE"
    echo "\t--db-name=$DB_NAME"
    echo "\t--db-user=$DB_USER"
    echo "\t--import=$IMPORT"
    echo ""
}

while [ "$1" != "" ]; do
    PARAM=`echo $1 | awk -F= '{print $1}'`
    VALUE=`echo $1 | awk -F= '{print $2}'`
    case $PARAM in
        -h | --help) usage exit ;;
        --source) SOURCE=$VALUE ;;
        --remote-host) REMOTE_HOST=$VALUE ;;
        --destination-path) DESTINATION_PATH=$VALUE ;;
        --ssh-pass) SSH_PASS=$VALUE ;;
        --dump-file) DUMP_FILE=$VALUE ;;
        --db-name) DB_NAME=$VALUE ;;
        --db-user) DB_USER=$VALUE ;;
        --db-path) DB_PATH=$VALUE ;;
        --import) IMPORT=$VALUE ;;
        *) echo "ERROR: unknown parameter \"$PARAM\""; usage exit 1 ;;
    esac
    shift
done

if [ "$IMPORT" == "true" ]
then
    echo "Importing database...";
    cd $DESTINATION_PATH;
    pv $DUMP_FILE | mysql -u root wordpress;
    chown www-data:www-data -R *;
    exit;
fi

#echo "--source=$SOURCE";
#echo "--remote-host=$REMOTE_HOST";
#echo "--destination-path=$DESTINATION_PATH";
#echo "--ssh-pass=$SSH_PASS";
#echo "--dump-file=$DUMP_FILE";
#echo "--db-name=$DB_NAME";
#echo "--db-user=$DB_USER";
#echo "--import=$IMPORT";
#exit;

echo "Creating MySQL dump file... user/pass stored in '~/.my.cnf'";
sleep 3
mysqldump --verbose -u $DB_USER $DB_NAME > $DUMP_FILE
echo "Dump completed!";

echo "Started syncing files from local to remote server...";
sshpass -P passphrase -f $SSH_PASS rsync --delete --exclude=wp-config.php --exclude=rsync_script.sh -azvv -e ssh $SOURCE $REMOTE_HOST:$DESTINATION_PATH
echo "Syncing completed!";

echo "Importing dump file on destination server...";
sshpass -P passphrase -f $SSH_PASS ssh $REMOTE_HOST "bash -s" -- < importdb.sh "--import=true"
echo "Dump file imported!";

```

## Quick commands (for quick usage if you know what you are doing):

Add Swap Space:

```bash
df -h
sudo fallocate -l 1G /swapfile
ls -lh /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
sudo cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
sudo sysctl vm.swappiness=10
sudo vim /etc/sysctl.conf
vm.swappiness=10
sudo sysctl vm.vfs_cache_pressure=50
sudo vim /etc/sysctl.conf
vm.vfs_cache_pressure=50
```

Create file **~/.my.cnf** (on both servers) with DB passwords, which is used by our shell script to make a dump and do the import.

```bash
[mysqldump]
user=root
password=password
[mysql]
user=root
password=password
```

## 1. Add swap if necessary

1.1 Check if the system has any configured Swap

```bash
sudo swapon --show
```

1.2 Verify that there is no active Swap

```bash
free -h
```

1.3 Create swap file on an existing partition, find the current disk

Example: **/dev/vda1**

```bash
df -h
```

1.4 Create a Swap file

```bash
sudo fallocate -l 1G /swapfile
```

1.5 Verify that the correct amount of space was reserved:

```bash
ls -lh /swapfile
```

1.6 Make the file only accessible to root by typing:

```bash
sudo chmod 600 /swapfile
```

1.7 Verify the permissions:

```bash
ls -lh /swapfile
```

1.8 Mark the file as swap space:

```bash
sudo mkswap /swapfile
```

1.9 Enable the swap file:

```bash
sudo swapon /swapfile
```

1.10 Verify that the swap is available:

```bash
sudo swapon --show
free -h
```

1.11 Make the Swap File Permanent

```bash
sudo cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

1.12 Tweak Swap Settings

```bash
sudo sysctl vm.swappiness=10
sudo vim /etc/sysctl.conf
vm.swappiness=10

sudo sysctl vm.vfs_cache_pressure=50
sudo vim /etc/sysctl.conf
vm.vfs_cache_pressure=50
```
