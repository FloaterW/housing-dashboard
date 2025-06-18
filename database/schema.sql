-- Housing Dashboard MySQL Database Schema
-- Comprehensive schema design for real estate market analytics

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
-- 2. CORE HOUSING DATA TABLES
-- ====================================================================

-- Property listings and sales data
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
-- 3. RENTAL MARKET DATA
-- ====================================================================

-- Rental listings and transactions
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
-- 4. AIRBNB AND SHORT-TERM RENTAL DATA
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
-- 5. MARKET ANALYTICS AND AGGREGATED DATA
-- ====================================================================

-- Monthly market metrics (pre-calculated for performance)
CREATE TABLE market_metrics_monthly (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    metric_month DATE NOT NULL, -- First day of month
    
    -- Price metrics
    avg_sale_price DECIMAL(12,2),
    median_sale_price DECIMAL(12,2),
    avg_price_per_sqft DECIMAL(8,2),
    price_change_mom DECIMAL(5,2), -- Month over month %
    price_change_yoy DECIMAL(5,2), -- Year over year %
    
    -- Volume metrics
    total_sales INT DEFAULT 0,
    total_listings INT DEFAULT 0,
    sales_change_mom DECIMAL(5,2),
    
    -- Market timing
    avg_days_on_market DECIMAL(5,1),
    dom_change_mom DECIMAL(5,2),
    
    -- Market health
    months_of_inventory DECIMAL(4,2),
    absorption_rate DECIMAL(5,2),
    list_to_sale_ratio DECIMAL(5,2),
    
    -- Rental metrics
    avg_rental_rate DECIMAL(8,2),
    rental_yield DECIMAL(5,2), -- Annual rental income / property value
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    UNIQUE KEY unique_monthly_metric (region_id, housing_type_id, metric_month),
    INDEX idx_metrics_month (metric_month),
    INDEX idx_metrics_region_type (region_id, housing_type_id)
);

-- ====================================================================
-- 6. AFFORDABILITY AND ECONOMIC DATA
-- ====================================================================

-- Affordability metrics by region
CREATE TABLE affordability_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    data_date DATE NOT NULL,
    
    -- Income data
    median_household_income DECIMAL(10,2),
    avg_household_income DECIMAL(10,2),
    
    -- Affordability calculations
    housing_affordability_index DECIMAL(6,2), -- 100 = perfectly affordable
    price_to_income_ratio DECIMAL(5,2),
    mortgage_payment_to_income DECIMAL(5,2),
    
    -- Market conditions
    first_time_buyer_index DECIMAL(6,2),
    rental_affordability_index DECIMAL(6,2),
    
    -- Economic indicators
    unemployment_rate DECIMAL(4,2),
    population_growth_rate DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    INDEX idx_affordability_region_date (region_id, data_date)
);

-- ====================================================================
-- 7. USER AND SYSTEM TABLES
-- ====================================================================

-- Data sources tracking
CREATE TABLE data_sources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    source_name VARCHAR(100) NOT NULL,
    source_type ENUM('API', 'SCRAPER', 'MANUAL', 'IMPORT') NOT NULL,
    last_update TIMESTAMP,
    update_frequency VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data quality and audit log
CREATE TABLE data_audit_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(100) NOT NULL,
    source_id INT,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE', 'IMPORT') NOT NULL,
    records_affected INT,
    data_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (source_id) REFERENCES data_sources(id),
    
    INDEX idx_audit_table_date (table_name, created_at)
);

-- ====================================================================
-- 8. VIEWS FOR COMMON QUERIES
-- ====================================================================

-- Current market summary view
CREATE VIEW v_market_summary AS
SELECT 
    r.name as region_name,
    ht.name as housing_type,
    COUNT(ps.id) as total_sales_last_30_days,
    AVG(ps.sale_price) as avg_sale_price,
    AVG(ps.days_on_market) as avg_days_on_market,
    COUNT(al.id) as active_listings,
    AVG(al.list_price) as avg_list_price
FROM regions r
CROSS JOIN housing_types ht
LEFT JOIN property_sales ps ON r.id = ps.region_id 
    AND ht.id = ps.housing_type_id 
    AND ps.sale_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
LEFT JOIN active_listings al ON r.id = al.region_id 
    AND ht.id = al.housing_type_id
GROUP BY r.id, ht.id;

-- Price trends view
CREATE VIEW v_price_trends AS
SELECT 
    r.name as region_name,
    ht.name as housing_type,
    DATE_FORMAT(ps.sale_date, '%Y-%m') as sale_month,
    COUNT(*) as sales_count,
    AVG(ps.sale_price) as avg_price,
    AVG(ps.price_per_sqft) as avg_price_per_sqft,
    AVG(ps.days_on_market) as avg_days_on_market
FROM property_sales ps
JOIN regions r ON ps.region_id = r.id
JOIN housing_types ht ON ps.housing_type_id = ht.id
WHERE ps.sale_date >= DATE_SUB(CURDATE(), INTERVAL 24 MONTH)
GROUP BY r.id, ht.id, DATE_FORMAT(ps.sale_date, '%Y-%m')
ORDER BY r.name, ht.name, sale_month;