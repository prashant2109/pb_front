var TASCanvas = {}
function Box() {
        this.x = 0;
        this.y = 0;
        this.w = 1; // default width and height?
        this.h = 1;
        this.fill = '#444444';
        this.fill_flg = false;
        this.section_id = '1';
        this.section_name = '';
        this.crop_id = '';
}
//*********************************************************************************************************************************************************
// New methods on the Box class
Box.prototype.constructor	= Box;
(function(){
        // we used to have a solo draw function
        // but now each box is responsible for its own drawing
        // mainDraw() will call this with the normal canvas
        // myDown will call this with the ghost canvas with 'black'
        this.draw = function (context, optionalColor){
            context.font = "bold 13px arial";
            context.fillStyle = 'white';
            context.textAlign = 'right';
            var zx = this.x+this.w;
            //TASApp.documentpage.unhighlight_cells();
            //TASApp.documentpage.highlight_selected_td(this.x, this.y, this.w, this.h);
            context.fillText(this.section_name, zx, this.y-10);
            if (context === TASCanvas.gbl.gctx) {
                context.fillStyle = 'black'; // always want black for the ghost canvas
            } else {
                //context.fillStyle = this.fill;
                if (this.fill_flg == false) {

                    //context.fillStyle = 'rgba(255,255,255,0.3)'
                    context.fillStyle = 'rgba(255,255,255,0.2)'
                } else {

                    context.fillStyle = this.fill;
                }
                context.strokeStyle = this.fill;
            }
            // We can skip the drawing of elements that have moved off the screen:
            if (this.x > TASCanvas.gbl.WIDTH || this.y > TASCanvas.gbl.HEIGHT) return;
            if (this.x + this.w < 0 || this.y + this.h < 0) return;

            //context.fillRect(this.x,this.y,this.w,this.h);
            context.fillRect(this.x, this.y, this.w, this.h);
            context.strokeRect(this.x, this.y, this.w, this.h);

            // draw selection
            // this is a stroke along the box and also 8 new selection handles
            if (TASCanvas.gbl.mySel === this) {
                context.strokeStyle = TASCanvas.gbl.mySelColor;
                context.lineWidth = TASCanvas.gbl.mySelWidth;
                context.strokeRect(this.x, this.y, this.w, this.h);
                TASCanvas.gbl.tx = this.x;
                TASCanvas.gbl.ty = this.y;
                TASCanvas.gbl.tw = this.w;
                TASCanvas.gbl.th = this.h;
                TASCanvas.gbl.ts = this.section_id;
                TASCanvas.gbl.tn = this.section_name;
                TASCanvas.gbl.tc = this.crop_id;

                // draw the boxes

                var half = TASCanvas.gbl.mySelBoxSize / 2;

                // 0  1  2
                // 3     4
                // 5  6  7

                // top left, middle, right
                TASCanvas.gbl.selectionHandles[0].x = this.x - half;
                TASCanvas.gbl.selectionHandles[0].y = this.y - half;

                TASCanvas.gbl.selectionHandles[1].x = this.x + this.w / 2 - half;
                TASCanvas.gbl.selectionHandles[1].y = this.y - half;

                TASCanvas.gbl.selectionHandles[2].x = this.x + this.w - half;
                TASCanvas.gbl.selectionHandles[2].y = this.y - half;

                //middle left
                TASCanvas.gbl.selectionHandles[3].x = this.x - half;
                TASCanvas.gbl.selectionHandles[3].y = this.y + this.h / 2 - half;

                //middle right
                TASCanvas.gbl.selectionHandles[4].x = this.x + this.w - half;
                TASCanvas.gbl.selectionHandles[4].y = this.y + this.h / 2 - half;

                //bottom left, middle, right
                TASCanvas.gbl.selectionHandles[6].x = this.x + this.w / 2 - half;
                TASCanvas.gbl.selectionHandles[6].y = this.y + this.h - half;

                TASCanvas.gbl.selectionHandles[5].x = this.x - half;
                TASCanvas.gbl.selectionHandles[5].y = this.y + this.h - half;

                TASCanvas.gbl.selectionHandles[7].x = this.x + this.w - half;
                TASCanvas.gbl.selectionHandles[7].y = this.y + this.h - half;


                context.fillStyle = "#00ff00";
//                context.fillStyle = 'rgba(200,200,200,0.2)';
                //context.fillStyle = 'rgba(128,0,0,1)';
                context.strokeStyle = TASCanvas.gbl.mySelBoxColor;
                for (var i = 0; i < 8; i++) {
                    var cur = TASCanvas.gbl.selectionHandles[i];
                    //context.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
                    context.fillRect(cur.x, cur.y, TASCanvas.gbl.mySelBoxSize, TASCanvas.gbl.mySelBoxSize);
                    context.strokeRect(cur.x, cur.y, TASCanvas.gbl.mySelBoxSize, TASCanvas.gbl.mySelBoxSize);
                }
                TASCanvas.gbl.restore_section_id_new(TASCanvas.gbl.tx, TASCanvas.gbl.ty, TASCanvas.gbl.tw, TASCanvas.gbl.th, TASCanvas.gbl.ts, TASCanvas.gbl.tn)
            }

        } // end draw
}).apply(Box.prototype);

