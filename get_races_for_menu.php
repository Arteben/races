<?php
  
  header('Cache-Control: no-cashe');
  header('Pragma: no-cache');
  header('Content-Type: application/json');  
  
  $path = 'data/races.json';
          
  $file = file_get_contents($path);
    
  $races_file = json_decode($file, true);
  
  unset($file);
  
  $out_array = array();
  
  $racer_from_file = array();
  
  $road = 0;
  
  $old_roads = array();
    
  $values_from_file = array_values($races_file);
  
  foreach($races_file as $racer_from_file){
    
    foreach($old_roads as $num => $num_road){
                         
      if ((int) $racer_from_file['road'] == $num_road){
        break;
        $road = false;
      }
      
      if (($num + 1) == count($old_roads)){        
        
        $road = $racer_from_file['road'];
        
      }
    }
    
    if ($road !== false){

      $racer_from_file_cycle = array();
      $min = false;
                  
      foreach($values_from_file as $count => $racer_from_file_cycle){
                
        if ((int) $racer_from_file_cycle ['road'] == $road ) {

          $time_cycle = (int) $values_from_file [$min] ['time'];
          
          if ($min === false){
            $min = $count;
          }
          
          if ((int) $racer_from_file_cycle['time'] <= $time_cycle){
            
            $min = $count;
          
          }
        }
      }
            
      $out_array []= array('name' => $values_from_file [$min] ['name'],
                          
                          'human_time' => $values_from_file [$min] ['human_time'],
                                                    
                          'road' => $values_from_file [$min] ['road']);
                  
      $old_roads []= $road;
      
      $road = false;                                
    }
  }
  
  $out_json = json_encode($out_array);
  
  echo $out_json;
  
?>
