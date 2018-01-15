var jQuery = require('jquery');
var $ = jQuery;
require('jquery-ui-browserify');

require('masonry.js');
require('materialize-css');

$.widget('crowdcurio.FormInterface', {
    
    options: {
        apiClient: undefined,
         config:{}
    },
    
    _create: function() {
        
        var that = this;
        
        // 1. initialize the config
        this.options.config = window.config;

        // 1.5. make sure we have a mode set
        this.options.config.mode = this.options.config.mode || 'static'; // default to static


        // 2. render the base HTML containers
        
        that._createStaticHTMLContainers();
        

        $("#loading_modal").modal({dismissible: false});
        $("#loading_modal").modal('open'); 

        // 3. init the api client
        var apiClient = that._getApiClient();lib
        apiClient.init({
            user: window.user,
            task: window.task,
            experiment: window.experiment,
            condition: window.condition
        });

        // 4. fetch the next task
        apiClient.getNextTask('required', function(data) {
            if(Object.keys(data).length === 0 && data.constructor === Object){
                // we're done!
                // transition to the next step of the experiment
                incrementExperimentWorkflowIndex(csrftoken, window.user, window.experiment);
            } else {
                apiClient.setData(data['id']);
                
                that._renderStaticDesign(data);
                

                // attach the submit button handlers
                $(".submit-btn").click(function(e){
                    that._submitResponse(e);
                });

                // close the modal
                $("#loading_modal").modal('close'); 
            }
        });
    },
    
    _getApiClient: function() {
        var that = this;
        return that.options.apiClient;
    },
    
    _createStaticHTMLContainers: function() {
        var that = this;
        var content= ' \
<div id="d4o-container" > \
    <div id="side-nav" > \
    </div> \
    <div id="submit-a-dive" > \
        <form id="submit-a-dive"> \
            <div id="dive-site"></div> \
            <div id="dive-shop"></div> \
            <div id="start-time"></div> \
            <div id="dive-time"></div> \
            <div id="device"></div> \
            <div id="water-temperature"></div> \
            <div id="air-temperature"></div> \
            <div id="comments"></div> \
        </form> \
    </div> \
    <div id="your-dives"> \
        \
    </div> \
</div> \
        ';
        
        $(that.element).html(content);
    },
    
    _renderStaticDesign: function(data) {
        
        var that = this;
        
        // make the Dive site dropdown
        var arr = [
            {val : "", text: 'Dive Site'},
            {val : 1, text: 'Keauhou, Kona, Hawaii (19 deg 33\'30.2" N , -155 deg 57\'59.6" W)'},
            {val : 2, text: 'Ho\'ona Bay, Kona, Hawaii (19 deg 44\'10.8" , -156 deg 03\'14.0"'},
            {val : 3, text: 'IUI Marine station, Eilat, Israel (29 deg 30\'07.9" N , 34 deg 54\'60.0" E)'},
            {val : 4, text: 'Folly Cove, Cape Ann, MA USA (42°41′5.967″N, 70°38′31.292″W)'},
            {val : 5, text: 'Cathedral Rocks, Cape Ann, MA USA (42°40′49.36″N, 70°37′22.04″W)'},
            {val : 6, text: 'Wreck of the Chester Poling, Cape Ann, MA USA (42 deg 34\'25.0" N, 70 deg 40\' 12.0" W)'}
        ];
        var sel = $('<select>').appendTo("#dive-site");
        sel.attr('id',"dive-site-form")
        $(arr).each(function() {
            sel.append($("<option>").attr('value',this.val).text(this.text));
        });
        
        // Make the Dive shop input field
        $("#dive-shop").append('<input type="text" id="dive-shop-form">');
        
        // Start date
        $("#start-time").append('<input type="datetime-local" id="start-time-form" value="YYYY-MM-DDTHH:MM:SS">');
        
        // dive-time
        $("#dive-time").append('<input type="time" id="dive-time-form" value="HH:MM:SS">');
        
        // Device
        var arr = [
            {val : "", text: 'Device'},
            {val : 1, text: 'Mares'},
            {val : 2, text: 'Oceanic'},
            {val : 3, text: 'Suunto'},
            {val : 4, text: 'Sheerwater'},
            {val : 5, text: 'TUSA'},
            {val : 6, text: 'Sherwood'},
            {val : 7, text: 'Scubapro'},
            {val : 8, text: 'Aeris'},
            {val : 9, text: 'Cressi'}
        ]
        
        var dev = [
            [ // Mares
                {val : 1, text: 'Matrix'},
                {val : 2, text: 'Puck Pro'},
                {val : 3, text: 'Nemo'},
                {val : 4, text: 'Icon'},
                {val : 5, text: 'Puck Air'},
                {val : 6, text: 'Puck 2'},
                {val : 7, text: 'Puck 3'}
            ],
            [ // Oceanic
                {val : 1, text: 'VTX'},
                {val : 2, text: 'Oci'},
                {val : 3, text: 'ProPlus 3'},
                {val : 4, text: 'OCL'},
                {val : 5, text: 'F.11'},
                {val : 6, text: 'Atom 3.1'},
                {val : 7, text: 'VEO 3.0'},
                {val : 8, text: 'F.10'},
                {val : 9, text: 'Geo 2.0'},
                {val : 10, text: 'Veo 2.0'},
                {val : 11, text: 'Veo 1.0'},
                {val : 12, text: 'B.U.D'},
                {val : 13, text: 'VersaPro'},
                {val : 14, text: 'DataMask'}
            ],
            [ // Suunto
                {val : 1, text: 'DX'},
                {val : 2, text: 'D6I'},
                {val : 3, text: 'D4I'}
            ],
            [ // Sheerwater
                {val : 1, text: 'Perdix'},
                {val : 2, text: 'Petrel'},
                {val : 3, text: 'Petrel 2'},
                {val : 4, text: 'NERD'}
            ],
            [ // TUSA
                {val : 1, text: 'IQ-1201 Talis'},
                {val : 2, text: 'IQ-950 Zen Air'},
                {val : 3, text: 'IQ-750 Element II'},
                {val : 4, text: '650 Element'},
                {val : 5, text: 'SCA-281'},
                {val : 6, text: 'SCA-361'},
                {val : 7, text: 'SCA-362'},
                {val : 8, text: 'SCA-282'},
                {val : 9, text: 'SCA-360'},
                {val : 10, text: 'SCA-270'},
                {val : 11, text: 'SCA-280'},
                {val : 12, text: 'SCA-230T'},
                {val : 13, text: 'SCA-330T'},
                {val : 14, text: 'SCA-150'},
                {val : 15, text: 'SCA-110T'}
            ],
            [ // Sherwood
                {val : 1, text: 'Amphos'},
                {val : 2, text: 'Amphos Air'},
                {val : 3, text: 'Wisdom3'},
                {val : 4, text: 'Profile'},
                {val : 5, text: 'Insight'},
                {val : 6, text: 'Vision'}
            ],
            [ // Scubapro
                {val : 1, text: 'Galileo Sol'},
                {val : 2, text: 'Galileo Luna'},
                {val : 3, text: 'Mantis 1'},
                {val : 4, text: 'Chromis'}
            ],
            [ // Aeris
                {val : 1, text: 'A300 CS OLED'},
                {val : 2, text: 'A300 ai'},
                {val : 3, text: 'F.11'},
                {val : 4, text: 'Atmos ai'},
                {val : 5, text: 'A300 XT'},
                {val : 6, text: 'F.10 v2'},
                {val : 7, text: 'Manta'},
                {val : 8, text: 'A 100'},
                {val : 9, text: 'A 300'}
            ],
            [ // Cressi
                {val : 1, text: 'Newton'},
                {val : 2, text: 'Giotto'},
                {val : 3, text: 'Giotto Console 2'},
                {val : 4, text: 'Giotto Console 3'},
                {val : 5, text: 'Leonardo'},
                {val : 6, text: 'Leonardo Console 2'},
                {val : 7, text: 'Leonardo Console 3'},
                {val : 8, text: 'Console CP2'},
                {val : 9, text: 'Console PD2'}
            ],
        ]
            
        var sel = $("<select>").appendTo("#device");
        sel.attr('id',"device-form")
        sel.append($("<option>").attr('value',this.val).text(this.text));
        $(arr).each(function() {
            var optg = sel.append($("<optgroup>").attr('label',this.text));
            $(dev).each(function() {
                optg.append($("<option>").attr('value',this.text).text(this.text));
            });
        });
        
        // water-temperature
        // how do I even
        $("#water-temperature").append('Work in Progress');
        
        
        // air-temperature
        $("#air-temperature").append('<input id="air-temperature-form" type="number">');
        
        // comments
        $("#comments").append('<textarea id="comments-form" rows="5" cols="80">');

    }
});
