agGrid.initialiseAgGridWithAngular1(angular);
var app = angular.module("app", ['dndLists', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.edit', 'ui.grid.treeView', 'ui.grid.resizeColumns', 'ui.grid.expandable', 'ui.grid.pagination', 'ui.grid.selection',  'ui.grid.autoResize', 'agGrid','ngSanitize','tas.reference','tas.upload','tas.source_setup','tas.schedule_module', 'tas.validation', 'informationUnits', 'tas.dbrca', 'tas.outputView', 'tas.enterprise', 'tas.configuration','tas.grid','tas.runApplicator','tas.csv_table','tas.textapplicator']);

$(function () {
	$('[data-toggle="tooltip"]').tooltip();
});
