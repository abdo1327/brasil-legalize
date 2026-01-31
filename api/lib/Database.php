<?php
/**
 * Database Connection Class
 * Supports PostgreSQL (development) and MySQL (production)
 */

namespace BrasilLegalize\Api\Lib;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $instance = null;
    private static array $config = [];

    /**
     * Get database connection instance (singleton)
     */
    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            self::$instance = self::createConnection();
        }
        return self::$instance;
    }

    /**
     * Create new database connection
     */
    private static function createConnection(): PDO
    {
        self::loadConfig();
        
        $driver = self::$config['driver'] ?? 'pgsql';
        $host = self::$config['host'] ?? 'localhost';
        $port = self::$config['port'] ?? ($driver === 'pgsql' ? 5432 : 3306);
        $database = self::$config['database'] ?? 'brasil_legalize';
        $username = self::$config['username'] ?? 'postgres';
        $password = self::$config['password'] ?? '1234';
        $charset = self::$config['charset'] ?? 'utf8mb4';

        try {
            if ($driver === 'pgsql') {
                $dsn = "pgsql:host={$host};port={$port};dbname={$database}";
                $pdo = new PDO($dsn, $username, $password);
            } else {
                $dsn = "mysql:host={$host};port={$port};dbname={$database};charset={$charset}";
                $pdo = new PDO($dsn, $username, $password);
                $pdo->exec("SET NAMES {$charset}");
            }

            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

            return $pdo;
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new \RuntimeException("Database connection failed");
        }
    }

    /**
     * Load configuration from environment or file
     */
    private static function loadConfig(): void
    {
        // Try to load from .env file if exists
        $envFile = dirname(__DIR__, 2) . '/.env.local';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos($line, '#') === 0) continue;
                if (strpos($line, '=') !== false) {
                    [$key, $value] = explode('=', $line, 2);
                    $_ENV[trim($key)] = trim($value);
                }
            }
        }

        // Map environment variables to config
        self::$config = [
            'driver' => $_ENV['DB_DRIVER'] ?? getenv('DB_DRIVER') ?: 'pgsql',
            'host' => $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: 'localhost',
            'port' => $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?: null,
            'database' => $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'brasil_legalize',
            'username' => $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'postgres',
            'password' => $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?: '1234',
            'charset' => $_ENV['DB_CHARSET'] ?? getenv('DB_CHARSET') ?: 'utf8mb4',
        ];
    }

    /**
     * Close connection
     */
    public static function close(): void
    {
        self::$instance = null;
    }

    /**
     * Begin transaction
     */
    public static function beginTransaction(): bool
    {
        return self::getConnection()->beginTransaction();
    }

    /**
     * Commit transaction
     */
    public static function commit(): bool
    {
        return self::getConnection()->commit();
    }

    /**
     * Rollback transaction
     */
    public static function rollback(): bool
    {
        return self::getConnection()->rollBack();
    }
}
