# CLI commands for mongod:

**Create Admin user:**

```
db.createUser({
  user: "admin",
  pwd: "myadminpassword",
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase",   db: "admin" }
  ]
});
```

**Create DB User:**

```
db.createUser({
  user: "sampledb_us",
  pwd: "sampledb_us_password",
  roles: [
    { role: "userAdmin", db: "sampledb" },
    { role: "dbAdmin",   db: "sampledb" },
    { role: "readWrite", db: "sampledb" }
  ]
});
```

**Enable MongoDB Auth:**

```
vim /etc/mongod.conf

security:
    authorization: 'enabled'

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
```

**Logging into the `admin` database:**

```
mongo -u admin -p myadminpassword 127.0.0.1/admin
```

**Logging into other database:**

```
mongo -u sampledb_us -p user1password 127.0.0.1/sampledb
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
