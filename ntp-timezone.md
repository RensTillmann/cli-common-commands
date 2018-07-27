# NTP & Timezone


**Get timezone info:**

	timedatectl status
	date

**Change timezone:**

	sudo timedatectl set-timezone Europe/Amsterdam

**List timezones:**

	timedatectl list-timezones

**Install chrony:**

	sudo apt install chrony
	sudo vi /etc/chrony/chrony.conf

	   server 0.nl.pool.ntp.org
	   server 1.nl.pool.ntp.org
	   server 2.nl.pool.ntp.org
	   server 3.nl.pool.ntp.org

_get pools from (https://www.ntppool.org/zone/nl)[https://www.ntppool.org/zone/nl]_

**Restart chrony:**

	sudo systemctl restart chrony.service
	chronyc sources
	chronyc sourcestats
	sudo chronyd -Q
	sudo chronyd -q

_One-shot sync use:_ `chronyd -q`
_One-shot time check, without setting the time use:_ `chronyd -Q`

