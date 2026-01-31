<?php
/**
 * Database Setup Script
 * Run this script to initialize the database tables
 * 
 * Usage:
 *   php database/setup.php
 *   
 * For PostgreSQL (development):
 *   1. Create database: createdb brasil_legalize
 *   2. Run this script
 *   
 * For MySQL (production):
 *   1. Create database via phpMyAdmin
 *   2. Update .env.local with MySQL credentials
 *   3. Run this script
 */

require_once __DIR__ . '/../api/lib/Database.php';

use BrasilLegalize\Api\Lib\Database;

echo "Brasil Legalize Database Setup\n";
echo "==============================\n\n";

try {
    // Get database connection
    $db = Database::getConnection();
    $driver = $db->getAttribute(PDO::ATTR_DRIVER_NAME);
    
    echo "Connected to database (driver: {$driver})\n\n";
    
    // Choose schema file based on driver
    $schemaFile = $driver === 'pgsql' 
        ? __DIR__ . '/schema.sql' 
        : __DIR__ . '/schema-mysql.sql';
    
    if (!file_exists($schemaFile)) {
        throw new Exception("Schema file not found: {$schemaFile}");
    }
    
    echo "Loading schema from: " . basename($schemaFile) . "\n\n";
    
    // Read and execute schema
    $sql = file_get_contents($schemaFile);
    
    // Split into individual statements
    $statements = array_filter(
        array_map('trim', explode(';', $sql)),
        fn($s) => !empty($s) && !preg_match('/^--/', $s)
    );
    
    echo "Executing " . count($statements) . " SQL statements...\n\n";
    
    $success = 0;
    $errors = 0;
    
    foreach ($statements as $stmt) {
        if (empty(trim($stmt))) continue;
        
        try {
            $db->exec($stmt);
            $success++;
            
            // Show progress for table creation
            if (preg_match('/CREATE TABLE[^(]+\(?\s*([a-z_]+)/i', $stmt, $matches)) {
                echo "  ✓ Created table: {$matches[1]}\n";
            } elseif (preg_match('/INSERT INTO\s+([a-z_]+)/i', $stmt, $matches)) {
                echo "  ✓ Inserted data into: {$matches[1]}\n";
            }
        } catch (PDOException $e) {
            // Ignore "already exists" errors
            if (strpos($e->getMessage(), 'already exists') !== false ||
                strpos($e->getMessage(), 'Duplicate') !== false) {
                echo "  - Skipped (already exists)\n";
            } else {
                echo "  ✗ Error: " . $e->getMessage() . "\n";
                $errors++;
            }
        }
    }
    
    echo "\n==============================\n";
    echo "Setup complete!\n";
    echo "  Successful: {$success}\n";
    echo "  Errors: {$errors}\n\n";
    
    // Show default admin credentials
    echo "Default admin credentials:\n";
    echo "  Email: admin@brasillegalize.com\n";
    echo "  Password: Admin@123456\n";
    echo "\n⚠️  IMPORTANT: Change the default password immediately!\n\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
