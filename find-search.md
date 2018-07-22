# Find & Search commands

_Good reference with more info: [https://www.linode.com/docs/tools-reference/tools/find-files-in-linux-using-the-command-line/](https://www.linode.com/docs/tools-reference/tools/find-files-in-linux-using-the-command-line/)_

**Use grep to find files based on content:**

	find . -type f -exec grep "example" '{}' \; -print
	find . -type f -print | xargs grep "example"

**Find files by name or extension:**

	find /home/username/ -name "*.log"
	find /home/username/ -name "filename.jpg"

	find -O3 -L /var/www/ -name "config.php"

_Enable the maximum optimization level (-O3) and allow to follow symbolic links (-L). searches the entire directory tree_


**Find a file in current and sub-directories:**

	find . -name testfile.txt


**Find an empty file within the current directory:**
	
	find . -type f -empty


**Find all .db files (ignoring text case) modified in the last 7 days by a user named exampleuser:**

	find /home -user exampleuser -mtime 7 -iname ".db"


**Find and delete files:**

	find . -name "*.bak" -delete


**Find and modify/process files:**

	find . -name "nginx.conf" -exec chmod o+r '{}' \;
