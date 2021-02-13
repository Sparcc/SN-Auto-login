# SN-Auto-login
Keep your ServiceNow Developer instance awake

# Tech

* [Selenium for Node] - https://www.npmjs.com/package/selenium-webdriver
* Google Compute Engine - For running on schedule

# Installation

## Windows
* grab repo
* run npm install
* rename to and fill login-details.json 
* download webdriver
* add webdriver to PATH
* schedule with whatever method. Windows Task Scheduler works well.

## Google Compute Engine Ubuntu VM with Chrome Webdriver
* Install Node and NPM:
  * grab repo
  * sudo apt install npm, then run npm install
  * sudo apt install node
* Chrome Webdriver (Runs the Chrome Browser and wont work on its own)
  * sudo npm install -g chromedriver
* Chrome Browser(Needs the X Server to run in)
  * wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
  * sudo dpkg -i google-chrome-stable_current_amd64.deb
* xvfb (X Server for headless machines)
  * sudo apt install xvfb
  * note: this will require dependencies to be created. Do this with:
    * sudo apt-get -f install
* rename to and fill login-details.json 
* create a simple to bash script that runs the app as sudo. There is one example included.
* run bash script on schedule via crontab. Note that direct path to the file and node (/usr/bin/node) is needed or it wont run.

# Crontab example:
```sh
HOME=/root
LOGNAME=root
PATH=/home/sparco_209/bin:/home/sparco_209/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
LANG=en_US.UTF-8
SHELL=/bin/bash
PWD=/root

0 */5 * * * cd /home/sparco_209/SN-Auto-login ; ./run.sh &> /home/sparco_209/SN-Auto-login/cron.log

```
