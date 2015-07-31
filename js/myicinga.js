
var myicinga = {

/*****************************************************************************/
show_svc: function( params)
{

    /*
     * put your nagios/icinga server CGI URL below
     */

    var url_base = "http://my_icinga_server/icinga/cgi-bin/";
	//  var url_base = "http://my_nagios_server/nagios/cgi-bin/";

    /*
     * variable obtained from
     *
     *  http://docs.icinga.org/latest/en/cgiparams.html#cgiparams-filter
     *
     */

    var servicestatus = 4 | // SERVICE_WARNING
                        8 | // SERVICE_UNKNOWN
                        16; // SERVICE_CRITICAL

    var serviceprops = 2 | // SERVICE_NO_SCHEDULED_DOWNTIME
                       8 | // SERVICE_STATE_UNACKNOWLEDGED
                       2048; // SERVICE_IS_NOT_FLAPPING
                       // 262144; // SERVICE_HARD_STATE

    var url = url_base+"status.cgi?host=all&servicestatustypes="+servicestatus+"&serviceprops="+serviceprops+"&sorttype=1&sortoptio    n=6&noheader&limit=0&columns=1&jsonoutput";

	var alerts = {};
	var len=0;
    var output = "";

	if( typeof params.test != 'undefined' ) {
		// console.log("TEST source");
		var json = (function () {
			var json = null;
			$.ajax({
				async: false,
                global: false, 
                url: params.test, 
                dataType: "json",
				success: function (data) { json = data; }
			});
			return json;
		})(); 
	} 
	else {
		var json = (function () {
			var json = null;
            var startTime = new Date().getTime();

			$.ajax({
                type:'GET',
				async: false, 
                global: false, 
                url: url, 
                dataType: "json",
				timeout:5000,
                headers: {
                    "Authorization": "Basic " + btoa(params.login + ":" + params.passw) + "=="
                },
				success: function (data) { 
                    json = data; 
                    var endTime = new Date().getTime();
                    var now = new Date(), nowStr;
                    nowStr = now.getFullYear() + "/" 
                            + ('0' + (now.getMonth()+1)).slice(-2) + "/" 
                            + ('0' + now.getDate()).slice(-2) + " " 
                            + ('0' + now.getHours()).slice(-2) + ":" 
                            + ('0' + now.getMinutes()).slice(-2) + ":" 
                            + ('0' + now.getSeconds()).slice(-2);

                    $(params.hb).html( nowStr + " (" + (endTime - startTime) + " ms)" );
                },
                error: function(err) {
                    var endTime = new Date().getTime();
                    var now = new Date(), nowStr;

                    nowStr = now.getFullYear() + "/" 
                            + ('0' + (now.getMonth()+1)).slice(-2) + "/" 
                            + ('0' + now.getDate()).slice(-2) + " " 
                            + ('0' + now.getHours()).slice(-2) + ":" 
                            + ('0' + now.getMinutes()).slice(-2) + ":" 
                            + ('0' + now.getSeconds()).slice(-2);

                    // console.log(err);
                    $(params.hb).html( "<div class=\"alert_CRITICAL\">" 
                            + nowStr 
                            + " "
                            + err.statusText 
                            + "(" + (endTime - startTime) + " ms)"
                            + "</div>");
                }
			});
			return json;
		})(); 
	}

    //  console.log( json);
	if( typeof json.error != 'undefined' ) {

		output = "<div class=\"alerts\">";
		output += "<table class=\"alerts\" style=\"background-color:#ee8888\">";
		output += "<tr><td>ERROR : " + json.error.title + "</td></tr>";
		output += "<tr><td>" + json.error.text + "</td></tr>";
		output += "</table></div>";

    	$(params.divId).html( output);
		return;
	}

    len = json.status.service_status.length;
    for(var i=0; i<len; i++) {
		var item = json.status.service_status[i];
		if( typeof alerts[item.host_name] == 'undefined' ) { 
            alerts[item.host_name] = { display:item.host_display_name ,items:[], count:{ 'WARNING':0, 'CRITICAL':0, 'UNKNOWN':0} }; 
        }
		alerts[item.host_name].items.push( item);
		alerts[item.host_name].count[item.status] += 1;

	}
	// console.log( alerts);

    output = "<table class=\"svctable\">";
	for(var k in alerts) {
		var item = alerts[k];
        // console.log( item);

        output += "<tr>";
        output += "<td class=\"hostname\" width=\"200\">"+item.display+"</td>";
        output += "<td class=\"alerts\">";
		var len = item.items.length;
		for(i=0; i<len; i++) {
			var style = "alert_" + item.items[i].status;
			output += "<a href=\"";
			output += url_base + "extinfo.cgi?type=2&host=" + item.items[i].host_name + "&service=" + item.items[i].service_description;
			output += "\" class=\"tooltip "+style+"\" >";

            if( item.items[i].is_flapping) {
                output += "<img src=\"img/flapping.gif\" width=\"32\" height=\"32\">";
            }
            if( item.items[i].has_been_acknowledged) {
                output += "<img src=\"img/ack.gif\" width=\"32\" height=\"32\">";
            }

			output += item.items[i].service_display_name.replace(/_/g, " ");
			output += "<span><img class=\"callout\" src=\"img/callout.gif\" />";
			output += "Since : " + item.items[i].duration + "<br>";
			output += item.items[i].status_information;
			output += "</a> ";
		}
		output += "</td>";
        output += "</tr>";
    }

    output += "</table>";

    $(params.divId).html( output);
},

}

// vim: ts=4:sw=4:et:ai
