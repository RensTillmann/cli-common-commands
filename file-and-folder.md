# File & Folder commands

**List file sizes:**

	du -sh *

**Symlink/Junction windows folders:**
	
	mklink /J C:\folder\to\create C:\existing\folder\to\symlink
	
**Copy folder including files:**

	cp -r /home/hope/files/* /home/hope/backup

**Remove folder + subfolders + files:**
	
_Be carefull with the `f` flag, it can not be undone_

	rm -rf /etc/var/www/somedir


**Secure copy (SCP):**

**Copy folder from remote to the local host:**

	scp -r -P 12345 user@1.2.3.4:/home/user/daily_backups /e/local/directory

**Copy from remote to the local host:**

	scp your_username@1.2.3.4:file.txt /some/local/directory

**Copy from local to a remote host:**

	scp file.txt your_username@1.2.3.4:/some/remote/directory

**Copy the directory from local to remote host's:**

	scp -r user@1.2.3.4:/path/to/foo /some/remote/directory


**Copy from remote to remote:**

	scp user@1.2.3.4:/some/remote/directory/foobar.txt \user@1.2.3.5:/some/remote/directory/


**Copy multiple files from local to remote $HOME dir:**

	scp foo.txt bar.txt user@1.2.3.4:~


**Copy file from local to remote using port 4321:**

	scp -P 4321 foobar.txt user@1.2.3.4:/some/remote/directory

