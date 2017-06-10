var menu = {
    create: function(){
                
        var the = this;        
                
        var set_race;
        
        var app = this.app; 
        var sizes = this.app._sizes_;
        var svg = this.app._svg_;
        
        var menu = document.getElementById('table_menu');
        var input_name = document.getElementById('input_name');
        
        var settings = {
            name: '',
            color: '',
            road: 0,
            sounds: true,
            call_menu: null,
        };
                
        var cookie;
                
        if (document.cookie !== ''){
            cookie = document.cookie.split(';');
        }
        
        if (cookie === undefined){
            set_race = Math.floor(Math.random() * 3); 
        } else {
            set_race = +cookie[0];
        }

        set_choise_races(set_race);
        
        if (cookie !== undefined){
            if (cookie[1]){
                input_name.value = cookie[1];                                
            }
        }
        
        get_maps();
        
        set_cliks();
            
        menu.style.display = 'block';
        menu.style.left = (sizes.w - menu.clientWidth) / 2;
        menu.style.top = (sizes.h - menu.clientHeight) / 2;
        
        settings.call_menu = function(){
            menu.style.display = 'block';
            menu.style.left = (sizes.w - menu.clientWidth) / 2;
            menu.style.top = (sizes.h - menu.clientHeight) / 2;
            the.app.setState(ENGINE.menu);
        };
        
        function set_cliks(){
            var i;
            var imgs = menu.getElementsByClassName('img_racer');
            var maps = menu.getElementsByClassName('table_maps');
            var botton_sound = document.getElementById('button_sounds');
            var botton_start = document.getElementById('button_start');
            
            for (i = 0; i < imgs.length; i++){
                imgs[i].onclick = (function(){
                    
                    var num = i;
                    
                    return function(){
                        set_choise_races(num);
                    };
                }())
            }
            
            for (i = 0; i < maps.length; i++){
                maps[i].onclick = (function(){
                
                    var num = i;
                    
                    return function(){
                        set_choise_maps(num);    
                    };
                }());
            }
            
            botton_sound.onclick = function(){
                if (settings.sounds){
                    settings.sounds = false;
                    botton_sound.value = 'Звук вкл!'
                } else {
                    settings.sounds = true;
                    botton_sound.value = 'Звук выкл.'
                }           
            };
            
            botton_start.onclick = function (){
                start_game();
            };
            
        }
        
        function start_game(){
        
            document.cookie = '' + set_race + ';' + settings.name;
            the.app._settings_ = settings;
            menu.style.display = 'none';

            the.step = function(){
             
                the.step = null;
                                
                if (the.app._gm_){
                    the.app._gm_.restart();
                }
                
                the.app.setState(ENGINE.main);
            }
        }
        
        function set_choise_maps(num){
            var i;
            var maps = menu.getElementsByClassName('table_maps');
            
            for (i = 0; i < maps.length; i++){
                maps[i].className = 'table_maps';
                
                if (i == num){
                    maps[i].className += ' table_maps_choise';
                    settings.road = i;
                }
            }
        }
        
        function get_human_time(time){
            var sec;
            var min;
                        
            sec = time / 1000;
            min = Math.floor(sec / 60);
            sec = Math.floor(sec - min * 60);
            
            return '' + min + ':' + sec;
            
        }
        
        function get_maps(){
            
            var i, j, count;
            var one_map;
            var tr_1_in_dom, tr_2_in_dom;
            var tr_1, tr_2;
            
            
            var collection = document.getElementById('td_maps_collection');
            
            var one_map_in_dom = document.getElementsByClassName('table_maps')[0];
            var tr_1_in_dom = one_map_in_dom.getElementsByTagName('tr')[0];
            var tr_2_in_dom = one_map_in_dom.getElementsByTagName('tr')[1];
            
                        
            var name;
            var show_races;
            
            for(i = 0; i < roads.length; i++){
                                
                one_map = one_map_in_dom.cloneNode();
                
                if (i == settings.road){
                    one_map.className = 'table_maps table_maps_choise';
                }
                
                for(count = 0; count < one_map_in_dom.getElementsByTagName('tr').length; count++){
                    one_map.appendChild(one_map_in_dom.getElementsByTagName('tr')[count].cloneNode());
                }
                            
                tr_1 = one_map.getElementsByTagName('tr')[0];
                
                for(count = 0; count < tr_1_in_dom.getElementsByTagName('td').length; count++){
                    tr_1.appendChild(tr_1_in_dom.getElementsByTagName('td')[count].cloneNode());
                }
                
                tr_2 = one_map.getElementsByTagName('tr')[1];
                
                for (count = 0; count < tr_2_in_dom.getElementsByTagName('td').length; count++){
                    tr_2.appendChild(tr_2_in_dom.getElementsByTagName('td')[count].cloneNode());
                }
                
                name = roads[i].name;
                
                show_races = [];
                                
                for (j = 0; j < races.length; j++){
                    if (races[j].road == i){
                        show_races.push({
                            milli: races[j].milliseconds,
                            time: get_human_time(races[j].milliseconds),
                            name: races[j].name,
                        });
                    }
                }
                                
                tr_1.getElementsByTagName('td')[0].innerHTML += name;
                
                if (show_races.length > 1){
                    if (show_races[0].milli > show_races[1].milli){
                        tr_1.getElementsByTagName('td')[1].innerHTML += show_races[0].name + ' ' + show_races[0].time;
                        tr_2.getElementsByTagName('td')[0].innerHTML += show_races[1].name + ' ' + show_races[1].time;
                    } else {
                        tr_1.getElementsByTagName('td')[1].innerHTML += show_races[1].name + ' ' + show_races[1].time;
                        tr_2.getElementsByTagName('td')[0].innerHTML += show_races[0].name + ' ' + show_races[0].time;                
                    }
                }
                
                one_map.style.display = 'block';
                collection.appendChild(one_map);

            }
            
        }
        
        function set_choise_races(color){
            var i,j;
            var img_races = menu.getElementsByClassName('img_racer');
            var name;
            var value;
            var names = [
                'Синий гонщик',
                'Красный гонщик',
                'Зеленый гонщик',
            ];
            
            for(i = 0; i < img_races.length; i++){
                img_races[i].className = 'img_racer';
            }
            
            switch(color){
                case 0:
                    settings.color = '66D';
                    img_races[0].className += ' img_racer_choise'; 
                    name = names[0];
                    set_race = 0;
                break;
                case 1:
                    settings.color = 'D55';
                    img_races[1].className += ' img_racer_choise'; 
                    name = names[1];
                    set_race = 1;
                break;
                case 2:
                    settings.color = '6D6';
                    img_races[2].className += ' img_racer_choise'; 
                    name = names[2];
                    set_race = 2;
                break;
            }
            
            value = input_name.value;
            
            if (value == names[0] || value == names[1] || value == names[2] || value == ''){
                input_name.value = name;
                settings.name = name;
            }
        }
     },
};
