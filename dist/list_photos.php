<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

$response = array('status' => 'error', 'message' => 'Unknown error', 'photos' => array());

// 1. GET CATEGORY
$rawCategory = isset($_GET['category']) ? $_GET['category'] : 'general';

// 2. SANITIZE
$category = preg_replace('/[^a-zA-Z0-9_-]/', '', $rawCategory);
if(empty($category)) { $category = 'general'; }

$baseDir = 'uploads/';
$targetDir = $baseDir . $category . '/';

// 3. CHECK IF CATEGORY EXISTS
if (is_dir($targetDir)) {
    $files = scandir($targetDir);
    
    if ($files === false) {
        $response['message'] = "Could not read directory.";
    } else {
        $photoFiles = array();
        $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http");
        $host = $_SERVER['HTTP_HOST'];

        foreach ($files as $file) {
            if ($file != '.' && $file != '..' && preg_match('/\.(jpg|jpeg|png|gif)$/i', $file)) {
                // Return full URL
                $photoFiles[] = "$protocol://$host/$targetDir$file";
            }
        }
        $response['status'] = 'success';
        $response['message'] = count($photoFiles) . " photos found in category: $category";
        $response['photos'] = $photoFiles;
    }
} else {
    // If the directory doesn't exist, it just means no photos have been uploaded for this country yet.
    // Return success with empty list is better than error.
    $response['status'] = 'success'; 
    $response['message'] = "No photos exist for this category yet.";
    $response['photos'] = array();
}

echo json_encode($response);
?>