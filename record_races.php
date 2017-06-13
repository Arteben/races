<?php
/*
var races = [];
        //road: 0,
        //time: 3913,
        //name: 'Green!',
        //color: '#5D5',
        //i: 371,
        //j: 200,
        //array: [
 
*/
/*
's': 29,
  'r': 2,
  'i': 258,
  'j': 91,
  'time': 1087,
  'frames': 20,
  'start_i': 270,
  'start_j': 132,
  */
  // record racer fly in db
  
  $path = 'data/races.json';
  
  $raw_sting = $HTTP_RAW_POST_DATA;
    
  $file = file_get_contents($path);
    
  $racer_take = json_decode($raw_sting, true);
  
  if (count($racer_take) > 0){
    
    $races_file = json_decode($file, true);
      
    if (count($races_file) > 0){
      
      if (isset($racer_take[count($racer_take) - 1]['time']) && 
                  isset($racer_take[count($racer_take) - 1]['road'])){
        $time_racer = (int) $racer_take[count($racer_take) - 1]['time'];
        $road_racer = (int) $racer_take[count($racer_take) - 1]['road'];
      } else {
        echo 'error 1!';
        die();
      }
            
      $races_for_road = array();
      $racer_from_file = array();
      $count = 0;
    
      foreach($races_file as $key => $racer_from_file){
        
        if ((int) $racer_from_file['road'] == $road_racer){
          
          $count++;
          
          $races_for_road []= $key;
          
          if ($count > 1){
            break;
          }
        }
      }
                
      $check_time = ( (!$races_for_road[0] || (int) $races_file[$races_for_road[0]]['time'] > $time_racer) ||
                  (!$races_for_road[1] || (int) $races_file[$races_for_road[1]]['time'] > $time_racer));
                   
      if ($check_time && $time_racer > 0){
        
        if (count($races_for_road) > 1){
          if ($races_file[$races_for_road[0]]['time'] < $races_file[$races_for_road[1]]['time']){
            unset($races_file[$races_for_road[1]]);
          } else {
            unset($races_file[$races_for_road[0]]);        
          }
        }
        
        record_racer($races_file, $racer_take, $path);        
      
      } else {
        echo 'error 2!';
        die();
      }
    } else {
    
      record_racer($races_file, $racer_take, $path);
    }
    
  } else {
    echo  'error 3!';
    die();  
  }

function record_racer($json, $racer, $p){
    
    $array_racer = array();
    
    $data_racer = array();
    
    $data_racer = $racer[count($racer) - 1];
     
    $array_racer['array'] = array();
    
    $fly = array();
    
    foreach($racer as $fly){
      $array_racer['array'] []= $fly;
    }    
    
    //echo 'what is it? '.data_racer[0];
    
    $array_racer['color'] = $data_racer['color'];
    $array_racer ['name'] = $data_racer['name'];
    $array_racer ['human_time'] =  $data_racer['human_time'];

    $array_racer ['road'] = (int) $data_racer['road'];
    $array_racer ['time'] = (int) $data_racer['time'];
    $array_racer ['i'] = (int) $data_racer['start_i'];
    $array_racer ['j'] = (int) $data_racer['start_j'];
    $array_racer ['millis'] = (int) $data_racer['millis'];

    
    $json []= $array_racer;
    
    if (file_put_contents($p, json_encode($json))){
      echo 'Рузультат сохранен!';
    }
  }
?>
