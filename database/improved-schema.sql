-- ====================================================================
-- IMPROVED HOUSING DASHBOARD DATABASE SCHEMA
-- Designed to support all frontend data requirements
-- ====================================================================

-- Create database
CREATE DATABASE IF NOT EXISTS housing_dashboard
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE housing_dashboard;

-- ====================================================================
-- 1. LOOKUP TABLES (Reference Data)
-- ====================================================================

-- Regions table
CREATE TABLE regions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    parent_region_id INT NULL,
    population INT,
    area_km2 DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_region_id) REFERENCES regions(id) ON DELETE SET NULL,
    INDEX idx_regions_code (code),
    INDEX idx_regions_parent (parent_region_id)
);

-- Housing types lookup
CREATE TABLE housing_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    typical_size_sqft_min INT,
    typical_size_sqft_max INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_housing_types_code (code)
);

-- Market status lookup
CREATE TABLE market_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT
);

-- ====================================================================
-- 2. KEY METRICS TABLE (Primary Dashboard Data)
-- ====================================================================

-- Key performance indicators by region and housing type
CREATE TABLE key_metrics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    data_date DATE NOT NULL,
    
    -- Price metrics
    avg_price DECIMAL(12,2) NOT NULL,
    price_change_pct DECIMAL(5,2) DEFAULT 0,
    
    -- Sales metrics
    total_sales INT DEFAULT 0,
    sales_change_pct DECIMAL(5,2) DEFAULT 0,
    
    -- Market timing
    avg_days_on_market INT DEFAULT 0,
    days_change_pct DECIMAL(5,2) DEFAULT 0,
    
    -- Inventory metrics
    inventory_count INT DEFAULT 0,
    inventory_change_pct DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    UNIQUE KEY unique_key_metrics (region_id, housing_type_id, data_date),
    INDEX idx_key_metrics_date (data_date),
    INDEX idx_key_metrics_region_type (region_id, housing_type_id)
);

-- ====================================================================
-- 3. HOUSING TYPE DISTRIBUTION
-- ====================================================================

-- Housing stock distribution by region
CREATE TABLE housing_distribution (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    
    -- Distribution metrics
    stock_count BIGINT NOT NULL,
    market_share_pct DECIMAL(5,2) NOT NULL,
    avg_price DECIMAL(12,2) NOT NULL,
    
    -- Metadata
    updated_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    UNIQUE KEY unique_housing_distribution (region_id, housing_type_id),
    INDEX idx_housing_distribution_region (region_id)
);

-- ====================================================================
-- 4. PRICE PER SQUARE FOOT DATA
-- ====================================================================

-- Price per square foot by region and housing type
CREATE TABLE price_per_sqft (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    
    -- Price per sqft metrics
    price_per_sqft DECIMAL(8,2) NOT NULL,
    avg_sqft INT NOT NULL,
    
    -- Metadata
    data_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    UNIQUE KEY unique_price_per_sqft (region_id, housing_type_id, data_date),
    INDEX idx_price_per_sqft_date (data_date)
);

-- ====================================================================
-- 5. HISTORICAL TIME SERIES DATA
-- ====================================================================

-- Monthly price trends
CREATE TABLE price_trends (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    
    -- Time series data
    month DATE NOT NULL, -- First day of month (YYYY-MM-01)
    price DECIMAL(12,2) NOT NULL,
    change_pct DECIMAL(5,2) DEFAULT 0,
    min_price DECIMAL(12,2),
    max_price DECIMAL(12,2),
    sales_count INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    UNIQUE KEY unique_price_trends (region_id, housing_type_id, month),
    INDEX idx_price_trends_month (month),
    INDEX idx_price_trends_region_type (region_id, housing_type_id)
);

-- Monthly sales data
CREATE TABLE sales_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    
    -- Sales metrics
    month DATE NOT NULL, -- First day of month (YYYY-MM-01)
    sales_count INT NOT NULL,
    avg_price DECIMAL(12,2),
    total_value DECIMAL(15,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    UNIQUE KEY unique_sales_data (region_id, housing_type_id, month),
    INDEX idx_sales_data_month (month),
    INDEX idx_sales_data_region_type (region_id, housing_type_id)
);

