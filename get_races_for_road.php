<?php
  
  header('Cache-Control: no-cashe');
  header('Pragma: no-cache');
  header('Content-Type: application/json');
  
  $path = 'data/races.json';
  
  $road = (int) $_GET['numroad'];
    
  $file = file_get_contents($path);
    
  $races_file = json_decode($file, true);
  
  unset($file);
  
  $out_array = array();
  $racer_from_file = array();
  
  foreach($races_file as $racer_from_file){
    
    if ((int) $racer_from_file['road'] == $road){
            
      $out_array []= $racer_from_file;
    }
  }
    
  $out_json = json_encode($out_array);
  
  echo $out_json;
?>
