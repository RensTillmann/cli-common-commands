# Creating Backups:

```
https://www.digitalocean.com/community/tutorials/how-to-set-up-scheduled-logical-mongodb-backups-to-digitalocean-spaces
```

# CLI commands for mongod:

**Deploy Replica Set:**

```
# Spin up nodes with docker installed
# Configure host files on all the nodes so they can communicate with eachother
vim /etc/hosts
10.116.0.5 mongodb01
10.116.0.6 mongodb02
10.116.0.7 mongodb03

# Start mongo on all nodes:
mongod --replSet "rs0" --bind_ip localhost,mongodb01
mongod --replSet "rs0" --bind_ip localhost,mongodb02
mongod --replSet "rs0" --bind_ip localhost,mongodb03

# Or with docker (not recommended, should use swarm)
docker run -d -p 27017:27017 -v data:/data/db mongo --replSet "rs0" --bind_ip localhost,mongodb01
docker run -d -p 27017:27017 -v data:/data/db mongo --replSet "rs0" --bind_ip localhost,mongodb02
docker run -d -p 27017:27017 -v data:/data/db mongo --replSet "rs0" --bind_ip localhost,mongodb03

# Open up port for local networks only
ufw allow proto tcp from 10.116.0.0/20 to 10.116.0.0/20 port 27017 comment 'mongodb'

# Test connection from 01 to 02
mongo --host mongodb02
mongo --host mongodb03 --port 27017

# Login to mongo
mongo --host mongodb01:27017 OR: mongo mongodb://mongodb01:27017

# Check replicaset status
rs.status()

# Initiate replica set
rs.initiate( {
   _id : "rs0",
   members: [
      { _id: 0, host: "mongodb01:27017" },
      { _id: 1, host: "mongodb02:27017" },
      { _id: 2, host: "mongodb03:27017" }
   ]
})

# Check replicaset status
rs.status()

# Connect to the replica set (rs0)
mongo 'mongodb://mongodb01,mongodb02,mongodb03/?replicaSet=rs0'

# Show status and info
rs.status()
rs.printReplicationInfo()
rs.getReplicationInfo()
rs.conf()

# Test replication
db.createCollection("helloworld")
show collections
exit
mongo mongodb://mongodb02
rs.slaveOk()
show dbs
show collections

# Test failover
-- Login on current pexrimary node e.g mongodb01
docker ps
docker stop mongo
exit
-- Connect to the replica set (rs0)
mongo 'mongodb://mongodb01,mongodb02,mongodb03/?replicaSet=rs0'
rs.status()
-- Restart mongo on primary node e.g mongodb01
docker ps -a
docker start mongo
docker ps
exit
-- Reconnect to the replica set (rs0)
mongo 'mongodb://mongodb01,mongodb02,mongodb03/?replicaSet=rs0'
rs.status()

# When everything is setup, we should enable authentication!

```

**Authentication, users and roles:**

```
# Run mongo instance
docker run --name mongo -d -p 27017:27017 -v data:/data/db mongo
netstat -nltp
# Confirm it is running
docker ps
mongo
show dbs
use admin
show users
show roles

# Create admin user
use admin
db.createUser(
  {
    user: "myUserAdmin",
    pwd: passwordPrompt(), // or cleartext password
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)
show users
exit

docker ps
docker stop mongo
docker rm mongo

docker run --name mongo -d -p 27017:27017 -v data:/data/db mongo --auth
# LOGIN Method 1:
mongo -u myUserAdmin -p
# OR with auth db specified:
mongo -u myUserAdmin -p --authenticationDatabase admin

# LOGIN Method 2:
show dbs
use admin
show users
db.auth("myUserAdmin", passwordPrompt())

# Create additional user
use test
db.createUser(
  {
    user: "myTester",
    pwd:  passwordPrompt(),   // or cleartext password
    roles: [ { role: "readWrite", db: "test" },
             { role: "read", db: "reporting" } ]
  }
)
mongo -u myTester -p --authenticationDatabase test
exit

# Change user password
mongo -u myUserAdmin -p
use admin
db.changeUserPassword("myUserAdmin", passwordPrompt())

```

**Backup & Restore**

Users must have role: backup, restore in order to be able to create backups and/or restore backups

