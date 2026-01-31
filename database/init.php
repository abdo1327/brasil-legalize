<?php
/**
 * Create the database if it doesn't exist
 * Then run the schema setup
 */

// Load environment variables
$envFile = __DIR__ . '/../.env.local';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
            putenv(trim($key) . '=' . trim($value));
        }
    }
}

$driver = $_ENV['DB_DRIVER'] ?? 'pgsql';
$host = $_ENV['DB_HOST'] ?? 'localhost';
$port = $_ENV['DB_PORT'] ?? ($driver === 'pgsql' ? '5432' : '3306');
$user = $_ENV['DB_USER'] ?? 'postgres';
$pass = $_ENV['DB_PASS'] ?? '1234';
$dbname = $_ENV['DB_NAME'] ?? 'brasil_legalize';

echo "Brasil Legalize Database Initializer\n";
echo "=====================================\n\n";
echo "Driver: {$driver}\n";
echo "Host: {$host}:{$port}\n";
echo "User: {$user}\n";
echo "Database: {$dbname}\n\n";

try {
    // Connect without database to create it
    $dsn = "{$driver}:host={$host};port={$port}";
    if ($driver === 'pgsql') {
        $dsn .= ';dbname=postgres';
    }
    
    echo "Connecting to server...\n";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    // Check if database exists
    if ($driver === 'pgsql') {
        $stmt = $pdo->query("SELECT 1 FROM pg_database WHERE datname = '{$dbname}'");
        $exists = $stmt->fetch();
        
        if (!$exists) {
            echo "Creating database '{$dbname}'...\n";
            $pdo->exec("CREATE DATABASE {$dbname}");
            echo "✓ Database created\n\n";
        } else {
            echo "✓ Database '{$dbname}' already exists\n\n";
        }
    } else {
        // MySQL
        echo "Creating database '{$dbname}' (if not exists)...\n";
        $pdo->exec("CREATE DATABASE IF NOT EXISTS {$dbname}");
        echo "✓ Database ready\n\n";
    }
    
    // Now connect to the actual database
    $dsn = "{$driver}:host={$host};port={$port};dbname={$dbname}";
    $db = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    // Choose schema file
    $schemaFile = $driver === 'pgsql' 
        ? __DIR__ . '/schema.sql' 
        : __DIR__ . '/schema-mysql.sql';
    
    echo "Loading schema from: " . basename($schemaFile) . "\n\n";
    
    $sql = file_get_contents($schemaFile);
    
    // For PostgreSQL, we can execute the whole thing
    if ($driver === 'pgsql') {
        $db->exec($sql);
        echo "✓ Schema executed successfully\n\n";
    } else {
        // For MySQL, split by semicolon
        $statements = array_filter(
            preg_split('/;\s*\n/', $sql),
            fn($s) => !empty(trim($s))
        );
        
        foreach ($statements as $stmt) {
            $stmt = trim($stmt);
            if (empty($stmt) || preg_match('/^--/', $stmt)) continue;
            
            try {
                $db->exec($stmt);
            } catch (PDOException $e) {
                // Ignore "already exists" errors
                if (strpos($e->getMessage(), 'already exists') === false &&
                    strpos($e->getMessage(), 'Duplicate') === false) {
                    echo "Warning: " . $e->getMessage() . "\n";
                }
            }
        }
        echo "✓ Schema executed\n\n";
    }
    
    // Verify tables
    echo "Verifying tables...\n";
    if ($driver === 'pgsql') {
        $tables = $db->query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")->fetchAll(PDO::FETCH_COLUMN);
    } else {
        $tables = $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    }
    
    foreach ($tables as $table) {
        echo "  ✓ {$table}\n";
    }
    
    echo "\n=====================================\n";
    echo "Setup complete!\n\n";
    echo "Default admin credentials:\n";
    echo "  Email: admin@brasillegalize.com\n";
    echo "  Password: Admin@123456\n";
    echo "\n⚠️  Change the default password immediately!\n";
    
} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
