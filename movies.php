<?php
require 'vendor/autoload.php';

use Algolia\AlgoliaSearch\Api\SearchClient;

// 1. CONNECT TO DATABASE
$dbHost = 'localhost';
$dbName = 'movies_db';
$dbUser = 'root';
$dbPass = '';

try {
    $dbConnection = new PDO("mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4", $dbUser, $dbPass);
} catch (Exception $err) {
    die("Connection Error: " . $err->getMessage());
}

// 2. GET AND PROCESS DATA
$sql = "SELECT id AS objectID, title, overview, vote_average, genre, poster_url, release_date FROM moviedb";
$query = $dbConnection->query($sql);
$movieData = $query->fetchAll(PDO::FETCH_ASSOC);

$cleanMovies = array_map(function ($data) {

    // Get only the year from release_date
    $data['year'] = !empty($data['release_date'])
        ? (int) substr($data['release_date'], 0, 4)
        : null;

    // Convert genre string into an array
    if (!empty($data['genre'])) {
        $data['genre'] = array_map('trim', explode(',', $data['genre']));
    }

    return $data;
}, $movieData);

// 3. SEND DATA TO ALGOLIA
$algolia = SearchClient::create('IPKKB839TV', 'df548e5591b9c97e9ec2042350c021cc');

try {
    $algolia->saveObjects('movie_index', $cleanMovies);
    echo "Success! Movies successfully uploaded with filters.";
} catch (Exception $err) {
    echo "Upload Error: " . $err->getMessage();
}