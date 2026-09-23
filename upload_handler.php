<?php
// TEMPORARY: Debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

$response = array('status' => 'error', 'message' => 'An unknown error occurred.');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // 1. GET CATEGORY FROM POST
    // Default to 'general' if no category is sent
    $rawCategory = isset($_POST['category']) ? $_POST['category'] : 'general';
    
    // 2. SANITIZE CATEGORY (CRITICAL SECURITY STEP)
    // Only allow alphanumeric characters, underscores, and hyphens. 
    // This prevents hackers from sending "../" to traverse directories.
    $category = preg_replace('/[^a-zA-Z0-9_-]/', '', $rawCategory);
    
    // If sanitization leaves an empty string, fallback to general
    if(empty($category)) { $category = 'general'; }

    // 3. DEFINE DYNAMIC TARGET DIRECTORY
    $baseUploadDir = 'uploads/';
    $targetDir = $baseUploadDir . $category . '/';

    // 4. CREATE DIRECTORY IF IT DOESN'T EXIST
    if (!is_dir($targetDir)) {
        if (!mkdir($targetDir, 0777, true)) {
            $response['message'] = "Failed to create directory: " . $targetDir;
            echo json_encode($response);
            exit;
        }
    }

    if (isset($_FILES['photo'])) {
        $fileName = basename($_FILES['photo']['name']);
        
        // Make filename unique to prevent overwriting
        $fileName = time() . '_' . $fileName; 
        
        $targetFilePath = $targetDir . $fileName;

        $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);
        $fileTypeLower = strtolower($fileType);

        $response['debug_category'] = $category;
        $response['debug_target_path'] = $targetFilePath;

        $allowTypes = array('jpg', 'png', 'jpeg', 'gif');

        if (in_array($fileTypeLower, $allowTypes)) {
            if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetFilePath)) {
                $response['status'] = 'success';
                $response['message'] = "File uploaded successfully to category [$category]";
                $response['filePath'] = $targetFilePath;
                // Build the URL correctly
                $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http");
                $response['fileUrl'] = $protocol . "://$_SERVER[HTTP_HOST]/$targetFilePath";
            } else {
                $response['message'] = "Error moving file.";
                $response['php_error_details'] = error_get_last();
            }
        } else {
            $response['message'] = "File type not allowed.";
        }
    } else {
        $response['message'] = "No 'photo' file found.";
    }
} else {
    $response['message'] = "Invalid request method.";
}

echo json_encode($response);
?>