<?php
/**
 * Pricing Service
 * Handles CRUD operations for packages and service pricing
 */

namespace BrasilLegalize\Api\Lib;

use PDO;

class PricingService
{
    private PDO $db;
    
    public function __construct(PDO $db)
    {
        $this->db = $db;
    }
    
    /**
     * Get all packages with their services
     */
    public function getAllPackages(bool $activeOnly = true): array
    {
        $sql = 'SELECT * FROM pricing';
        if ($activeOnly) {
            $sql .= ' WHERE is_active = TRUE';
        }
        $sql .= ' ORDER BY display_order ASC';
        
        $stmt = $this->db->query($sql);
        $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get services for each package
        foreach ($packages as &$package) {
            $package['services'] = $this->getPackageServices((int)$package['id']);
            $package['base_price'] = (float)$package['base_price'];
            $package['price_per_extra_adult'] = (float)$package['price_per_extra_adult'];
            $package['price_per_extra_child'] = (float)$package['price_per_extra_child'];
            $package['is_active'] = (bool)$package['is_active'];
            $package['is_popular'] = (bool)$package['is_popular'];
        }
        
        return $packages;
    }
    
    /**
     * Get single package by key
     */
    public function getPackageByKey(string $key): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM pricing WHERE package_key = :key');
        $stmt->execute(['key' => $key]);
        $package = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$package) {
            return null;
        }
        
        $package['services'] = $this->getPackageServices((int)$package['id']);
        $package['base_price'] = (float)$package['base_price'];
        $package['price_per_extra_adult'] = (float)$package['price_per_extra_adult'];
        $package['price_per_extra_child'] = (float)$package['price_per_extra_child'];
        $package['is_active'] = (bool)$package['is_active'];
        $package['is_popular'] = (bool)$package['is_popular'];
        
        return $package;
    }
    
    /**
     * Get services included in a package
     */
    public function getPackageServices(int $packageId): array
    {
        $stmt = $this->db->prepare('
            SELECT s.* FROM service_pricing s
            JOIN package_services ps ON ps.service_id = s.id
            WHERE ps.package_id = :package_id AND ps.is_included = TRUE
            ORDER BY s.display_order ASC
        ');
        $stmt->execute(['package_id' => $packageId]);
        $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($services as &$service) {
            $service['price'] = (float)$service['price'];
            $service['is_active'] = (bool)$service['is_active'];
        }
        
        return $services;
    }
    
    /**
     * Get all services
     */
    public function getAllServices(bool $activeOnly = true): array
    {
        $sql = 'SELECT * FROM service_pricing';
        if ($activeOnly) {
            $sql .= ' WHERE is_active = TRUE';
        }
        $sql .= ' ORDER BY display_order ASC';
        
        $stmt = $this->db->query($sql);
        $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($services as &$service) {
            $service['price'] = (float)$service['price'];
            $service['is_active'] = (bool)$service['is_active'];
        }
        
        return $services;
    }
    
    /**
     * Get service by key
     */
    public function getServiceByKey(string $key): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM service_pricing WHERE service_key = :key');
        $stmt->execute(['key' => $key]);
        $service = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($service) {
            $service['price'] = (float)$service['price'];
            $service['is_active'] = (bool)$service['is_active'];
        }
        
        return $service ?: null;
    }
    
    /**
     * Update package pricing
     */
    public function updatePackage(int $id, array $data, int $adminId): bool
    {
        $allowedFields = [
            'name_en', 'name_ar', 'name_es', 'name_pt',
            'description_en', 'description_ar', 'description_es', 'description_pt',
            'base_price', 'currency',
            'adults_included', 'children_included',
            'price_per_extra_adult', 'price_per_extra_child',
            'is_active', 'is_popular', 'display_order'
        ];
        
        $updates = [];
        $params = ['id' => $id, 'updated_by' => $adminId];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updates[] = "{$field} = :{$field}";
                $params[$field] = $data[$field];
            }
        }
        
        if (empty($updates)) {
            return false;
        }
        
        $updates[] = 'updated_at = NOW()';
        $updates[] = 'updated_by = :updated_by';
        
        $sql = 'UPDATE pricing SET ' . implode(', ', $updates) . ' WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute($params);
    }
    
    /**
     * Update service pricing
     */
    public function updateService(int $id, array $data, int $adminId): bool
    {
        $allowedFields = [
            'name_en', 'name_ar', 'name_es', 'name_pt',
            'description_en', 'description_ar', 'description_es', 'description_pt',
            'price', 'currency', 'icon', 'color', 'category',
            'is_active', 'display_order'
        ];
        
        $updates = [];
        $params = ['id' => $id, 'updated_by' => $adminId];
        
        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $updates[] = "{$field} = :{$field}";
                $params[$field] = $data[$field];
            }
        }
        
        if (empty($updates)) {
            return false;
        }
        
        $updates[] = 'updated_at = NOW()';
        $updates[] = 'updated_by = :updated_by';
        
        $sql = 'UPDATE service_pricing SET ' . implode(', ', $updates) . ' WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute($params);
    }
    
    /**
     * Update package services (which services are included)
     */
    public function updatePackageServices(int $packageId, array $serviceIds, int $adminId): bool
    {
        // Start transaction
        $this->db->beginTransaction();
        
        try {
            // Remove existing
            $this->db->prepare('DELETE FROM package_services WHERE package_id = :id')
                ->execute(['id' => $packageId]);
            
            // Insert new
            $stmt = $this->db->prepare('
                INSERT INTO package_services (package_id, service_id, is_included)
                VALUES (:package_id, :service_id, TRUE)
            ');
            
            foreach ($serviceIds as $serviceId) {
                $stmt->execute([
                    'package_id' => $packageId,
                    'service_id' => $serviceId,
                ]);
            }
            
            // Update package timestamp
            $this->db->prepare('UPDATE pricing SET updated_at = NOW(), updated_by = :admin_id WHERE id = :id')
                ->execute(['id' => $packageId, 'admin_id' => $adminId]);
            
            $this->db->commit();
            return true;
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
    
    /**
     * Get pricing for public display (formatted for frontend)
     */
    public function getPublicPricing(string $locale = 'en'): array
    {
        $packages = $this->getAllPackages(true);
        $services = $this->getAllServices(true);
        
        // Build service map by key
        $serviceMap = [];
        foreach ($services as $service) {
            $serviceMap[$service['service_key']] = [
                'key' => $service['service_key'],
                'name' => $service["name_{$locale}"] ?? $service['name_en'],
                'description' => $service["description_{$locale}"] ?? $service['description_en'],
                'price' => $service['price'],
                'icon' => $service['icon'],
                'color' => $service['color'],
                'category' => $service['category'],
            ];
        }
        
        // Format packages
        $result = [];
        foreach ($packages as $package) {
            $result[$package['package_key']] = [
                'key' => $package['package_key'],
                'name' => $package["name_{$locale}"] ?? $package['name_en'],
                'description' => $package["description_{$locale}"] ?? $package['description_en'],
                'basePrice' => $package['base_price'],
                'currency' => $package['currency'],
                'adultsIncluded' => (int)$package['adults_included'],
                'childrenIncluded' => (int)$package['children_included'],
                'pricePerExtraAdult' => $package['price_per_extra_adult'],
                'pricePerExtraChild' => $package['price_per_extra_child'],
                'isPopular' => $package['is_popular'],
                'services' => array_map(function($s) use ($locale) {
                    return [
                        'key' => $s['service_key'],
                        'name' => $s["name_{$locale}"] ?? $s['name_en'],
                        'icon' => $s['icon'],
                        'color' => $s['color'],
                    ];
                }, $package['services']),
            ];
        }
        
        return [
            'packages' => $result,
            'services' => $serviceMap,
        ];
    }
    
    /**
     * Calculate custom package price
     */
    public function calculateCustomPrice(array $serviceKeys, int $adults = 2, int $children = 1): array
    {
        $total = 0;
        $servicesIncluded = [];
        
        foreach ($serviceKeys as $key) {
            $service = $this->getServiceByKey($key);
            if ($service && $service['is_active']) {
                $total += $service['price'];
                $servicesIncluded[] = [
                    'key' => $service['service_key'],
                    'name' => $service['name_en'],
                    'price' => $service['price'],
                ];
            }
        }
        
        // Add per-person pricing if needed (can be customized)
        $perPersonFee = 100; // Example fee per extra person
        $extraPeople = max(0, ($adults - 2) + ($children - 1));
        $extraFees = $extraPeople * $perPersonFee;
        
        return [
            'services' => $servicesIncluded,
            'subtotal' => $total,
            'extraPeople' => $extraPeople,
            'extraFees' => $extraFees,
            'total' => $total + $extraFees,
            'currency' => 'USD',
        ];
    }
}
