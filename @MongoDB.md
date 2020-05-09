# CLI commands for mongod:

**Start MongoDB without access control:**

```
mongod --port 27017 --dbpath /var/lib/mongodb
```

**In new shell:**

```
mongo --port 27017
```

**Create Admin and DB users:**

```
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

use dbname
db.createUser({
  user: "db_us",
  pwd: passwordPrompt(),
  roles: [
    { role: "userAdmin", db: "dbname" },
    { role: "dbAdmin",   db: "dbname" },
    { role: "readWrite", db: "dbname" }
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
mongo -u admin -p myadminpassword 127.0.0.1/admin
```

**Logging into other database:**

```
mongo -u sampledb_us -p user1password 127.0.0.1/sampledb

OR:

mongo --port 27017  --authenticationDatabase "admin" -u "myUserAdmin" -p

OR:

mongo --port 27017
use admin
db.auth("myUserAdmin", passwordPrompt()) // or cleartext password

```

## Connecting remotely:

In order to connect to the database remotely we must open up the port `27017` (default port) and allow inbound and outbound traffic.

```
iptables -A INPUT -p tcp --destination-port 27017 -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -A OUTPUT  -p tcp --source-port 27017 -m state --state ESTABLISHED -j ACCEPT
```

**Testing remote connection:**

```
mongo -u sampledb_us -p sampledb_us_password <ip>/sampledb
```

**After authenticated as administrator, you can create additional users:**

```
use test
db.createUser(
  {
    user: "myTester",
    pwd:  passwordPrompt(),   // or cleartext password
    roles: [ { role: "readWrite", db: "test" },
             { role: "read", db: "reporting" } ]
  }
)
```

**Login as the newly created user, and try to insert a document for testing:**

```
mongo --port 27017 -u "myTester" --authenticationDatabase "test" -p

db.foo.insert( { x: 1, y: 1 } )
```
