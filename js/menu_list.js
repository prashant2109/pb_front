var menu_list = [
                {'n': 'Source Setup - Isolated Web Crawling, Monitoring & Extraction', 'full_name': 'Source Setup - Isolated Web Crawling, Monitoring & Extraction', 'k': 'crawling_monitoring', 'fa_icon': 'fa-television', 'submenu': [], 'visible': {'39': true, 'FE': true, '40': false,'new':true},'doc_view':false, 'active': 'Y'},
                {'n': 'OCR Correction', 'k': 'ocr','doc_view':true, 'full_name':'OCR Correction', 'fa_icon': 'fa-language','submenu': [], 'visible': {"OCR":true,'new':true}, 'active': 'Y'},
                {'n': 'Raw Data - Exhaustive Info-Units', 'full_name':'Raw Data - Exhaustive Info-Units', 'k': 'exha_data','doc_view':true, 'fa_icon': 'fa-table', 'visible': {'39': true, 'FE': true, '40': true,'new':true}, 'active': 'Y', 'submenu': [
                        {'n': 'Auto-ToC - Table of Contents', 'k': 'toc', 'submenu': [],'doc_view':true, 'visible': {'39': true, '40': true,'new':true}, 'active': 'Y'},
                        {'n': 'Table Analysis', 'k': 'table_analys', 'submenu': [
				{'n': 'All Tables', 'k': 'all_tables', 'submenu': [],'doc_view':false, 'visible': {'39': true, '40': true,'new':true}, 'active': 'Y'},
				{'n': 'Foot Notes', 'k': 'foot_notes', 'submenu': [],'doc_view':false, 'visible': {'39': true, '40': true,'new':true}, 'active': 'Y'}
			],'doc_view':true ,'visible': {'39': true, '40': true,'new':true}, 'active': 'Y'},
			{'n': 'Text to Table', 'k': 'text_to_table','doc_view':true ,  'submenu': [
				{'n': 'Sentences - table description', 'k': 'sen_table_desc', 'submenu': [],'doc_view':false, 'visible': {'39': true, '40': true,'new':true}, 'active': 'Y'},
				{'n': 'Sentences - additional', 'k': 'sen_addit', 'submenu': [],'doc_view':false, 'visible': {'39': true, '40': true,'new':true}, 'active': 'Y'},
                                {'n': 'Other text to table', 'k': 'other_txt_t_tble', 'submenu': [],'doc_view':false, 'visible': {'39': true, '40': true,'new':true}, 'active': 'Y'}
			], 'visible': {'39': true, 'FE': true, '40': true,'new':true}, 'active': 'N'},
                ]},
                {'n': 'Data Wrangling', 'full_name':'Data Wrangling', 'k': 'data_wrangling','doc_view':true ,'fa_icon': 'fa-delicious', 'active': 'N', 'submenu': [
			{'n': 'Text to Columns', 'k': 'text_to_columns','doc_view':true ,  'submenu': [], 'visible': {'39': true, 'FE': true, '40': true,'new':true}, 'active': 'N'},
			{'n': 'Data Cleanup', 'k': 'data_cleanup','doc_view':true ,'submenu': [], 'visible': {'39': true, 'FE': true, '40': true,'new':true}, 'active': 'N'},
			{'n': 'Data Mapping', 'k': 'data_mapping','doc_view':true,'submenu': [], 'visible': {'39': true, 'FE': true, '40': true,'new':true}, 'active': 'N'},
		], 'visible': {'39': true, '40': true,'new':true}},
                {'n': 'Pre-Taxonomy Analytics', 'full_name':'Pre-Taxonomy Analytics', 'k': 'pre_taxo', 'fa_icon': 'fa-cubes', 'submenu': [], 'visible': {'39': true, '40': true,'new':true}, 'active': 'Y'},
                {'n': 'Taxonomy and Linkbase Builder', 'full_name':'Taxonomy and Linkbase Builder', 'k': 'taxonomy_link', 'fa_icon': 'fa-code-fork','submenu': [
			{'n': 'Pre-set Taxonomies', 'k': 'pre_set_taxo','doc_view':true,'submenu': [], 'visible': {'39': true, 'FE': true, '40': true,'new':true}, 'active': 'N'},
		], 'visible': {'39': true, '40': true,'new':true}, 'active': 'Y'},
		{'n': 'Enterprise Data Models', 'k': 'data_models', 'fa_icon': 'fa-hdd-o', 'submenu': [], 'visible': {'39': true, 'FE': true,'40': true,'new':true}, 'active': 'Y'},
                {'n': 'Workflow/Process Automation Templates', 'full_name':'Workflow/Process Automation Templates', 'k': 'output_conf', 'fa_icon': 'fa-cogs', 'submenu': [], 'visible': {'39': true, 'FE': true,'40': true,'new':true}, 'active': 'Y'},
                {'n': 'SLT - Surface Level Training', 'full_name':'SLT - Surface Level Training', 'k': 'slt', 'fa_icon': 'fa-trello', 'submenu': [],'doc_view':true, 'visible': {'39': true, '40': true,'new':true}, 'active': 'Y'},
                {'n': 'Data Builder & Review', 'full_name': 'Data Builder & Review','doc_view':false, 'k': 'data_builder_rca', 'fa_icon': 'fa-database', 'submenu': [], 'visible': {'39': true, '40': true,'new':true}, 'active': 'Y'},
                {'n': 'Output Templates/Models', 'full_name': 'Output Templates/Models', 'k': 'rca', 'fa_icon': 'fa-sellsy', 'visible': {'39': true,'FE':true, '40': true,'new':true}, 'active': 'N', 'submenu': [
                        {'n': 'Edit', 'k': 'edit_op_temp', 'submenu': [], 'visible': {'39': true,'FE':true, '40': true,'new':true}, 'active': 'Y'},
                        {'n': 'Review & Update', 'k': 'model_mapping_rca', 'submenu': [], 'visible': {'FE': true,'new':true}, 'active': 'Y'},
                        ]
                },
                {'n': 'Search & Navigate', 'full_name':'Search, Navigate, Generate Output', 'k': 'search', 'fa_icon': 'fa-tachometer', 'submenu': [], 'visible': {'39': true,'FE':true, '40': true,'new':true}, 'active': 'Y'},
                {'n': 'Output Viewer and Analytics', 'k': 'output', 'fa_icon': 'fa-area-chart','doc_view':true,'submenu': [], 'visible': {'39': true,'FE':true, '40': true,'new':true}, 'active': 'Y'},
	] 
