List directories with most inodes at the top:

```
du -s --inodes * | sort -rn
```

Delete files older than 30 days ending with .txt from current directory 

```
find . -type f -name "*.txt" -mtime +30 -exec rm {} \;
```

List the largest files of a directory sorted by large to small 10 max

```
find . -type f -exec du -h {} + | sort -rh | head -n 10
```

Find empty folders and delete

```
find . -type d -empty -exec rmdir {} \;
```

Find and remove files 

```
find . -type f -name '*}.pdf' -exec rm {} +
```