```
# backup all databases on a local machine
mongodump --out dump_full


# backup all databases on a local machine:
mongodump --host xxx.xxx.x.x --port 27017 --out dump_full 

# backup specific database
mongodump --db mydb --out dump_mydb

# backup specific collection from specific db
mongodump --db mydb --collection courses --out dump_mydb_courses

# backup all collections except one or more specific collections
mongodump --db mydb --excludeCollection=courses --excludeCollection=students --out dump_mydb_specific

# backup all collections except one or more specific collections based on prefix
mongodump --db mydb --excludeCollectionWithPrefix=temp --out dump_mydb_withprefix

# backup specific documents based on filter for specific collection
mongodump --db mydb --collection students --query '{"country": {$eq: "NL"}}' --out dump_mydb_nlstudents

# restore local backup and restore at remote host
mongodump --db mydb | mongorestore --host xxx.xxx.x.x --port 27017

# restore specific dump folder
mongorestore dump_full
```

**Start MongoDB without access control:**

```
systemctl stop mongod
mongod --port 27017 --dbpath /var/lib/mongodb
```

**In new shell:**

```
mongo --port 27017
```

**Create Root, Admin and DB users:**

```
db.createUser(
  {
    user: "superuser",
    pwd: "changeMeToAStrongPassword",
    roles: [ "root" ]
  }
)

use admin
db.createUser({
  user: "admin",
  pwd: passwordPrompt(),
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase",   db: "admin" }
  ]
});

use DBNAME
db.createUser({
  user: "USER",
  pwd: passwordPrompt(),
  roles: [
    { role: "userAdmin", db: "DBNAME" },
    { role: "dbAdmin",   db: "DBNAME" },
    { role: "readWrite", db: "DBNAME" }
  ]
});
```

**Shut down MongoDB instance with access control**

```
db.adminCommand( { shutdown: 1 } )
```

**Enable MongoDB Auth:**

```
vim /etc/mongod.conf

security:
    authorization: 'enabled'

```

(or via command line):

```
mongod --auth --port 27017 --dbpath /var/lib/mongodb
```



**Allow remote connections:**

_By default mongodb only allows connections from localhost, to allow remote connections
Use SSH tunneling to forward connections.
Or even simpler, add your remote instance’s IP addresses seperated by commas._

```
# network interfaces
net:
    port: 27017
    bindIp: 127.0.0.1,other-IP-here   #default value is 127.0.0.1
```

**After making changes make sure to restart mongodb:**

```
systemctl restart mongod.service
service mongod restart
chown -R mongodb:mongodb /var/lib/mongodb/
```

**If you can't restart because of permission errors run the following:**

```
chown -R mongodb:mongodb /var/lib/mongodb/
```

**Logging into the `admin` database:**

```
mongo -u admin -p PASSWORD 127.0.0.1/admin
```

**Logging into other database:**

```
mongo -u USER -p PASSWORD 127.0.0.1/DBNAME

OR:

mongo --port 27017  --authenticationDatabase "DBNAME" -u "USER" -p

OR:

mongo --port 27017
use DBNAME
db.auth("USER", passwordPrompt()) // or cleartext password

```

## Connecting remotely:

In order to connect to the database remotely we must open up the port `27017` (default port) and allow inbound and outbound traffic.

```
iptables -A INPUT -p tcp --destination-port 27017 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT  -p tcp --source-port 27017 -m state --state ESTABLISHED -j ACCEPT
```

**Testing remote connection:**

```
mongo -u USER -p PASSWORD <IP-ADDRESS>/DBNAME
```

**After authenticated as administrator, you can create additional users:**

```
use DBNAME
db.createUser(
  {
    user: "USER",
    pwd:  passwordPrompt(),   // or cleartext password
    roles: [ { role: "readWrite", db: "DBNAME" },
             { role: "read", db: "OTHERDBNAME" } ]
  }
)
```

**Login as the newly created user, and try to insert a document for testing:**

```
mongo --port 27017 -u "USER" --authenticationDatabase "DBNAME" -p

db.foo.insert( { x: 1, y: 1 } )
```

**Example URI to connect to mongodb server via drivers:**

```
mongodb://USER:PASSWORD@localhost:27017/?authSource=DBNAME&readPreference=primary&appname=MyApp&ssl=false
```
