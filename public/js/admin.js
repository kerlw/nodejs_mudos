/**
 * Created by kerlw on 2017/9/8.
 */
(function() {
    'use strict';

    refreshStatus();

    function refreshStatus() {
        $.ajax({
            type : 'POST',
            url : '/api?action=status',
            dataType : 'json',
            data : '{}',
            success : function(data) {
                if (data.code == 200) {
                    $('div#status_desc').html('<pre>' + JSON.stringify(data.body) + '</pre>');
                } else {
                }
            }
        });

        window.setTimeout(refreshStatus, 2000);
    }

})();