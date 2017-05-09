## Synopsis

Nagios UI has been designed to be displayed on user screen. When you need a screen in a corner of the room to display current alerts, it become too small and unreadable or if you zoom, too verbose with many information of screen. This page was developped to have a condensed view of nagios/icinga of status.cgi allowing you to view where are the problems. You can clic on an alert to go to the detailled status page.

## Demo

You can view the test page in action [here](https://arcenik.github.io/nagios-js-front/test.html)

## Usage

Once configured, simply open the index.html on your favorite browser. Refresh is automatic.

## Configuration

You need to edit **js/myicinga.js** and set the cgi-bin URL for your nagios/icinga server.

> var url_base = "http://my_icinga_server/icinga/cgi-bin/";

You can specify a login password

> var url_base = "http://mylogin:mypassword@my_icinga_server/icinga/cgi-bin/";

## Hack

If you wont to hack the css you can use **test.html** witch load data from a json file from test directory.

## License

This is available under [GPL License](http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html).
