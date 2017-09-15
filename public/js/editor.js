/**
 * Created by kerlw on 2017/9/11.
 */
(function () {
    'use strict'

    var area = {};

    $(function () {
        //选择房间所在区域的对话框
        $("#modal_dialog_choose_area").on("show.bs.modal", function() {
            if (Object.keys(area).length <= 0) {
                //show waiting progress
                $.ajax({
                    type : 'POST',
                    url : '/api?action=query',
                    dataType : 'json',
                    data : { "type" : "area_list" },
                    success : function(data) {
                        if (data.code == 200) {
                            var areas = data.areas;
                            $("div#area_list ul").empty()
                            bindAreaDataToTreeView(areas);
                        } else {
                        }
                    }
                });
            } else {
                $("div#area_list ul").empty()
                bindAreaDataToTreeView(area);
            }
        });

        $("#btn_save_choosed_area").on("click", function() {

        });
        //---------------------------

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

    function bindAreaDataToTreeView(areas, lv) {
        if (!areas || !(areas instanceof Array) || areas.length <= 0)
            return;

        var selection = $("#input_area").val() || "";

        var indent = '';
        var lvl = lv || 0;
        while (lvl-- > 0)
            indent += '&nbsp;&nbsp;';
        areas.forEach(function(area) {
            var active = '"';
            if (selection.length > 0 && selection === area.pathname)
                active = ' active"';
            //关闭对话框有两种实现方式，在li上加data-dismiss或者在后面调用 dialog.modal("hide")
            // $("div#area_list ul").append('<li class="list-group-item' + active + ' data-dismiss="modal" value="' + area.pathname + '">' + indent + area.name + '</li>');
            $("div#area_list ul").append('<li class="list-group-item' + active + ' value="' + area.pathname + '">' + indent + area.name + '</li>');
            bindAreaDataToTreeView(area.children, (lv || 0) + 1);
        });

        //对于0层的数据，绑定完成后加入点击事件
        if (!lv) {
            $("div#area_list ul li").on("click", function () {
                $(this).closest("ul").find("li").removeClass("active");
                $(this).addClass("active");

                $("#input_area_show").val($(this).text());
                $("#input_area").val($(this).attr("value"));

                $("#modal_dialog_choose_area").modal("hide");
            });
        }
    }

    function getExitTableRow() {
        return '<td><select name="" class="form-control"><option> 选择方向</option><option>north</option><option>south</option></select></td>'
            + '<td><input name="target" type="text" value = "" /></td>'
            + '<td><button type="button" class="btn btn-danger tbl_btn_remove"><i class="glyphicon glyphicon-remove-sign"></i></button></td>'
    }

    function getObjTableRow() {
        return '<td><input name="obj_path" type="text" value = "" /></td>'
            + '<td><input name="obj_num" type="text" value = "1" /></td>'
            + '<td><button type="button" class="btn btn-danger tbl_btn_remove"><i class="glyphicon glyphicon-remove-sign"></i></button></td>'
    }

})();
