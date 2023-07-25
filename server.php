<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $manufacturer = $_POST['manufacturer'];
  $name = $_POST['name'];
  $price = $_POST['price'];
  $quantity = $_POST['quantity'];
  $data = $manufacturer . ' :: ' . $name . ' :: ' . $price . ' :: ' . $quantity . PHP_EOL;
  file_put_contents('data.txt', $data, FILE_APPEND);
  echo json_encode(['success' => true]);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $data = file('data.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  $result = [];
  foreach ($data as $item) {
    list($manufacturer, $name, $price, $quantity) = explode(' :: ', $item);
    $result[] = [
      'manufacturer' => $manufacturer,
      'name' => $name,
      'price' => $price,
      'quantity' => $quantity
    ];
  }
  echo json_encode($result);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $data = file('data.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  $index = $_GET['index'];
  unset($data[$index]);
  file_put_contents('data.txt', implode(PHP_EOL, $data));
  echo json_encode(['success' => true]);
}