-- Monthly inventory data
CREATE TABLE inventory_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    
    -- Inventory metrics
    month DATE NOT NULL, -- First day of month (YYYY-MM-01)
    total_listings INT NOT NULL,
    new_listings INT DEFAULT 0,
    sold_listings INT DEFAULT 0,
    expired_listings INT DEFAULT 0,
    avg_list_price DECIMAL(12,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    UNIQUE KEY unique_inventory_data (region_id, housing_type_id, month),
    INDEX idx_inventory_data_month (month),
    INDEX idx_inventory_data_region_type (region_id, housing_type_id)
);

-- ====================================================================
-- 6. MARKET ANALYSIS TABLES
-- ====================================================================

-- Market velocity metrics
CREATE TABLE market_velocity (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    
    -- Velocity metrics
    days_on_market INT NOT NULL,
    avg_price DECIMAL(12,2) NOT NULL,
    sales_volume INT NOT NULL,
    
    -- Metadata
    data_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    UNIQUE KEY unique_market_velocity (region_id, housing_type_id, data_date),
    INDEX idx_market_velocity_date (data_date)
);

-- New construction vs resale market data
CREATE TABLE new_vs_resale (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    
    -- New construction metrics
    new_units_sold INT DEFAULT 0,
    resale_units_sold INT DEFAULT 0,
    new_avg_price DECIMAL(12,2),
    resale_avg_price DECIMAL(12,2),
    
    -- Metadata
    data_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    UNIQUE KEY unique_new_vs_resale (region_id, housing_type_id, data_date),
    INDEX idx_new_vs_resale_date (data_date)
);

-- ====================================================================
-- 7. DETAILED TRANSACTION TABLES
-- ====================================================================

-- Property sales transactions
CREATE TABLE property_sales (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    sale_date DATE NOT NULL,
    
    -- Price information
    sale_price DECIMAL(12,2) NOT NULL,
    list_price DECIMAL(12,2),
    price_per_sqft DECIMAL(8,2),
    
    -- Property details
    size_sqft INT,
    bedrooms TINYINT,
    bathrooms DECIMAL(3,1),
    lot_size_sqft INT,
    year_built YEAR,
    
    -- Market timing
    days_on_market INT,
    list_date DATE,
    
    -- Property classification
    is_new_construction BOOLEAN DEFAULT FALSE,
    property_subtype VARCHAR(50),
    
    -- Location (for mapping)
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    postal_code VARCHAR(10),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    INDEX idx_sales_date (sale_date),
    INDEX idx_sales_region_type (region_id, housing_type_id),
    INDEX idx_sales_price (sale_price),
    INDEX idx_sales_location (latitude, longitude),
    INDEX idx_sales_days_market (days_on_market)
);

-- Current active listings
CREATE TABLE active_listings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    status_id INT NOT NULL,
    
    -- Listing details
    list_price DECIMAL(12,2) NOT NULL,
    price_per_sqft DECIMAL(8,2),
    size_sqft INT,
    bedrooms TINYINT,
    bathrooms DECIMAL(3,1),
    
    -- Timing
    list_date DATE NOT NULL,
    days_on_market INT,
    
    -- Property details
    is_new_construction BOOLEAN DEFAULT FALSE,
    year_built YEAR,
    lot_size_sqft INT,
    
    -- Location
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    postal_code VARCHAR(10),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    FOREIGN KEY (status_id) REFERENCES market_status(id),
    
    INDEX idx_listings_region_type (region_id, housing_type_id),
    INDEX idx_listings_price (list_price),
    INDEX idx_listings_date (list_date),
    INDEX idx_listings_status (status_id)
);

-- ====================================================================
-- 8. RENTAL MARKET DATA
-- ====================================================================

-- Rental market data
CREATE TABLE rental_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    
    -- Rental details
    monthly_rent DECIMAL(8,2) NOT NULL,
    rent_per_sqft DECIMAL(6,2),
    size_sqft INT,
    bedrooms TINYINT,
    bathrooms DECIMAL(3,1),
    
    -- Lease details
    lease_start_date DATE,
    lease_term_months TINYINT,
    is_furnished BOOLEAN DEFAULT FALSE,
    includes_utilities BOOLEAN DEFAULT FALSE,
    
    -- Property details
    year_built YEAR,
    amenities TEXT,
    
    -- Location
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    postal_code VARCHAR(10),
    
    -- Timing
    listing_date DATE NOT NULL,
    rented_date DATE,
    days_to_rent INT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    INDEX idx_rental_region_type (region_id, housing_type_id),
    INDEX idx_rental_price (monthly_rent),
    INDEX idx_rental_date (listing_date)
);

