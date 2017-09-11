/**
 * Created by kerlw on 2017/9/11.
 */
(function () {
    'use strict'

    $(function () {
        $("#btnAddExit").bind("click", function () {
            var div = $("<tr />");
            div.html(getExitTableRow());
            $("#room_exits_table").append(div);
        });

        $("#btnAddObj").bind("click", function () {
            var div = $("<tr />");
            div.html(getObjTableRow());
            $("#room_objs_table").append(div);
        });

        $("body").on("click", ".tbl_btn_remove", function () {
            $(this).closest("tr").remove();
        });

        $("button#btn_save").on("click", function () {
            var filename = $("#input_filename").val(),
                area = $("#input_area").val();
            var data = {
                filename :  filename,
                overwrite : true,
                data : {
                    filename : filename
                }
            };
        });
    });

    function getExitTableRow() {
        return '<td><select name="" class="form-control"><option> 选择方向</option><option>north</option><option>south</option></select></td>'
            + '<td><input name="target" type="text" value = "" /></td>'
            + '<td><button type="button" class="btn btn-danger tbl_btn_remove"><i class="glyphicon glyphicon-remove-sign"></i></button></td>'
    }

    function getObjTableRow() {
        return '<td><input name="obj_path" type="text" value = "" /></td>'
            + '<td><input name="obj_num" type="text" value = "" /></td>'
            + '<td><button type="button" class="btn btn-danger tbl_btn_remove"><i class="glyphicon glyphicon-remove-sign"></i></button></td>'
    }

})();
