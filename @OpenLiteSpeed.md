Log file location:

`/usr/local/lsws/logs/stderr.log`

**Fix "Reached max children process limit" (https://wordpress.org/support/topic/503-error-when-litespeed-cache-is-activated/):**

`grep -riF "LSAPI_CHILDREN" /usr/local/lsws/conf`

Edit file:

`/usr/local/lsws/conf/httpd_config.conf`

Change value 10 to 15 or 20 like so:

```
maxConns                15
env                     PHP_LSAPI_CHILDREN=15
```

Restart Open LiteSpeed:

`systemctl restart lsws`

Restart mysql if needed:

`systemctl restart mysql`
