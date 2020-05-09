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
mongodb://USER:PASSWORD@api.super-forms.com:27017/?authSource=DBNAME&readPreference=primary&appname=MyApp&ssl=false
```