function Canvas(ip, css_path){
	//Utils.call(this);
    this.IP = ip;
    this.CSS_path = css_path;
    this.data = {}
    this.box_flg = false;
    this.cursor_size = ['nw-resize', 'n-resize', 'ne-resize', 'w-resize', 'e-resize', 'sw-resize', 's-resize', 'se-resize'];
    this.vsection_id ='';
    this.vsection_name ='';
    this.vcrop_id ='';
    this.mdtool_select ="select";
    this.vprocess_start_flag ='N';
    this.vcurrURL_P = '';
    this.vcapture_flag =false;
    this.vget_data_flag =false;
    this.vdiv_id="mg_kdiv_tt";
    this.vcapture_dataArr = [];
    this.vsave_single_data = 'Y';
    this.mark_flag = 0;
    this.doc = null;
    this.canvas = null;
    this.boxes = [];
    this.vext = ".jpg"
    this.selectionHandles = [];
    this.WIDTH = 0;
    this.HEIGHT = 0;
    this.ctx = null;
    this.INTERVAL = 20;  // how often, in milliseconds, we check to see if a redraw is needed
    this.vbox_color = '#ff0000';

    this.isDrag = false;
    this.isResizeDrag = false;
    this.expectResize = -1; // New, will save the # of the selection handle if the mouse is over one.
    this.mx = 0;
    this.my = 0; // mouse coordinates
    this.canvasValid = false;
    this.mySel = null;
    this.mySelColor = '#ff0000';
    this.mySelWidth = 2;
    this.mySelBoxColor = '#ff0000'; // New for selection boxes
    this.mySelBoxSize = 6;

    this.ghostcanvas = null;
    this.gctx = null; // fake canvas context

    this.offsetx = 0;
    this.offsety = 0;

    this.stylePaddingLeft = 0;
    this.stylePaddingTop = 0;
    this.styleBorderLeft = 0;
    this.styleBorderTop = 0;
    this.vscroll_left = 0;
    this.vscroll_top = 0;
    //*********************************************************************************************************************************************************
    this.tx = 0;
    this.ty = 0;
    this.tw = 0;
    this.th = 0;
    this.ts = '1';
    this.tn = '';
    this.tc = '';
    this.vline_started = false;
    this.vline_x1 = '';
    this.vline_y1 = '';
    this.new_sect_flg = false;
    this.save_callback = "";
    this.resizFlg = false;
    this.isMouseDown = false;
    this.gbl_rect = null;
}
//Canvas.prototype		= new Utils();
Canvas.prototype.constructor	= Canvas;
(function(){
    this.Log = function(msg){
        console.log(msg);
    }
    this.init_body = function(doc, save_callback, mdtool_select, taxo_dict, iframe_id, iframe_id1){
        var iframe 		= doc.getElementById(iframe_id1);
        this.gbl_rect 		= iframe.getBoundingClientRect()
        this.mdtool_select 	= mdtool_select;
        this.doc 		= doc;
        this.doc_node 		= iframe;
        this.iframe_id 		= iframe_id;
        this.save_callback 	= save_callback;
        TASCanvas.gbl 		= this;
        this.runcanvas_mgnt();
        var taxo_info 		= taxo_dict || {};
        this.show_taxonomy_tree_new(taxo_info);
    }
    this.runcanvas_mgnt     = function(){
        //var content         = document.getElementById("output_html");
        var body            = this.doc_node; //this.doc.body;
        var maxH            = Math.max( Math.max(body.scrollHeight, this.doc.documentElement.scrollHeight), Math.max(body.offsetHeight, this.doc.documentElement.offsetHeight), Math.max(body.clientHeight, this.doc.documentElement.clientHeight));
        var maxW            = Math.max( Math.max(body.scrollWidth, this.doc.documentElement.scrollWidth), Math.max(body.offsetWidth, this.doc.documentElement.offsetWidth), Math.max(body.clientWidth, this.doc.documentElement.clientWidth));

        var vtt = this.doc.getElementById(this.vdiv_id)
        if ( vtt !=null )
        {
             this.EmptyElement(this.vdiv_id);
        }
        var div = this.doc.createElement('div');
        div.setAttribute('id', this.vdiv_id);
        var style = "position:absolute; top:0px; left:0px;";
        style += " height:"+ maxH +'px;';
        style += " width:"+ maxW +'px;';
        style += " z-index:99999999996;";
        div.setAttribute('style', style);
        body.appendChild(div);

        var canv = this.doc.createElement('canvas');
        canv.setAttribute('id', "canv_img_crop");
        div.appendChild(canv);

        var canv = this.doc.createElement('canvas');
        canv.setAttribute('id', "canv_img");
        canv.setAttribute('width', maxW + 'px');
        canv.setAttribute('height', maxH + 'px');
        var style = "position:absolute; top:0px; left:0px;background:#000000;opacity:0;";
        style += " height:"+ maxH +'px;';
        style += " width:"+ maxW +'px;';
        style += " z-index:99999999997;";
        canv.setAttribute('style', style);
        div.appendChild(canv);

        var canv = this.doc.createElement('canvas');
        canv.setAttribute('id', "imageView");
        canv.setAttribute('width', maxW + 'px');
        canv.setAttribute('height', maxH + 'px');
        var style = "position:absolute; top:0px; left:0px;";
        style += " height:"+ maxH +'px;';
        style += " width:"+ maxW +'px;';
        style += " z-index:99999999998;";
        canv.setAttribute('style', style);
        div.appendChild(canv);

        var canv = this.doc.createElement('canvas');
        canv.setAttribute('id', "imageView_draw");
        canv.setAttribute('width', maxW + 'px');
        canv.setAttribute('height', maxH + 'px');
        var style = "position:absolute; top:0px; left:0px;";
        style += " height:"+ maxH +'px;';
        style += " width:"+ maxW +'px;';
        style += " z-index:99999999999;";
        canv.setAttribute('style', style);
        div.appendChild(canv);
        /************************************************** Canvas Scroller *****************************************/
	    /*var dragging_horizontal = this.doc.createElement('div');
        dragging_horizontal.setAttribute('id', "mgnt_dragger");
        var style = "border:#000 1px solid; width:40px; height:40px; position:absolute; cursor:resize; z-index:99999999999;";
        style+=" top:"+(maxH-41)+'px;';
        style+=" left:"+ (maxW-42) +'px;';
        style+="background-image:url('images/resize.png'); background-repeat:no-repeat;";
        dragging_horizontal.setAttribute('style',style);
        dragging_horizontal.onmousedown = this.myDownDiv;
        dragging_horizontal.onmouseup = this.myUpDiv;
        dragging_horizontal.onmousemove = this.myMoveDiv;
    	div.appendChild(dragging_horizontal);*/
        /************************************************************************************************************/
        this.init2();
        this.Clear_boxes();
        this.vget_data_flag = false;
	    this.create_dynamic_divs();
    }
    this.myDownDiv = function()
    {
        TASCanvas.gbl.resizFlg = true;
    }
    this.myUpDiv = function()
    {
        TASCanvas.gbl.resizFlg = false;
    }
    this.myMoveDiv = function(event)
    {
        if(TASCanvas.gbl.resizFlg==true){
                var x=event.pageX;
                //x=doc_width;
                var y=event.pageY;
                //y=doc_height;
                var yy = parseInt(x)+31;
                var xx = parseInt(y)+31;
		        TASCanvas.gbl.doc.getElementById('canv_img').style.width = "";
		        TASCanvas.gbl.doc.getElementById('imageView_draw').style.width = "";
		        TASCanvas.gbl.doc.getElementById('imageView').style.width = "";

                TASCanvas.gbl.doc.getElementById('mgnt_dragger').style.left = (x-20) +'px';              //Repositions Dragging Div
                TASCanvas.gbl.getElementById('mgnt_dragger').style.top = (y-17) +'px';
		        for(var i=1; i<4; i++)
		        {
			        var canvas = this.doc.getElementsByTagName('canvas')[i];
			        canvas.width  = yy-5;
			        canvas.height = xx-5;
		        }
                TASCanvas.gbl.doc.getElementById('canv_img').style.width = (yy-5) +'px';                 //Sets The Width to Canvas
		        TASCanvas.gbl.doc.getElementById('mg_kdiv_tt').style.width = (yy-5) +'px';
                TASCanvas.gbl.doc.getElementById('imageView_draw').style.width = (yy-5) +'px';
                TASCanvas.gbl.doc.getElementById('imageView').style.width = (yy-5) +'px';

                TASCanvas.gbl.doc.getElementById('canv_img').style.height = (xx-5) +'px';                //Sets The Height to Canvas
                TASCanvas.gbl.doc.getElementById('mg_kdiv_tt').style.height = (xx-5) +'px';
                TASCanvas.gbl.doc.getElementById('imageView_draw').style.height = (xx-5) +'px';
                TASCanvas.gbl.doc.getElementById('imageView').style.height = (xx-5) +'px';
        }
}

    this.hide_popup_div = function()
    {
            this.doc.getElementById("profile_disp_div").innerHTML = "";
	    this.doc.getElementById("pop_SaveCancel_div").style.display = 'none';
	    this.doc.getElementById("profile_cat_div").style.display = "none";
    }
    this.create_dynamic_divs = function()
    {
	    this.new_sect_flg = false;
	    this.vcapture_flag =true;
	    var head = this.doc.getElementsByTagName("head")[0]
        style = this.doc.createElement("link");
        style.id = "link-target-finder-style";
        style.type = "text/css";
        style.rel = "stylesheet";
        style.href = this.IP + this.CSS_path+"wl_b.css";
        console.log(style.href);
        head.appendChild(style);

	    var myHeight = this.doc.documentElement.clientHeight;
	    var pH = myHeight - 55;
	    var dH = myHeight - 180;
        //	POPUP Div Start
	    var pop_Div = this.doc.createElement("div");
	    pop_Div.setAttribute("id", "pop_SaveCancel_div");
	    pop_Div.setAttribute("class", "cs_pop_SaveCancel_div");
	    var style = "opacity:10;display:none;z-index:2147483647;";
        pop_Div.setAttribute('style', style);

        //	Save and Cancel Buttons
	    var pop_R_Div = this.doc.createElement("div");
	    pop_R_Div.setAttribute("id", "pop_right_div");
	    pop_R_Div.setAttribute("class", "cs_pop_right_div");

	    var save_div = this.doc.createElement("div");
	    save_div.setAttribute("class", "cs_SaveCancel_S");

        var style = "width: 48px;background:url("+this.IP+this.CSS_path+"save.png) no-repeat center";
        //var style = "width: 48px;background:url("+this.IP+this.CSS_path+"preview.png) no-repeat center";
        save_div.setAttribute('style', style);
        save_div.setAttribute('title', "Save");
    	var t_this = this;
        save_div.onclick = function() {
            t_this.save_callback(t_this);
        }

	    var cancel_div = this.doc.createElement("div");
	    cancel_div.setAttribute("class", "cs_SaveCancel_C");
        var style = "background:url("+this.IP+this.CSS_path+"cancel.png) no-repeat center";
        cancel_div.setAttribute('title', "Delete Selected Crop");
        cancel_div.setAttribute('style', style);
        cancel_div.onclick = function() {
            TASCanvas.gbl.hide_popup_div();
            TASCanvas.gbl.RemoveRect();
            //TASApp.documentpage.unhighlight_cells();
        }
        //var proceed_div = this.doc.createElement("div");
        //proceed_div.setAttribute("class", "cs_SaveCancel_C");
        //var style = "background:url("+this.IP+this.CSS_path+"proceed.png) no-repeat center";
        //proceed_div.setAttribute('title', "proceed to Next level");
        //proceed_div.setAttribute('style', style);
        //proceed_div.onclick = function() {
       // 	get_data();
       //}
	    var Prfl_div = this.doc.createElement("div");
	    Prfl_div.setAttribute("id", "profile_disp_div");
	    Prfl_div.setAttribute("class", "cs_prfl_div");
	    pop_R_Div.appendChild(save_div);
	    pop_R_Div.appendChild(cancel_div);
            //pop_R_Div.appendChild(proceed_div);
	    pop_R_Div.appendChild(Prfl_div);

	    pop_Div.appendChild(pop_R_Div);
	    var mdiv = this.doc.getElementById(this.vdiv_id);
	    mdiv.appendChild(pop_Div);
    }

    this.EmptyElement = function(kdiv_id) {
        var div = this.doc.getElementById(kdiv_id);
	if (div){
        	div.parentNode.removeChild(div);
	}
    }
    this.init2          = function(){
        this.canvas     = this.doc.getElementById('imageView');
        this.HEIGHT     = this.canvas.height;
        this.WIDTH      = this.canvas.width;
        this.ctx        = this.canvas.getContext('2d');

        this.canvas_draw= this.doc.getElementById('imageView_draw');
        //alert(this.canvas_draw.height+'===============================================================')
        this.HEIGHT     = this.canvas_draw.height;
        this.WIDTH      = this.canvas_draw.width;
        this.ctx_draw   = this.canvas_draw.getContext('2d');

        this.ghostcanvas = this.doc.createElement('canvas');
        this.ghostcanvas.height = this.HEIGHT;
        this.ghostcanvas.width = this.WIDTH;
        this.gctx = this.ghostcanvas.getContext('2d');

        //fixes a problem where double clicking causes text to get selected on the canvas
        this.canvas.onselectstart = function () { return False; }

        // fixes mouse co-ordinate problems when there's a border or padding
        // see getMouse for more detail
        if (this.doc.defaultView && this.doc.defaultView.getComputedStyle) {
            this.stylePaddingLeft = parseInt(this.doc.defaultView.getComputedStyle(this.canvas, null)['paddingLeft'], 10) || 0;
            this.stylePaddingTop = parseInt(this.doc.defaultView.getComputedStyle(this.canvas, null)['paddingTop'], 10) || 0;
            this.styleBorderLeft = parseInt(this.doc.defaultView.getComputedStyle(this.canvas, null)['borderLeftWidth'], 10) || 0;
            this.styleBorderTop = parseInt(this.doc.defaultView.getComputedStyle(this.canvas, null)['borderTopWidth'], 10) || 0;
        }
        // make mainDraw() fire every INTERVAL milliseconds
        setInterval(this.mainDraw, this.INTERVAL);

        // set our events. Up and down are for dragging,
        // double click is for making new boxes
        this.canvas_draw.onmousedown    = this.myDown_new;
        this.canvas_draw.onmouseup      = this.myUp_new;
        this.canvas_draw.ondblclick     = this.myDblClick_New;
        this.canvas_draw.onmousemove    = this.myMove_new;
        this.canvas_draw.onclick        = this.myClick;

        // set up the selection handle boxes
        for (var i = 0; i < 8; i++) {
            var rect = new Box();
            this.selectionHandles.push(rect);
        }
    }
    this.Getdwg_select_rect = function(){
        this.mdtool_select = 'select';
    }
    this.isScrolledIntoView = function(elem)
    {
        var window_var = this.doc.defaultView;
        var docViewTop = $(window_var).scrollTop();
        var docViewBottom = docViewTop + $(window_var).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }
    this.restore_section_id_new = function(kx, ky, kw, kh, ksection_id, ksection_name)
    {
        this.doc_hght = this.doc.body.scrollHeight;
        var li_b = (this.doc_hght - ky)+ 45;
        var pop_right_div_wid = this.doc.getElementById("pop_SaveCancel_div").offsetWidth;
        var pky = ky - 48;
        var kx_new = kx + kw -(pop_right_div_wid + 5) ;
        var li_x = kx;
        var li_y = ky - 60;
        if(pky < 0)
        {
                pky = ky + kh;
        }
	    cat_y = pky + kh + 50;
	    cat_x = kx+1
        //this.doc.getElementById("pop_SaveCancel_div").style.left = kx_new + 'px';
        this.doc.getElementById("pop_SaveCancel_div").style.left = kx + 'px';
        this.doc.getElementById("pop_SaveCancel_div").style.top = pky + 'px';
        this.doc.getElementById("pop_SaveCancel_div").style.display = "block";
	    if(this.box_flg == false){
		    this.doc.getElementById("profile_cat_div").style.display = "block";
		    this.doc.getElementById("profile_cat_div").style.left = cat_x+'px';
		    this.doc.getElementById("profile_cat_div").style.top = cat_y + 'px';
        var check_overflow = this.doc.querySelector('nav.vertical li > ul');
        var a  = document.getElementById(this.iframe_id) || document.getElementById("output_html") ;
        this.doc.documentElement.scrollLeft = 10
        var b =   this.doc.body.getBoundingClientRect();
        var athis = this.doc;
        this.doc.querySelector('nav.vertical li').addEventListener("mouseover", function(){
        if(b.width >= cat_y+10 ){
            athis.documentElement.scrollLeft = b.width - 235;
        }
      });
    }
        //var div_section_user_master_text_span = this.doc.getElementById("div_section_user_master_text_span");
        if ( ksection_name == '' )
        {
           ksection_name = 'Select Section';
        }
    }
    this.restore_section_id = function(kx,ky,kw,kh, ksection_id, ksection_name)
    {
        this.doc_hght = this.doc.body.scrollHeight;
        li_b = (this.doc_hght - ky)+ 45;
        pky = ky - 48;
        li_x = kx;
        li_y = ky - 60;
        if(pky < 0)
        {
                pky = ky + kh;
        }
        this.doc.getElementById("pop_SaveCancel_div").style.left = kx + 'px';
        this.doc.getElementById("pop_SaveCancel_div").style.top = pky + 'px';

        this.doc.getElementById("wl_div_section_user_master").style.left = li_x + 'px';
        if(li_y < 0)
        {
                li_y = pky + 45;
                this.doc.getElementById("wl_div_section_user_master").style.top = li_y + 'px';
                this.doc.getElementById("wl_div_section_user_master").style.bottom = '';
        }else{
                this.doc.getElementById("wl_div_section_user_master").style.bottom = li_b + 'px';
                this.doc.getElementById("wl_div_section_user_master").style.top = '';
        }


        this.doc.getElementById("pop_SaveCancel_div").style.display = "block";
        this.doc.getElementById("wl_div_section_user_master").style.display = "none";

        var div_section_user_master_text_span = this.doc.getElementById("div_section_user_master_text_span");
        if ( ksection_name =='' )
        {
           ksection_name = 'Select Section';
        }
        else
        {
           ksection_name = 'Edit Section';
        }
        div_section_user_master_text_span.innerHTML = ksection_name;
    }
    this.myDown = function(e) {
        TASCanvas.gbl.getMouse(e);
        //we are over a selection box
        if (TASCanvas.gbl.expectResize !== -1) {
		    TASCanvas.gbl.box_flg = true;
		    TASCanvas.gbl.doc.getElementById("profile_cat_div").style.display = "none";
            TASCanvas.gbl.isResizeDrag = true;
            return;
        }
        TASCanvas.gbl.clear(TASCanvas.gbl.gctx);
        var l = TASCanvas.gbl.boxes.length;
        for (var i = l - 1; i >= 0; i--) {
            // draw shape onto ghost context
            TASCanvas.gbl.boxes[i].draw(TASCanvas.gbl.gctx, 'black');

            // get image data at the mouse x,y pixel
            var imageData = TASCanvas.gbl.gctx.getImageData(TASCanvas.gbl.mx, TASCanvas.gbl.my, 1, 1);
            var index = (TASCanvas.gbl.mx + TASCanvas.gbl.my * imageData.width) * 4;

            // if the mouse pixel exists, select and break
            if (imageData.data[3] > 0) {
                TASCanvas.gbl.mySel = TASCanvas.gbl.boxes[i];
                TASCanvas.gbl.offsetx = TASCanvas.gbl.mx - TASCanvas.gbl.mySel.x;
                TASCanvas.gbl.offsety = TASCanvas.gbl.my - TASCanvas.gbl.mySel.y;
                TASCanvas.gbl.mySel.x = TASCanvas.gbl.mx - TASCanvas.gbl.offsetx;
                TASCanvas.gbl.mySel.y = TASCanvas.gbl.my - TASCanvas.gbl.offsety;
                TASCanvas.gbl.vsection_id = TASCanvas.gbl.mySel.section_id;
                TASCanvas.gbl.vsection_name = TASCanvas.gbl.mySel.section_name;
                TASCanvas.gbl.vcrop_id =  TASCanvas.gbl.mySel.crop_id;
                TASCanvas.gbl.isDrag = true;
                TASCanvas.gbl.invalidate();
                TASCanvas.gbl.clear(TASCanvas.gbl.gctx);
                if ( TASCanvas.gbl.vsection_id != '')
                {
                    TASCanvas.gbl.restore_section_id_new(TASCanvas.gbl.mySel.x, TASCanvas.gbl.mySel.y, TASCanvas.gbl.mySel.w, TASCanvas.gbl.mySel.h, TASCanvas.gbl.vsection_id, TASCanvas.gbl.vsection_name)
                }
                else
                {
                    TASCanvas.gbl.restore_section_id_new(TASCanvas.gbl.mySel.x, TASCanvas.gbl.mySel.y, TASCanvas.gbl.mySel.w, TASCanvas.gbl.mySel.h, '','')
                }
                return;
            }

        }
        // havent returned means we have selected nothing
        TASCanvas.gbl.mySel = null;
        // clear the ghost canvas for next time
        TASCanvas.gbl.clear(TASCanvas.gbl.gctx);
        // invalidate because we might need the selection border to disappear
        TASCanvas.gbl.invalidate();
    }
    //*********************************************************************************************************************************************************
    this.myUp = function() {
        TASCanvas.gbl.isDrag = false;
        TASCanvas.gbl.isResizeDrag = false;
        TASCanvas.gbl.expectResize = -1;
    }

    this.myDown_new = function(e) {
	console.log(e, TASCanvas.gbl.mdtool_select)
        TASCanvas.gbl.Get_Scroll_Left_Top();
        if (TASCanvas.gbl.mdtool_select == 'select') {
            TASCanvas.gbl.myDown(e);
        } else if (TASCanvas.gbl.mdtool_select == 'line_highlighter') {
            TASCanvas.gbl.getMouse(e);
            TASCanvas.gbl.vline_started = true;
            TASCanvas.gbl.vline_x1 = TASCanvas.gbl.mx;
            TASCanvas.gbl.vline_y1 = TASCanvas.gbl.my;
            this.style.cursor = 'crosshair';
        } else if (TASCanvas.gbl.mdtool_select == 'group_highlighter') {
            TASCanvas.gbl.getMouse(e);
            TASCanvas.gbl.vline_started = true;
            TASCanvas.gbl.vline_x1 = TASCanvas.gbl.mx;
            TASCanvas.gbl.vline_y1 = TASCanvas.gbl.my;
            this.style.cursor = 'crosshair';
            TASCanvas.gbl.isMouseDown = true;
            TASCanvas.gbl.move_x = e.clientX;
            TASCanvas.gbl.move_y = e.clientY;
        }
    }
    this.myUp_new = function(e) {

        //var mdtool_select = this.doc.getElementById("dtool_select").value;
	    TASCanvas.gbl.box_flg = false;
        if (TASCanvas.gbl.mdtool_select == 'select') {
            TASCanvas.gbl.myUp(e);
        } else if (TASCanvas.gbl.mdtool_select == 'line_highlighter') {
            if (TASCanvas.gbl.vline_started) {
                TASCanvas.gbl.myMove_new(e);
                var width = 20;
                var height = 10;
                width = TASCanvas.gbl.mx - vline_x1;
                TASCanvas.gbl.addRect(TASCanvas.gbl.vline_x1, TASCanvas.gbl.my - (height / 2), width, height, TASCanvas.gbl.vbox_color, false,'','','');
                this.style.cursor = 'auto';
                TASCanvas.gbl.vline_started = false;
                TASCanvas.gbl.invalidate();
            }
        } else if (TASCanvas.gbl.mdtool_select == 'group_highlighter') {
            if (TASCanvas.gbl.vline_started) {
                TASCanvas.gbl.isMouseDown = false;
                TASCanvas.gbl.move_x = 0;
                TASCanvas.gbl.move_y = 0;
                TASCanvas.gbl.myMove_new(e);
                this.style.cursor = 'auto';
                var x = Math.min(TASCanvas.gbl.mx, TASCanvas.gbl.vline_x1),
          		y = Math.min(TASCanvas.gbl.my, TASCanvas.gbl.vline_y1),
          		w = Math.abs(TASCanvas.gbl.mx - TASCanvas.gbl.vline_x1),
          		h = Math.abs(TASCanvas.gbl.my - TASCanvas.gbl.vline_y1);
                if (!w || !h) {
                    TASCanvas.gbl.vline_started = false;
                    return;
                }
                TASCanvas.gbl.addRect(x, y, w, h, TASCanvas.gbl.vbox_color, false,'','','');
                var vlen = TASCanvas.gbl.boxes.length - 1;
                TASCanvas.gbl.mySel = TASCanvas.gbl.boxes[vlen];
                TASCanvas.gbl.offsetx = TASCanvas.gbl.mx - TASCanvas.gbl.mySel.x;
                TASCanvas.gbl.offsety = TASCanvas.gbl.my - TASCanvas.gbl.mySel.y;
                TASCanvas.gbl.mySel.x = TASCanvas.gbl.mx - TASCanvas.gbl.offsetx;
                TASCanvas.gbl.mySel.y = TASCanvas.gbl.my - TASCanvas.gbl.offsety;

                //TASCanvas.gbl.isDrag = true;
                TASCanvas.gbl.tx = x;
                TASCanvas.gbl.ty = y;
                TASCanvas.gbl.tw = w;
                TASCanvas.gbl.th = h;
                TASCanvas.gbl.ts = TASCanvas.gbl.vsection_id;
                TASCanvas.gbl.tn = TASCanvas.gbl.vsection_name;
                TASCanvas.gbl.ctx_draw.clearRect(0, 0, TASCanvas.gbl.canvas_draw.width, TASCanvas.gbl.canvas_draw.height);
                //TASCanvas.gbl.GetData_Details();
                this.style.cursor = 'auto';
                TASCanvas.gbl.vline_started = false;
                TASCanvas.gbl.invalidate();
                //alert("yes")
                TASCanvas.gbl.restore_section_id_new(TASCanvas.gbl.tx, TASCanvas.gbl.ty,TASCanvas.gbl.tw,TASCanvas.gbl.th, '','')
                //TASCanvas.gbl.show_footer(tx,ty);
                TASCanvas.gbl.Getdwg_select_rect(); //DK
                //this.doc.getElementById('cmddraw_rect').style.color = "red";
                TASCanvas.gbl.mark_pick_Flg = false;
            }
        }
    }
    this.myDblClick_New = function(e) {
        TASCanvas.gbl.getMouse(e);
        // for this method width and height determine the starting X and Y, too.
        // so I left them as vars in case someone wanted to make them args for something and copy this code
        //TASCanvas.gbl.GetRestore_chunk_master_chunk_cord(TASCanvas.gbl.mx, TASCanvas.gbl.my);
    }
    this.myMove_new = function(e) {
        //  this.doc.getElementById("lblcord_xy").innerHTML =mx+","+my+"px";
        TASCanvas.gbl.Get_Scroll_Left_Top();
        //this.doc.getElementById("lblcord_xy").innerHTML =e.pageX+","+e.pageY+"px" +" **** "+TASCanvas.gbl.vscroll_top +" $$$$$ "+TASCanvas.gbl.vscroll_left;

        //var mdtool_select = this.doc.getElementById("dtool_select").value;
        //alert(mdtool_select);
        if (TASCanvas.gbl.mdtool_select == 'select') {
            TASCanvas.gbl.myMove(e);
        } else if (TASCanvas.gbl.mdtool_select == 'line_highlighter') {
            if (!TASCanvas.gbl.vline_started) {
                return;
            }
            TASCanvas.gbl.getMouse(e);
            TASCanvas.gbl.ctx.beginPath();
            TASCanvas.gbl.ctx.moveTo(TASCanvas.gbl.vline_x1, TASCanvas.gbl.vline_y1);
            TASCanvas.gbl.ctx.lineTo(TASCanvas.gbl.mx, TASCanvas.gbl.vline_y1);
            TASCanvas.gbl.ctx.stroke();
            TASCanvas.gbl.ctx.closePath();
        } else if (TASCanvas.gbl.mdtool_select == 'group_highlighter') {
            if (!TASCanvas.gbl.vline_started) {
                return;
            }
            TASCanvas.gbl.getMouse(e);
            var x = Math.min(TASCanvas.gbl.mx, TASCanvas.gbl.vline_x1),
            y = Math.min(TASCanvas.gbl.my, TASCanvas.gbl.vline_y1),
            w = Math.abs(TASCanvas.gbl.mx - TASCanvas.gbl.vline_x1),
            h = Math.abs(TASCanvas.gbl.my - TASCanvas.gbl.vline_y1);

            var mouseUpX = Math.max(TASCanvas.gbl.mx, TASCanvas.gbl.vline_x1);
            var mouseUpY = Math.max(TASCanvas.gbl.my, TASCanvas.gbl.vline_y1);
            TASCanvas.gbl.ctx_draw.clearRect(0, 0, TASCanvas.gbl.canvas_draw.width, TASCanvas.gbl.canvas_draw.height);
            if (!w || !h) {
                return;
            }
            TASCanvas.gbl.ctx_draw.strokeStyle = 'rgba(255,0,0,1)';
            TASCanvas.gbl.ctx_draw.strokeRect(x, y, w, h)
            // TASCanvas.gbl.ctx_draw.fillStyle = 'rgba(255,255,255,0.9)';
            //TASCanvas.gbl.ctx_draw.fillStyle = '#FFFFFF';

            //TASCanvas.gbl.scrollingMove(w, h, mouseUpX, mouseUpY);
        }
    }
    // Happens when the mouse is moving inside the canvas
    this.myMove = function(e) {
        if (TASCanvas.gbl.isDrag) {
            TASCanvas.gbl.getMouse(e);
            TASCanvas.gbl.mySel.x = TASCanvas.gbl.mx - TASCanvas.gbl.offsetx;
            TASCanvas.gbl.mySel.y = TASCanvas.gbl.my - TASCanvas.gbl.offsety;

            // something is changing position so we better invalidate the canvas!
            TASCanvas.gbl.invalidate();
        } else if (TASCanvas.gbl.isResizeDrag) {
            // time ro resize!
            var oldx = TASCanvas.gbl.mySel.x;
            var oldy = TASCanvas.gbl.mySel.y;
            // 0  1  2
            // 3     4
            // 5  6  7
            switch (TASCanvas.gbl.expectResize) {
                case 0:
                    TASCanvas.gbl.mySel.x = TASCanvas.gbl.mx;
                    TASCanvas.gbl.mySel.y = TASCanvas.gbl.my;
                    TASCanvas.gbl.mySel.w += oldx - TASCanvas.gbl.mx;
                    TASCanvas.gbl.mySel.h += oldy - TASCanvas.gbl.my;
                    break;
                case 1:
                    TASCanvas.gbl.mySel.y = TASCanvas.gbl.my;
                    TASCanvas.gbl.mySel.h += oldy - TASCanvas.gbl.my;
                    break;
                case 2:
                    TASCanvas.gbl.mySel.y = TASCanvas.gbl.my;
                    TASCanvas.gbl.mySel.w = TASCanvas.gbl.mx - oldx;
                    TASCanvas.gbl.mySel.h += oldy - TASCanvas.gbl.my;
                    break;
                case 3:
                    TASCanvas.gbl.mySel.x = TASCanvas.gbl.mx;
                    TASCanvas.gbl.mySel.w += oldx - TASCanvas.gbl.mx;
                    break;
                case 4:
                    TASCanvas.gbl.mySel.w = TASCanvas.gbl.mx - oldx;
                    break;
                case 5:
                    TASCanvas.gbl.mySel.x = TASCanvas.gbl.mx;
                    TASCanvas.gbl.mySel.w += oldx - TASCanvas.gbl.mx;
                    TASCanvas.gbl.mySel.h = TASCanvas.gbl.my - oldy;
                    break;
                case 6:
                    TASCanvas.gbl.mySel.h = TASCanvas.gbl.my - oldy;
                    break;
                case 7:
                    TASCanvas.gbl.mySel.w = TASCanvas.gbl.mx - oldx;
                    TASCanvas.gbl.mySel.h = TASCanvas.gbl.my - oldy;
                    break;
            }

            TASCanvas.gbl.invalidate();
        }

        TASCanvas.gbl.getMouse(e);
        // if there's a selection see if we grabbed one of the selection handles
        if (TASCanvas.gbl.mySel !== null && !TASCanvas.gbl.isResizeDrag) {
            for (var i = 0; i < 8; i++) {
                // 0  1  2
                // 3     4
                // 5  6  7

                var cur = TASCanvas.gbl.selectionHandles[i];

                // we dont need to use the ghost context because
                // selection handles will always be rectangles
                if (TASCanvas.gbl.mx >= cur.x && TASCanvas.gbl.mx <= cur.x + TASCanvas.gbl.mySelBoxSize &&
                                        TASCanvas.gbl.my >= cur.y && TASCanvas.gbl.my <= cur.y + TASCanvas.gbl.mySelBoxSize) {
                    // we found one!
                    TASCanvas.gbl.expectResize = i;
                    TASCanvas.gbl.invalidate();
                    TASCanvas.gbl.canvas_draw.style.cursor = TASCanvas.gbl.cursor_size[i];
                    return;
                }
            }
            // not over a selection box, return to normal
            TASCanvas.gbl.isResizeDrag = false;
            TASCanvas.gbl.expectResize = -1;
            TASCanvas.gbl.canvas_draw.style.cursor = 'auto';
        }

    }
    this.myClick = function(e) {
        //TASCanvas.gbl.ctx_draw.clearRect(0, 0, TASCanvas.gbl.canvas_draw.width, TASCanvas.gbl.canvas_draw.height);
        //TASCanvas.gbl.GetData_Details(e);
        //TASCanvas.gbl.GetRestore_user_visual_rule_master_class_type();
        //TASCanvas.gbl.Get_Intersected_Cords_Details();
        //TASCanvas.gbl.Get_GroupData_OnSelection();
        //TASCanvas.gbl.restore_KValues_By_Cord();
    }
    // Sets mx,my to the mouse position relative to the canvas
    // unfortunately this can be tricky, we have to worry about padding and borders
    this.getMouse = function(e) {
        var element = TASCanvas.gbl.canvas, offsetX = 0, offsetY = 0;

        if (element.offsetParent) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
            } while ((element = element.offsetParent));
        }

        // Add padding and border style widths to offset
        offsetX += TASCanvas.gbl.stylePaddingLeft;
        offsetY += TASCanvas.gbl.stylePaddingTop;

        offsetX += TASCanvas.gbl.styleBorderLeft;
        offsetY += TASCanvas.gbl.styleBorderTop;

        /*      TASCanvas.gbl.mx = e.pageX - offsetX;
        TASCanvas.gbl.my = e.pageY - offsetY
        */
        TASCanvas.gbl.mx = e.pageX + TASCanvas.gbl.vscroll_left - offsetX;
        TASCanvas.gbl.my = e.pageY + TASCanvas.gbl.vscroll_top - offsetY
        TASCanvas.gbl.Get_Scroll_Left_Top();
        if (TASCanvas.gbl.isMouseDown){
            TASCanvas.gbl.autoScrolling(e);
        }
    }
    this.autoScrolling = function(e){
        var delta = 10;
        var mx = e.clientX;
        var my = e.clientY;
        var scrollTop = this.doc.scrollTop || $(frames['iframe_filter']).scrollTop();
        var scrollHeight = this.doc.scrollHeight || $(frames['iframe_filter']).scrollHeight;
        var ok = scrollTop >= scrollHeight - this.doc.body.height ;
        var iframe_content = document.getElementById(this.iframe_id).contentWindow;
        if (!ok){
            //console.log("===="+frames['iframe_filter'].innerHeight+"====="+my+"==="+scrollTop+"===="+ok);
            var diffY = 0, diffX = 0;
            //if ((frames['iframe_filter'].innerHeight - my) < 30){
            if ((iframe_content.innerHeight - my) < 30){
                diffY = delta;
            }else if (my < 30){
                diffY = -1*delta;
            }
            //if ((frames['iframe_filter'].innerWidth - mx) < 30){
            if ((iframe_content.innerWidth - mx) < 30){
                diffX = delta;
            }else if (mx < 30){
                diffX = -1*delta;
            }
            setTimeout(function () {
                //frames['iframe_filter'].scrollBy(diffX, diffY);
                iframe_content.scrollBy(diffX, diffY);
            }, 100);

        }
    }
    this.Get_Scroll_Left_Top = function(){
        var obj_container = this.doc.getElementById(this.vdiv_id);
        this.vscroll_left = obj_container.scrollLeft;
        this.vscroll_top = obj_container.scrollTop;
    }
    //Initialize a new Box, add it, and invalidate the canvas
    this.addRect = function(x, y, w, h, fill, fill_flg, section_id, section_name, crop_id) {
        //get_back_prev();
        var rect = new Box();
        rect.x = x;
        rect.y = y;
        rect.w = w
        rect.h = h;
        rect.fill = fill;
        rect.fill_flg = fill_flg;
        rect.section_id = section_id;
        rect.section_name = section_name;
        rect.crop_id = crop_id;
        this.boxes.push(rect);
        this.invalidate();
    }
    this.getSelectedCord = function() {
        var vret = this.tx + "_" + this.ty + "_" + this.tw + "_" + this.th;
        return vret;
    }
    this.getSelectedCord_single = function() {
        var vretArr = [];
        var vret = this.tx + "_" + this.ty + "_" + this.tw + "_" + this.th;
        var vttArr = vret.split('_');
        var vdom_sign = this.get_intersected_indxs(vttArr)
        //var vc_capture_data = this.new c_capture_data(vret, ts,vdom_sign)
        //vretArr.push(vc_capture_data);
        var vret_final = "section_id=" +this.ts+ "&crop_cord="+vret+"&"+vdom_sign;
        return vret_final;
    }
    this.getSelectedCord_undo = function() {
        var vret = this.tx + ":^^:" + this.ty + ":^^:" + this.tw + ":^^:" + this.th+ ":^^:" + this.ts+ ":^^:" + this.tn+ ":^^:" + this.tc;
        return vret;
    }
    this.Clear_boxes = function() {
        this.boxes = [];
        this.tx = 0;
        this.ty = 0;
        this.tw = 0;
        this.th = 0;
        this.ts = '1';
        this.tn = '';
        this.tc = '';
        this.invalidate();
    }
    this.GetCord_Data_All = function() {
      var vretArr = [], vrow, vttArr, vdom_sign;
      for (var i = 0; i < this.boxes.length; i++) {
            if (this.boxes[i].fill == this.vbox_color) {
                if (this.boxes[i].x != '') {
                    vrow = this.boxes[i].x + "_" + this.boxes[i].y + "_" + this.boxes[i].w + "_" + this.boxes[i].h;
                    vttArr = vrow.split('_');
                    vdom_sign = this.get_intersected_indxs(vttArr)
                    //alert(vrow +">>>>>>>>"+vdom_sign )
                    var vc_capture_data = JSON.parse(JSON.stringify({cord : vrow, section_id : this.boxes[i].section_id, dom_sign : vdom_sign}));
                    vretArr.push(vc_capture_data);
                }
            }
        }
        return vretArr;
    }
    this.addRect_selection = function(x, y, w, h) {
        this.ctx_draw.fillStyle = 'rgba(200,200,200,0.2)';
        this.ctx_draw.strokeStyle = 'rgba(255,255,0,0.4)';
        this.ctx_draw.fillRect(x, y, w, h);
        this.ctx_draw.strokeRect(x, y, w, h);
    }
    this.mySearch_Clear = function() {
        this.ctx_draw.clearRect(0, 0, this.canvas_draw.width, this.canvas_draw.height);
    }

    this.getSelectedCord_Delete = function() {
        var vret = this.tx + "_" + this.ty + "_" + this.tw + "_" + this.th+"_" + this.tc;
        return vret;
    }
    this.RemoveRect = function() {
        var rcrop_id = '';
        var tmp_arr = new Array();
        var vcord_tt = this.getSelectedCord_Delete();
        for (var i = 0; i < this.boxes.length; i++) {
            var vcord_arr = this.boxes[i].x +"_"+ this.boxes[i].y +"_"+ this.boxes[i].w+"_"+ this.boxes[i].h+"_"+ this.boxes[i].crop_id;
            var rectObj = this.boxes[i];
            if (this.boxes[i].fill == this.vbox_color) {
                if (vcord_arr == vcord_tt )
                {
                    rcrop_id = this.boxes[i].crop_id;
                    //this.boxes.splice(i,1);
                    //break;
                }
                else
                {
                     tmp_arr.push(rectObj);
                }
            }

        }
        this.boxes = tmp_arr;
        this.invalidate();
//        this.mainDraw();
	    this.Getdwg_select_Group_Highlighter_mgnt();
    }
    this.update_section_id = function(ksection_id, ksection_name) {
        var vcord_tt = this.getSelectedCord();
        for (var i = 0; i < this.boxes.length; i++) {
            var vcord_arr = this.boxes[i].x +"_"+ this.boxes[i].y +"_"+ this.boxes[i].w+"_"+ this.boxes[i].h;
            if (this.boxes[i].fill == this.vbox_color) {
                if (vcord_arr == vcord_tt )
                {
                    this.boxes[i].section_id = ksection_id;
                    this.boxes[i].section_name = ksection_name;
                    this.ts = ksection_id;
                    this.tn = ksection_name;
                    break;
                }
            }
        }
        this.invalidate();
        this.mainDraw();
    }
    this.update_crop_id = function(kcrop_id) {
        var vcord_tt = this.getSelectedCord();
        for (var i = 0; i < this.boxes.length; i++) {
            var vcord_arr = this.boxes[i].x +"_"+ this.boxes[i].y +"_"+ this.boxes[i].w+"_"+ this.boxes[i].h;
            if (this.boxes[i].fill == this.vbox_color) {
                if (vcord_arr == vcord_tt )
                {
                    this.boxes[i].crop_id = kcrop_id;
                    tc = kcrop_id ;
                    break;
                }
            }
        }
        this.invalidate();
        this.mainDraw();
    }

    this.invalidate = function() {
        this.canvasValid = false;
    }
    
    this.GetData_Details = function(eve){
        var elm = eve.target;
    }
    
    this.mainDraw = function() {
        if (!TASCanvas.gbl.canvasValid) {
            TASCanvas.gbl.clear(TASCanvas.gbl.ctx);
            // Add stuff you want drawn in the background all the time here
            // draw all boxes
            var l = TASCanvas.gbl.boxes.length;
            for (var i = 0; i < l; i++) {
                TASCanvas.gbl.boxes[i].draw(TASCanvas.gbl.ctx); // we used to call drawshape, but now each box draws itself

            }
            // Add stuff you want drawn on top all the time here
            TASCanvas.gbl.canvasValid = true;
        }
    }
    this.clear = function(c) {
        try {
           c.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        } catch (e) {
            this.Log("============="+e);
        }
    }
    this.show_footer = function(kx,ky)
    {
	    this.doc.getElementById("pop_SaveCancel_div").style.display = "block";
	    this.doc.getElementById("profile_cat_div").style.display = "block";
        /*this.doc.getElementById("pop_SaveCancel_div").style.left = kx;
        this.doc.getElementById("pop_SaveCancel_div").style.top = ky; */
        this.doc.getElementById("pop_SaveCancel_div").style.left = "10px";
        this.doc.getElementById("pop_SaveCancel_div").style.top = ky;
    }
    this.Getdwg_select_Group_Highlighter_mgnt = function(prof_row_id)
    {
        if (prof_row_id != undefined){
	        //this.vdoc_id = this.k_doc_id;
	        this.k_row_id = prof_row_id;
        }
	    if  ( this.vcapture_flag == false )
   	    {
       		this.runcanvas_mgnt();
   	    }
   	    this.mdtool_select = 'group_highlighter';
    }
    this.scrollingMove = function(rectWidth, rectHeight, kx, ky) {
        var divContainer = this.doc.getElementById(this.vdiv_id);
        if (!kx && !ky)
            return;
        this.scrollTopHeight = this.doc.getElementById(this.vdiv_id).scrollTop;
        this.scrollLeftwidth = this.doc.getElementById(this.vdiv_id).scrollLeft;
        if (kx > (divContainer.offsetWidth - 25)) {
            this.doc.getElementById(this.vdiv_id).scrollLeft = 3 + this.scrollLeftwidth;
        }
        if (ky > (divContainer.offsetHeight - 25)) {
            this.doc.getElementById(this.vdiv_id).scrollTop = 3 + this.scrollTopHeight;
        }
    }
    this.select_taxonomy = function(dom, e){
	    this.taxo_id	= Number(dom.getAttribute("taxo_id"));
	    this.taxo_name	= dom.getAttribute("taxo_name");
	    this.doc.getElementById('profile_disp_div').innerHTML = this.taxo_name;
        //if (e.preventDefault) e.preventDefault();
        //if (e.stopPropagation) e.stopPropagation()
    }
    this.createDOM = function(tagName,attributes,parentElem){
	    var domElem	= parentElem.ownerDocument.createElement(tagName);
	    this.setAttr(domElem,attributes);
	    parentElem.appendChild(domElem);
	    return domElem;
    }
    this.setAttr = function(elem, attr){
        if("txt" in attr){
                elem.innerHTML  = attr["txt"];
                delete attr["txt"];
        }
        for(var key in attr )
                elem.setAttribute(key, attr[key]);
    }
    this.create_taxo_tree = function(taxo_dict, parentElm){
        var taxo_ar =  Object.keys(taxo_dict)
        if (taxo_ar.length > 0){
            var p_ul        = this.createDOM("ul", {}, parentElm);
            var t_this = this;
            taxo_ar.forEach(function(value, index){
                var p_li    = t_this.createDOM("li",{id:"1_prfl_"+value[0], taxo_id:index, class:"cs_div_section_user_master_li",txt:value}, p_ul);
                //p_li.onclick = function(event) {
                var e = 'event'
                t_this.select_taxonomy(p_li, e);
                //}
                var new_taxo_dict = taxo_dict[value] || {};
                t_this.create_taxo_tree(new_taxo_dict, p_li);
            });
        }
    }
    this.create_taxo_tree_new = function(taxo_dict, parentElm){
        var taxo_ar =  Object.keys(taxo_dict)
        if (taxo_ar.length > 0){
            var p_ul        = this.createDOM("ul", {}, parentElm);
            var t_this = this;
            var el_t = [];
            taxo_ar.forEach(function(value, index){
                var p_li;
                var new_taxo_dict = taxo_dict[value] || {};
                var taxo_ar_new =  Object.keys(new_taxo_dict)
                if (taxo_ar_new.length > 0){
                    p_li    = t_this.createDOM("li",{taxo_id:index, taxo_name:value, txt:'<a>'+value+'+</a>'}, p_ul);
                }else{
                    p_li    = t_this.createDOM("li",{taxo_id:index, taxo_name:value, txt:'<a>'+value+'</a>'}, p_ul);
                }
                el_t.push(p_li);
                inx = el_t.length - 1;
                el_t[inx].onclick = function(event) {
                    var e = 'event'
                    t_this.select_taxonomy(p_li, e);
                }
                t_this.create_taxo_tree_new(new_taxo_dict, p_li);
            });
        }
        if (!this.taxo_name){
            this.doc.getElementById('profile_disp_div').innerHTML = 'GP Elm';
            this.taxo_name = 'GP Elm'
        }
        
    }
    masterEventHandler = function(event){
        let p_li = event.currenTarget;
        select_taxonomy(p_li, event);
    }
    
    this.show_taxonomy_tree = function(taxo_dict){
	    var mdiv 	    = this.doc.getElementById(this.vdiv_id);
        if (mdiv){
            var Prfl_cat 	= this.doc.getElementById('profile_cat_div') || this.createDOM("div",{id:"profile_cat_div", class:"cs_prfl_cate_div", style:"display:none"}, mdiv);
            Prfl_cat.innerHTML = '';
            this.create_taxo_tree(taxo_dict, Prfl_cat);
        }
    }
    this.show_taxonomy_tree_new = function(taxo_dict){
	    var mdiv 	    = this.doc.getElementById(this.vdiv_id);
        if (mdiv){
            var Prfl_cat 	= this.doc.getElementById('profile_cat_div') || this.createDOM("div",{id:"profile_cat_div", class:"cs_prfl_cate_div", style:"display:none"}, mdiv);
            Prfl_cat.innerHTML = '';
            var nav        = this.createDOM("nav", {'class':'vertical'}, Prfl_cat);
            this.create_taxo_tree_new(taxo_dict, nav);
        }
    }
}).apply(Canvas.prototype);