-- ====================================================================
-- 9. AIRBNB DATA
-- ====================================================================

-- AirBnB listings and performance data
CREATE TABLE airbnb_listings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    
    -- Listing details
    nightly_rate DECIMAL(8,2) NOT NULL,
    cleaning_fee DECIMAL(6,2),
    service_fee_percent DECIMAL(4,2),
    
    -- Property details
    bedrooms TINYINT,
    bathrooms DECIMAL(3,1),
    max_guests TINYINT,
    size_sqft INT,
    
    -- Performance metrics
    occupancy_rate DECIMAL(5,2), -- percentage
    monthly_revenue DECIMAL(10,2),
    average_rating DECIMAL(3,2),
    total_reviews INT,
    
    -- Timing
    listing_created_date DATE,
    last_booked_date DATE,
    
    -- Location
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    postal_code VARCHAR(10),
    
    -- Classification
    is_entire_home BOOLEAN DEFAULT TRUE,
    is_superhost BOOLEAN DEFAULT FALSE,
    instant_book BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    INDEX idx_airbnb_region_type (region_id, housing_type_id),
    INDEX idx_airbnb_rate (nightly_rate),
    INDEX idx_airbnb_performance (occupancy_rate, monthly_revenue)
);

-- ====================================================================
-- 10. VIEWS FOR API QUERIES
-- ====================================================================

-- Key metrics view for dashboard
CREATE VIEW v_key_metrics AS
SELECT 
    r.name as region_name,
    r.id as region_id,
    ht.name as housing_type_name,
    ht.id as housing_type_id,
    km.avg_price,
    km.price_change_pct,
    km.total_sales,
    km.sales_change_pct,
    km.avg_days_on_market,
    km.days_change_pct,
    km.inventory_count,
    km.inventory_change_pct,
    km.data_date
FROM key_metrics km
JOIN regions r ON km.region_id = r.id
JOIN housing_types ht ON km.housing_type_id = ht.id
WHERE km.data_date = (
    SELECT MAX(data_date) 
    FROM key_metrics km2 
    WHERE km2.region_id = km.region_id 
    AND km2.housing_type_id = km.housing_type_id
);

-- Housing distribution view
CREATE VIEW v_housing_distribution AS
SELECT 
    r.name as region_name,
    r.id as region_id,
    ht.name as housing_type_name,
    ht.id as housing_type_id,
    hd.stock_count,
    hd.market_share_pct,
    hd.avg_price,
    hd.updated_date
FROM housing_distribution hd
JOIN regions r ON hd.region_id = r.id
JOIN housing_types ht ON hd.housing_type_id = ht.id;

-- Price trends view
CREATE VIEW v_price_trends AS
SELECT 
    r.name as region_name,
    r.id as region_id,
    ht.name as housing_type_name,
    ht.id as housing_type_id,
    pt.month,
    pt.price,
    pt.change_pct,
    pt.min_price,
    pt.max_price,
    pt.sales_count
FROM price_trends pt
JOIN regions r ON pt.region_id = r.id
JOIN housing_types ht ON pt.housing_type_id = ht.id
ORDER BY r.name, ht.name, pt.month;

-- Sales data view
CREATE VIEW v_sales_data AS
SELECT 
    r.name as region_name,
    r.id as region_id,
    ht.name as housing_type_name,
    ht.id as housing_type_id,
    sd.month,
    sd.sales_count,
    sd.avg_price,
    sd.total_value
FROM sales_data sd
JOIN regions r ON sd.region_id = r.id
JOIN housing_types ht ON sd.housing_type_id = ht.id
ORDER BY r.name, ht.name, sd.month;

-- Market velocity view
CREATE VIEW v_market_velocity AS
SELECT 
    r.name as region_name,
    r.id as region_id,
    ht.name as housing_type_name,
    ht.id as housing_type_id,
    mv.days_on_market,
    mv.avg_price,
    mv.sales_volume,
    mv.data_date
FROM market_velocity mv
JOIN regions r ON mv.region_id = r.id
JOIN housing_types ht ON mv.housing_type_id = ht.id; 