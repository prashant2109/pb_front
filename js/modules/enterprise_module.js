"use strict";
var app = angular.module("tas.enterprise",[]);
app.controller("Enterprise",function($http, $scope, $timeout, tasAlert, tasService){
	$scope.Object = Object;
	$scope.config.scope = $scope;
	/******************************************/
	$scope.enterprise_data = function(){
		var file = "Datamodel_" + $scope.config.parent_scope.slcted_indus_dic["project_name"] + ".xlsx";
		var data = {c_flag: $scope.config.cmd_dict['getEtp'], name: file};
		var post_data = {cmd_id: 35, "project_id": $scope.config.parent_scope.slcted_indus_dic["project_id"]};
		$scope.config.parent_scope.ps = true;
		tasService.ajax_request(post_data, 'POST', $scope.cb_enterprise_data); 
	}
	/******************************************/
	$scope.cb_enterprise_data = function(res){
		$scope.config.parent_scope.ps = false;
		if(res["message"] == "done"){
			var data = res["data"];
			data[1].forEach(function(r){
				r["dash"] = [12,6]
			});
			$scope.legends = res["levels"];
			try{
				myDiagram.div = null;
				myOverview.div = null;
			}
			catch(err){
			}
			var id = "myDiagramDiv";
			var ovid = "myOverviewDiv";
			$scope.tree(data,id,ovid);	
		}else{
			tasAlert.show(res['message'], 'error', 1000);
		}
	}
	/******************************************/
	var myDiagram;
	var  myOverview;
	/******************************************/
	
	$scope.tree = function(data,div_el,overview_id){
		var nodeDataArray = data[0]
		var linkDataArray = data[1]
		//if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
		var $ = go.GraphObject.make; // for conciseness in defining templates
	try{
	myDiagram =
		$(go.Diagram,div_el, {
			allowCopy: false,
			contentAlignment: go.Spot.Center,
			initialDocumentSpot: go.Spot.Top,
                        initialViewportSpot: go.Spot.Center,
			/*"draggingTool.dragsTree": true,
			"commandHandler.deletesTree": true,*/
			layout: $(go.TreeLayout, {
				angle: 90,
				layerSpacing: 80,
				alternateAngle: 0,
				alternateAlignment: go.TreeLayout.AlignmentStart,
				alternateNodeIndent: 20,
				alternateNodeIndentPastParent: 1,
				alternateNodeSpacing: 20,
				alternateLayerSpacing: 40,
				alternateLayerSpacingParentOverlap: 1,
				//alternatePortSpot: new go.Spot(0.001, 1, 20, 0),
				alternateChildPortSpot: go.Spot.Center
			}),
			"undoManager.isEnabled": true,
			//MOUSE DROP AND MOVALBE DIAGRAM
			 mouseDrop: function (e) { e.diagram.currentTool.doCancel(); },
                    	 autoScrollRegion: 0,
                         "panningTool.isEnabled": false,
                  	 'dragSelectingTool.isEnabled': false 
		});
	}catch(e){
		var d = $(go.GraphLinksModel, {
			nodeDataArray: nodeDataArray,
			linkDataArray: linkDataArray
		});
	 	myDiagram.model = go.Model.fromJson(d);
	}
	 //myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
	// when the document is modified, add a "*" to the title and enable the "Save" button
	myDiagram.addDiagramListener("Modified", function(e) {
		var button = document.getElementById("SaveButton");
		if (button) button.disabled = !myDiagram.isModified;
		var idx = document.title.indexOf("*");
		if (myDiagram.isModified) {
			if (idx < 0) document.title += "*";
		} else {
			if (idx >= 0) document.title = document.title.substr(0, idx);
		}
	});

	var bluegrad = $(go.Brush, "Linear", {
		0: "#C4ECFF",
		1: "#70D4FF"
	});
	var greengrad = $(go.Brush, "Linear", {
		0: "#B1E2A5",
		1: "#7AE060"
	});
	function open_link(link){
		//console.log(link)
	}
	function collapseFrom(node, start) {
	  if (node.data.isCollapsed) return;
	  node.diagram.model.setDataProperty(node.data, "isCollapsed", true);
	  if (node !== start) node.visible = false;
	  node.findNodesOutOf().each(collapseFrom);
	}
	function expandFrom(node, start) {
	  if (!node.data.isCollapsed) return;
	  node.diagram.model.setDataProperty(node.data, "isCollapsed", false);
	  if (node !== start) node.visible = true;
	  node.findNodesOutOf().each(expandFrom);
	}

	var color_map_d	 ={'1'	: '#DEFDE0','2'	: '#DEF3FD','3'	: '#F0DEFD','4'	: '#F0DEFD',}
	//var color_map_d	 ={'1'	: '#DEFDE0','2'	: '#FCF7DE','3'	: '#DEF3FD','4'	: '#F0DEFD',}
	// each action is represented by a shape and some text
	var actionTemplate =
		$(go.Panel, "Horizontal",
			$(go.TextBlock, {
					font: "10pt 'Roboto', sans-serif",
					cursor: "pointer",
					//width:'400',
					//height:'25',
					textAlign: "left",
					margin: new go.Margin(5, 10, 5, 10),
					verticalAlignment: go.Spot.Center,
					
				},
				 new go.Binding("fill", "color_base" ,function(){
                                                                 //console.log(arguments)
                                                                if(arguments[0] in color_map_d)
                                                                        return color_map_d[arguments[0]];
                                                                else
                                                                        return '#0c5684';
                                                        }),
				new go.Binding("text")

			),
			/*$(go.Shape, "Circle", {
					width: 12,
					height: 12,
				},
				new go.Binding("figure"),
				new go.Binding("stroke",'color_code'),
				 new go.Binding("fill", "color_base" ,function(){
                                                                 //console.log(arguments)
                                                                if(arguments[0] in color_map_d)
                                                                        return color_map_d[arguments[0]];
                                                                else
                                                                        return '#0c5684';
                                                        })

			)/*$(go.Picture, { source: "icons/green_button1.png", width: 11, height: 11}),*/
			 //"icons/if_companies_44817.png"
		);
	// each regular Node has body consisting of a title followed by a collapsible list of actions,
	// controlled by a PanelExpanderButton, with a TreeExpanderButton underneath the body
	myDiagram.nodeTemplate = // the default node template
		$(go.Node, "Vertical", {
				selectionObjectName: "BODY",
				deletable: false,
                                //isTreeExpanded: false,
				/*linkConnected:function(node){
					go.Node.isTreeExpanded = false;
				}*/
                                treeExpandedChanged:function(node){
					//console.log(node,node.data.isCollapsed)
				}
			}, new go.Binding("isTreeExpanded", "collaps_tree" ,function(){
                                                                if(arguments[0]== "Y")
                                                                        return true;
                                                                else
                                                                        return false;
                                                        }),/*new go.Binding("isTreeExpanded", "question",function(){
				/*if(arguments[0] == 'Public Companies' || arguments[0] == 'Valuation')
					return true;
				else
					return false
			}),*/
			// the main "BODY" consists of a RoundedRectangle surrounding nested Panels
			$(go.Panel, "Auto", {
					name: "BODY"
				},
				$(go.Shape, "RoundedRectangle", {
					stroke: null,
					//fill: function(h){ /*return color_map_d[d] */},
				},

					new go.Binding("fill", "level" ,function(){
                                                                 //console.log(arguments)
                                                                if(arguments[0] in color_map_d){
                                                                        return color_map_d[arguments[0]];
								}
								else 
									return '#0c5684';
                                                        })
				
				),
				$(go.Panel, "Vertical", {
					},
					$(go.TextBlock, {
							//stretch: go.GraphObject.Horizontal,
							font: "bold 12pt 'Roboto', sans-serif",
							cursor:'pointer',
							stroke: 'black',
							isMultiline: true,
							//width:150,
							margin:5,
							verticalAlignment: go.Spot.Center,
						},
						new go.Binding("text", "question" ,function(){
								return arguments[0]
                                                        }), {
							toolTip: // define a tooltip for each node that displays the color as text
								$(go.Adornment, "Auto",
									$(go.Shape, {
										fill: "#FFFFCC"
									}),
									$(go.TextBlock, {
											margin: 2
										},
										new go.Binding("text", "question"))
								) // end of Adornment
						}
					),
					// the optional list of actions
					$(go.Panel, "Vertical", {
							stretch: go.GraphObject.Horizontal,
							visible: false
						}, // not visible unless there is more than one action
					new go.Binding("background", "form_type" ,function(){
                                                                 //console.log(arguments,'place')
                                                                if(arguments[0] in color_map_d)
                                                                        return color_map_d[arguments[0]];
								else 
									return '#0c5684';
                                                        }),
					
						new go.Binding("visible", "action", function(acts) {
							return (Array.isArray(acts) && acts.length > 0);
						}),
						$(go.Panel, "Table", {
								stretch: go.GraphObject.Horizontal,
								 /*background:'white',*/
							},
							$(go.TextBlock,{
								alignment: go.Spot.Left,
								font: "10pt 'Roboto', sans-serif",
								/*stroke : 'black',*/
							},new go.Binding("text", "form_type"),
								
					new go.Binding("fill", "form_type" ,function(){
                                                                if(arguments[0] in color_map_d)
                                                                        return color_map_d[arguments[0]];
								else 
									return '#0c5684';
                                                        })
	
							),
							$("PanelExpanderButton", "COLLAPSIBLE", // name of the object to make visible or invisible
								{
									column: 2,
									alignment: go.Spot.Right
								}
							),


									
					new go.Binding("background", "form_type" ,function(){
                                                                 //console.log(arguments)
                                                                if(arguments[0] in color_map_d)
                                                                        return color_map_d[arguments[0]];
								else 
									return '#0c5684';
                                                        })

						), // end Table panel
						// with the list data bound in the Vertical Panel
						$(go.Panel, "Vertical", {
								name: "COLLAPSIBLE", // identify to the PanelExpanderButton
								padding: 2,
								stretch: go.GraphObject.Horizontal, // take up whole available width
								background: "white", // to distinguish from the node's body
								defaultAlignment: go.Spot.Left, // thus no need to specify alignment on each element
								itemTemplate: actionTemplate // the Panel created for each item in Panel.itemArray
							},
							new go.Binding("itemArray", "action") // bind Panel.itemArray to nodedata.actions
						) // end action list Vertical Panel
					), // end optional Vertical Panel
					new go.Binding("background", "form_type" ,function(){
                                                                 //console.log(arguments)
                                                                if(arguments[0] in color_map_d)
                                                                        return color_map_d[arguments[0]];
								else 
									return '#0c5684';
                                                        })
					
				), // end outer Vertical Panel
				
					new go.Binding("background", "form_type" ,function(){
                                                                 //console.log(arguments)
                                                                if(arguments[0] in color_map_d)
                                                                        return color_map_d[arguments[0]];
								else 
									return '#0c5684';
                                                        })
			), // end "BODY"  Auto Panel
			$(go.Panel, // this is underneath the "BODY"
				{
					height: 15,
				}, // always this height, even if the TreeExpanderButton is not visible
				$("TreeExpanderButton")
			),
				 new go.Binding("background", "text" ,function(){
                                                                //console.log(arguments)
                                                                if(arguments[0] in color_map_d)
                                                                        return color_map_d[arguments[0]];
                                                                else
                                                                        return '#0c5684';
                                                        })
		);

	// define a second kind of Node:	
	myDiagram.nodeTemplateMap.add("Terminal",
		$(go.Node,"Spot",{
				deletable: false,
				isTreeExpanded:true,
			},
			new go.Binding("isTreeExpanded", "collaps_tree" ,function(){
                                                                 //console.log(arguments,'final_data')
                                                                if(arguments[0]== "Y")
                                                                        return true;
                                                                else
                                                                        return false;
                                                        })
		
			,
			$(go.TextBlock, {
					font: "9pt Segoe UI,Frutiger,Frutiger Linotype,Dejavu Sans,Helvetica Neue,Arial,sans-serif",
					stroke:'black',
					cursor:'pointer',
					textAlign :'center',
					position: new go.Point(24,25),
				click: function(e,obj) {
					//console.log("hi",obj.panel.Yd);
					if( obj.panel.Yd.href)
						window.open( obj.panel.Yd.href)
				}
				},
				new go.Binding("text",'text'),
			new go.Binding("isTreeExpanded", "collaps_tree" ,function(){
                                                                 //console.log(arguments,'final_data')
                                                                if(arguments[0]== "Y")
                                                                        return true;
                                                                else
                                                                        return false;
                          })
			)
		),
	 new go.Binding("background", "color_base" ,function(){
                                                                 //console.log(arguments)
                                                                if(arguments[0] in color_map_d)
                                                                        return color_map_d[arguments[0]];
                                                                else
                                                                        return '#0c5684';
                                                        }),
                        $(go.Panel, // this is underneath the "BODY"
                                {
                                        //alignment: go.Spot.Right,
                                        height: 15
                                }, // always this height, even if the TreeExpanderButton is not visible
                                $("TreeExpanderButton")
                        )

	);

	myDiagram.linkTemplate =
		$(go.Link, go.Link.Orthogonal, {
				deletable: false,
				corner: 10
			},
			$(go.Shape, {
				strokeWidth: 1,
				toArrow: "Standard",
				stroke:'#959595',fill:'#959595',
			}, new go.Binding("strokeDashArray", "dash")),
				/*$(go.TextBlock,                        // this is a Link label
					{
						stroke:'white',font: "10pt Segoe UI,Frutiger,Frutiger Linotype,Dejavu Sans,Helvetica Neue,Arial,sans-serif"
					},
        				new go.Binding("text", "answer")
				)*/
			$(go.TextBlock, 
	
					go.Link.OrientUpright, {
					background: "white",
					visible: false, // unless the binding sets it to true for a non-empty string
					segmentIndex: -3,
					segmentOrientation: go.Link.None,
					
				},
				new go.Binding("text", "answer"),
				// hide empty string;
				// if the "answer" property is undefined, visible is false due to above default setting
				new go.Binding("visible", "answer", function(a) {
					return (a ? true : false);
				})
			),
			$(go.Shape, { toArrow: "Standard" ,strokeWidth: 2,stroke:'#959595',fill:'#959595'})
		);

	
	myDiagram.model =
		$(go.GraphLinksModel, {
			nodeDataArray: nodeDataArray,
			linkDataArray: linkDataArray
		});
	 window.myDiagram        = myDiagram
	 	myOverview =
      			$(go.Overview, overview_id,  // the HTML DIV element for the Overview
        			{ observed: myDiagram, contentAlignment: go.Spot.Center });   // tell it which Diagram to show and pan
	}
	/******************************************/
	$scope.clsp_icon = "N";
	window.collapse_expand_tree = function(collapse){
		if(collapse.getAttribute('expand') == 'Y'){
			collapse.setAttribute('expand', 'N')
			myDiagram.findTreeRoots().each(function(r) {r.expandTree(5)})
			$scope.clsp_icon = "N";

		}else{
			collapse.setAttribute('expand', 'Y')
			myDiagram.findTreeRoots().each(function(r) {r.collapseTree(1)})
			$scope.clsp_icon = "Y";
		}
		$scope.$apply();
	}
	/******************************************/
	window.zoomDrag = function(opt){
		var slider = document.getElementById('zoomSliderRange');
		var x = parseFloat(slider.value);
		if(opt == 'plus'){
			x = x + 1;
		}else if(opt == 'minus'){
			x = x - 1;
		}
		else{
			 
		}
		var A = 1;
		var B = myDiagram.commandHandler.zoomFactor;
		var y1 = myDiagram.scale;
  		slider.value = x;
		myDiagram.scale = A * Math.pow(B, x);	
	}
	/******************************************/
	/******************************************/
});
app.directive('enterpriseData',function(){
	return {
		restrict: 'AE',
		template:`<div class="enps">
				<div id="myDiagramDiv"></div>
				<div id="myOverviewDiv"></div>
				<div class="digramlegend">
					<div class="legend_header">Legends
							<button class="btn btn-sm smbtn m-0 waves-effect" id="cllpse" onclick="collapse_expand_tree(this)" style="float: right;padding: 2px 7px !important; background: #3d4fc0;margin-top:2px !important;"  title="{{ clsp_icon=='N' ? 'Collapse' : 'Expanded'}}"><i class="fa" ng-class="{'fa-minus': clsp_icon == 'N','fa-plus': clsp_icon == 'Y'}" style="font-size: 14px;margin-top: 2px;"></i></button>
					</div>
					<div class="legend_body">
						<div class="lengend_list" ng-repeat="lg_list in legends">
							<span class="lgn_txt"> {{"Level " + lg_list}}</span>
							<span class="bg_clr level_{{lg_list}}"></span>
						</div>		
					</div>
				</div>
				<div class="zoomSlider" style="width: 25px; height: 100px;">
					<div id="zoomSliderIn" class="zoomButton waves-effect" style="width: 25px; height: 25px;" onclick="zoomDrag('plus')" title="Zoom In">
						<i class="fa fa-plus"></i>
					</div>
					<div id="zoomSliderRangeCtn" class="zoomRangeContainer" style="width: 25px; height: 50px;">
						<input id="zoomSliderRange" class="zoomRangeInput" type="range" min="-20" max="20" style="width: 50px; height: 25px; transform-origin: 25px 25px; transform: rotate(-90deg);" oninput="zoomDrag()">
					</div>
					<div id="zoomSliderOut" class="zoomButton waves-effect" style="width: 25px; height: 25px;" onclick="zoomDrag('minus')" title="Zoom Out">
						<i class="fa fa-minus"></i>
					</div>
				</div>		
			</div>
			<style>
				enterprise-data{width: 100%;height: 100%;overflow: hidden;}
				.enps{width: 100%;height: 100%;position: relative;}
				.enps #myDiagramDiv { width: 100%; height: 100%; }
				.enps #myOverviewDiv { position: absolute; width: 200px; height: 100px; background: #fff; top: 5px; left: 10px; z-index: 5; border: 1px solid rgb(221, 221, 221); -webkit-tap-highlight-color: rgba(255, 255, 255, 0); cursor: auto; }
				.enps .digramlegend{position: absolute; top: 5px; right: 15px; z-index: 2; user-select: none; width: 198px; height: 100px; cursor: auto;background: #fff;border: 1px solid #ddd; border-radius: 4px;}
				.enps .digramlegend .legend_header{padding: 0 3px 0 12px; font-weight: 500; font-size: 14px; color: #2443f1;border-bottom: 1px solid #e8e8e8;height: 28px;line-height: 28px;}
				.enps .digramlegend .legend_body{/*padding: 5px 10px;*/}
				.enps .bg_clr{padding: 2px 12px; border-radius: 2px; margin-left: 8px;}
				.enps .lengend_list{padding: 8px 12px;display: inline-block;}
				.enps .level_1{background: #DEFDE0;}
				.enps .level_2{background: #DEF3FD;}
				.enps .level_3{background: #F0DEFD;}
				.enps .level_4{background: #FCF7DE;}
				.enps .zoomSlider{position: absolute;z-index:2;right: 15px;bottom:15px;}
				.enps .zoomButton{line-height: 25px; padding: 0 7px; background: #aad3df;border-radius: 3px;cursor: pointer;box-shadow: 0 0.46875rem 2.1875rem rgba(4,9,20,0.03), 0 0.9375rem 1.40625rem rgba(4,9,20,0.03), 0 0.25rem 0.53125rem rgba(4,9,20,0.05), 0 0.125rem 0.1875rem rgba(4,9,20,0.03);
}
				.enps .zoomRangeInput { margin: 0; padding: 0; outline: none; transition: opacity .2s; background: transparent; -webkit-appearance: none; }
				.enps .zoomRangeInput::-webkit-slider-runnable-track { box-sizing: border-box; border: none; width: 100%; height: 3px; background: #607D8B; }
				.enps .zoomRangeInput::-moz-range-track { box-sizing: border-box; border: none; width: 100%; height: 3px; background: #ccc; }
				.enps .zoomRangeInput::-ms-track { box-sizing: border-box; border: none; width: 100%; height: 3px; background: #ccc; color: transparent; }
				.enps .zoomRangeInput::-webkit-slider-thumb { -webkit-appearance: none; margin-top: -5px; box-sizing: border-box; border: none; width: 13px; height: 13px; border-radius: 50%; background: #fff;border: 2px solid #607D8B; }
				.enps .zoomRangeInput::-moz-range-thumb { box-sizing: border-box; border: none; width: 10px; height: 10px; border-radius: 50%; background: #444; }
				.enps .zoomRangeInput::-ms-thumb { margin-top: 0; box-sizing: border-box; border: none; width: 10px; height: 10px; border-radius: 50%; background: #444; }
				.enps .zoomRangeInput::-ms-tooltip,
				.enps .zoomRangeInput::-ms-fill-lower,
				.enps .zoomRangeInput::-ms-fill-upper { display: none; }
				.enps .tree_clpse{float: right;color: #557ada; font-size: 19px;}
				.enps .zoomButton i{};
			<style>`,
		controller: 'Enterprise',
		scope: {
			'config': '='
		},
		link: function (scope, elm, attrs, controller) {

		},
	}
});
