-- ====================================================================
-- COMPREHENSIVE HOUSING DASHBOARD DATABASE SCHEMA
-- Supports ALL frontend data requirements across every tab and component
-- ====================================================================

-- Create database
CREATE DATABASE IF NOT EXISTS housing_dashboard
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE housing_dashboard;

-- ====================================================================
-- 1. REFERENCE/LOOKUP TABLES
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

-- Bedroom types for rental data
CREATE TABLE bedroom_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT,
    
    INDEX idx_bedroom_types_code (code)
);

-- Income deciles for affordability analysis
CREATE TABLE income_deciles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    decile_number INT NOT NULL UNIQUE,
    min_income DECIMAL(10,2) NOT NULL,
    max_income DECIMAL(10,2),
    description VARCHAR(100),
    
    INDEX idx_income_decile (decile_number)
);

-- Market status lookup
CREATE TABLE market_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT
);

-- Data sources tracking
CREATE TABLE data_sources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    source_name VARCHAR(100) NOT NULL,
    source_type ENUM('API', 'SCRAPER', 'MANUAL', 'IMPORT') NOT NULL,
    update_frequency VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 2. CORE HOUSING MARKET DATA
-- ====================================================================

-- Key performance indicators (Main Dashboard)
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

-- Housing stock distribution by region
CREATE TABLE housing_distribution (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    
    stock_count BIGINT NOT NULL,
    market_share_pct DECIMAL(5,2) NOT NULL,
    avg_price DECIMAL(12,2) NOT NULL,
    
    updated_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    UNIQUE KEY unique_housing_distribution (region_id, housing_type_id),
    INDEX idx_housing_distribution_region (region_id)
);

-- Price per square foot data
CREATE TABLE price_per_sqft (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    
    price_per_sqft DECIMAL(8,2) NOT NULL,
    avg_sqft INT NOT NULL,
    sqft_range_min INT,
    sqft_range_max INT,
    
    data_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    UNIQUE KEY unique_price_per_sqft (region_id, housing_type_id, data_date),
    INDEX idx_price_per_sqft_date (data_date)
);

-- ====================================================================
-- 3. TIME SERIES DATA
-- ====================================================================

-- Monthly price trends
CREATE TABLE price_trends (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    
    month DATE NOT NULL,
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
    
    month DATE NOT NULL,
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
    
    month DATE NOT NULL,
    total_listings INT NOT NULL,
    new_listings INT NOT NULL,
    sold_listings INT NOT NULL,
    expired_listings INT NOT NULL,
    avg_list_price DECIMAL(12,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    UNIQUE KEY unique_inventory_data (region_id, housing_type_id, month),
    INDEX idx_inventory_data_month (month)
);

-- Market velocity data
CREATE TABLE market_velocity (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    
    data_date DATE NOT NULL,
    days_on_market INT NOT NULL,
    change_from_prev_month DECIMAL(5,2) DEFAULT 0,
    velocity_index DECIMAL(8,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    UNIQUE KEY unique_market_velocity (region_id, housing_type_id, data_date),
    INDEX idx_market_velocity_date (data_date)
);

-- New vs resale market data
CREATE TABLE new_vs_resale (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    
    data_date DATE NOT NULL,
    new_units INT NOT NULL,
    resale_units INT NOT NULL,
    new_avg_price DECIMAL(12,2) NOT NULL,
    resale_avg_price DECIMAL(12,2) NOT NULL,
    price_premium_pct DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    UNIQUE KEY unique_new_vs_resale (region_id, housing_type_id, data_date),
    INDEX idx_new_vs_resale_date (data_date)
);

-- ====================================================================
-- 4. RENTAL MARKET DATA
-- ====================================================================

-- Rental price trends by bedroom type
CREATE TABLE rental_price_trends (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    bedroom_type_id INT NOT NULL,
    
    month DATE NOT NULL,
    avg_rent DECIMAL(8,2) NOT NULL,
    yoy_growth_pct DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (bedroom_type_id) REFERENCES bedroom_types(id),
    
    UNIQUE KEY unique_rental_trends (region_id, bedroom_type_id, month),
    INDEX idx_rental_trends_month (month)
);

-- Rental market summary data
CREATE TABLE rental_market_summary (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    
    data_date DATE NOT NULL,
    overall_vacancy_pct DECIMAL(4,2) NOT NULL,
    total_pbr_units INT NOT NULL,
    new_pbr_units INT NOT NULL,
    rented_condos INT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    UNIQUE KEY unique_rental_summary (region_id, data_date),
    INDEX idx_rental_summary_date (data_date)
);

-- Vacancy rates by bedroom type
CREATE TABLE vacancy_rates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    bedroom_type_id INT NOT NULL,
    
    data_date DATE NOT NULL,
    vacancy_rate_pct DECIMAL(4,2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (bedroom_type_id) REFERENCES bedroom_types(id),
    
    UNIQUE KEY unique_vacancy_rates (region_id, bedroom_type_id, data_date),
    INDEX idx_vacancy_rates_date (data_date)
);

-- Rental yield analysis
CREATE TABLE rental_yield_analysis (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    bedroom_type_id INT NOT NULL,
    
    data_date DATE NOT NULL,
    avg_rent DECIMAL(8,2) NOT NULL,
    avg_price DECIMAL(12,2) NOT NULL,
    gross_yield_pct DECIMAL(5,2) NOT NULL,
    net_yield_pct DECIMAL(5,2) NOT NULL,
    cap_rate_pct DECIMAL(5,2),
    cash_on_cash_return_pct DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (bedroom_type_id) REFERENCES bedroom_types(id),
    
    UNIQUE KEY unique_rental_yield (region_id, bedroom_type_id, data_date),
    INDEX idx_rental_yield_date (data_date)
);

-- ====================================================================
-- 5. AIRBNB DATA
-- ====================================================================

-- AirBnB market metrics by region
CREATE TABLE airbnb_market_data (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    
    data_date DATE NOT NULL,
    month_label VARCHAR(20) NOT NULL,
    
    -- Core metrics
    average_price DECIMAL(8,2) NOT NULL,
    total_listings INT NOT NULL,
    average_rating DECIMAL(3,2),
    occupancy_rate_pct DECIMAL(5,2),
    new_listings INT,
    review_count INT,
    superhost_percentage DECIMAL(5,2),
    avg_response_time_minutes INT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    UNIQUE KEY unique_airbnb_data (region_id, data_date),
    INDEX idx_airbnb_data_date (data_date)
);

-- AirBnB property type distribution
CREATE TABLE airbnb_property_types (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    data_date DATE NOT NULL,
    
    property_type VARCHAR(50) NOT NULL,
    listing_count INT NOT NULL,
    avg_price DECIMAL(8,2),
    percentage_share DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    INDEX idx_airbnb_prop_types_date (data_date)
);

-- AirBnB price ranges distribution
CREATE TABLE airbnb_price_ranges (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    data_date DATE NOT NULL,
    
    price_range VARCHAR(30) NOT NULL,
    listing_count INT NOT NULL,
    percentage_share DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    INDEX idx_airbnb_price_ranges_date (data_date)
);

-- AirBnB amenity popularity
CREATE TABLE airbnb_amenities (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    data_date DATE NOT NULL,
    
    amenity_name VARCHAR(100) NOT NULL,
    percentage_of_listings DECIMAL(5,2) NOT NULL,
    avg_price_impact DECIMAL(8,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    INDEX idx_airbnb_amenities_date (data_date)
);

-- AirBnB competitive analysis (platforms)
CREATE TABLE airbnb_competitive_analysis (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    data_date DATE NOT NULL,
    
    platform_name VARCHAR(50) NOT NULL,
    average_price DECIMAL(8,2) NOT NULL,
    listing_count INT NOT NULL,
    average_rating DECIMAL(3,2),
    market_share_pct DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    INDEX idx_airbnb_competitive_date (data_date)
);

-- ====================================================================
-- 6. AFFORDABILITY & OWNERSHIP DATA
-- ====================================================================

-- Affordability thresholds by income decile
CREATE TABLE affordability_thresholds (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    decile_id INT NOT NULL,
    
    data_year INT NOT NULL,
    min_income DECIMAL(10,2) NOT NULL,
    max_house_price DECIMAL(12,2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (decile_id) REFERENCES income_deciles(id),
    
    UNIQUE KEY unique_affordability_thresholds (decile_id, data_year),
    INDEX idx_affordability_year (data_year)
);

-- Ownership affordability by decile and region
CREATE TABLE ownership_affordability (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    decile_id INT NOT NULL,
    
    data_year INT NOT NULL,
    affordability_rate_pct DECIMAL(5,2) NOT NULL,
    avg_income DECIMAL(10,2),
    avg_house_price DECIMAL(12,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    FOREIGN KEY (decile_id) REFERENCES income_deciles(id),
    
    UNIQUE KEY unique_ownership_affordability (region_id, housing_type_id, decile_id, data_year),
    INDEX idx_ownership_year (data_year)
);

-- Target performance tracking (ownership, rental, density)
CREATE TABLE performance_targets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    
    data_year INT NOT NULL,
    
    -- Ownership rates
    ownership_rate_actual_pct DECIMAL(5,2),
    ownership_rate_target_pct DECIMAL(5,2),
    
    -- Rental rates  
    rental_rate_actual_pct DECIMAL(5,2),
    rental_rate_target_pct DECIMAL(5,2),
    
    -- Housing density
    density_actual DECIMAL(8,2),
    density_target DECIMAL(8,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    UNIQUE KEY unique_performance_targets (region_id, data_year),
    INDEX idx_performance_targets_year (data_year)
);

-- Homeownership trends over time
CREATE TABLE homeownership_trends (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    
    data_year INT NOT NULL,
    ownership_rate_pct DECIMAL(5,2) NOT NULL,
    target_rate_pct DECIMAL(5,2),
    first_time_buyers_pct DECIMAL(5,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    UNIQUE KEY unique_homeownership_trends (region_id, data_year),
    INDEX idx_homeownership_year (data_year)
);

-- Mortgage stress test data
CREATE TABLE mortgage_stress_test (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    housing_type_id INT NOT NULL,
    
    data_date DATE NOT NULL,
    avg_price DECIMAL(12,2) NOT NULL,
    current_rate_pct DECIMAL(5,2) NOT NULL,
    stress_rate_pct DECIMAL(5,2) NOT NULL,
    current_payment DECIMAL(10,2) NOT NULL,
    stress_payment DECIMAL(10,2) NOT NULL,
    qualifying_income DECIMAL(10,2) NOT NULL,
    stress_qualifying_income DECIMAL(10,2) NOT NULL,
    down_payment_20_pct DECIMAL(12,2) NOT NULL,
    monthly_tax DECIMAL(8,2),
    monthly_insurance DECIMAL(8,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
    
    UNIQUE KEY unique_mortgage_stress (region_id, housing_type_id, data_date),
    INDEX idx_mortgage_stress_date (data_date)
);

-- Interest rate scenarios for sensitivity analysis
CREATE TABLE interest_rate_scenarios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    
    rate_pct DECIMAL(5,2) NOT NULL UNIQUE,
    scenario_label VARCHAR(50) NOT NULL,
    qualifying_multiplier DECIMAL(5,2) NOT NULL,
    description TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_interest_rate (rate_pct)
);

-- ====================================================================
-- 7. MARKET HEALTH & ANALYTICS
-- ====================================================================

-- Price-to-income ratios
CREATE TABLE price_to_income_ratios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    
    data_date DATE NOT NULL,
    ratio_value DECIMAL(6,2) NOT NULL,
    benchmark_ratio DECIMAL(6,2) NOT NULL,
    status VARCHAR(30) NOT NULL,
    trend VARCHAR(20) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    UNIQUE KEY unique_price_income_ratio (region_id, data_date),
    INDEX idx_price_income_date (data_date)
);

-- Market temperature indicators
CREATE TABLE market_temperature (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    
    data_date DATE NOT NULL,
    overall_score INT NOT NULL,
    price_growth_score INT NOT NULL,
    sales_volume_score INT NOT NULL,
    inventory_score INT NOT NULL,
    time_on_market_score INT NOT NULL,
    status VARCHAR(30) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    UNIQUE KEY unique_market_temperature (region_id, data_date),
    INDEX idx_market_temperature_date (data_date)
);

-- Supply and demand metrics
CREATE TABLE supply_demand_metrics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    
    data_date DATE NOT NULL,
    months_of_inventory DECIMAL(4,2) NOT NULL,
    new_listings INT NOT NULL,
    sales_volume INT NOT NULL,
    absorption_rate_pct DECIMAL(5,2) NOT NULL,
    demand_index INT NOT NULL,
    supply_index INT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    UNIQUE KEY unique_supply_demand (region_id, data_date),
    INDEX idx_supply_demand_date (data_date)
);

-- Market risk indicators
CREATE TABLE market_risk_indicators (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    
    data_date DATE NOT NULL,
    overvaluation_level VARCHAR(30) NOT NULL,
    interest_rate_sensitivity VARCHAR(30) NOT NULL,
    speculative_activity VARCHAR(30) NOT NULL,
    household_debt_level VARCHAR(30) NOT NULL,
    overall_risk_level VARCHAR(30) NOT NULL,
    risk_score INT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    UNIQUE KEY unique_market_risk (region_id, data_date),
    INDEX idx_market_risk_date (data_date)
);

-- Market health trends (time series)
CREATE TABLE market_health_trends (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    
    month DATE NOT NULL,
    health_score INT NOT NULL,
    price_growth_pct DECIMAL(5,2) NOT NULL,
    risk_level VARCHAR(30) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    UNIQUE KEY unique_market_health_trends (region_id, month),
    INDEX idx_market_health_month (month)
);

-- Market forecasts and predictions
CREATE TABLE market_forecasts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    
    forecast_date DATE NOT NULL,
    price_growth_next_12_months_pct DECIMAL(5,2) NOT NULL,
    confidence_level VARCHAR(30) NOT NULL,
    outlook VARCHAR(50) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    UNIQUE KEY unique_market_forecasts (region_id, forecast_date),
    INDEX idx_market_forecasts_date (forecast_date)
);

-- Market forecast risk factors
CREATE TABLE market_forecast_risks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    forecast_id BIGINT NOT NULL,
    
    risk_factor VARCHAR(100) NOT NULL,
    impact_level VARCHAR(20) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (forecast_id) REFERENCES market_forecasts(id) ON DELETE CASCADE,
    
    INDEX idx_forecast_risks_forecast (forecast_id)
);

-- Key performance indicators
CREATE TABLE key_performance_indicators (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    region_id INT NOT NULL,
    
    data_date DATE NOT NULL,
    health_score INT NOT NULL,
    risk_score INT NOT NULL,
    opportunity_score INT NOT NULL,
    affordability_score INT NOT NULL,
    sustainability_score INT NOT NULL,
    growth_score INT NOT NULL,
    stability_score INT NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (region_id) REFERENCES regions(id),
    
    UNIQUE KEY unique_kpis (region_id, data_date),
    INDEX idx_kpis_date (data_date)
);

-- ====================================================================
-- 8. VIEWS FOR EASY DATA ACCESS
-- ====================================================================

-- Key metrics view with region/housing type names
CREATE VIEW v_key_metrics AS
SELECT 
    km.*,
    r.name as region_name,
    ht.name as housing_type_name
FROM key_metrics km
JOIN regions r ON km.region_id = r.id
JOIN housing_types ht ON km.housing_type_id = ht.id;

-- Housing distribution view with names
CREATE VIEW v_housing_distribution AS
SELECT 
    hd.*,
    r.name as region_name,
    ht.name as housing_type_name
FROM housing_distribution hd
JOIN regions r ON hd.region_id = r.id
JOIN housing_types ht ON hd.housing_type_id = ht.id;

-- Price trends view with names
CREATE VIEW v_price_trends AS
SELECT 
    pt.*,
    r.name as region_name,
    ht.name as housing_type_name
FROM price_trends pt
JOIN regions r ON pt.region_id = r.id
JOIN housing_types ht ON pt.housing_type_id = ht.id;

-- Rental trends view with names
CREATE VIEW v_rental_price_trends AS
SELECT 
    rpt.*,
    r.name as region_name,
    bt.name as bedroom_type_name
FROM rental_price_trends rpt
JOIN regions r ON rpt.region_id = r.id
JOIN bedroom_types bt ON rpt.bedroom_type_id = bt.id;

-- AirBnB data view with region names
CREATE VIEW v_airbnb_market_data AS
SELECT 
    amd.*,
    r.name as region_name
FROM airbnb_market_data amd
JOIN regions r ON amd.region_id = r.id;

-- Affordability view with all names
CREATE VIEW v_ownership_affordability AS
SELECT 
    oa.*,
    r.name as region_name,
    ht.name as housing_type_name,
    id_table.decile_number,
    id_table.min_income,
    id_table.max_income
FROM ownership_affordability oa
JOIN regions r ON oa.region_id = r.id
JOIN housing_types ht ON oa.housing_type_id = ht.id
JOIN income_deciles id_table ON oa.decile_id = id_table.id;

-- Market health comprehensive view
CREATE VIEW v_market_health AS
SELECT 
    mht.*,
    r.name as region_name,
    mt.overall_score as temperature_overall,
    mt.status as temperature_status,
    mri.risk_score,
    mri.overall_risk_level
FROM market_health_trends mht
JOIN regions r ON mht.region_id = r.id
LEFT JOIN market_temperature mt ON mht.region_id = mt.region_id 
    AND DATE_FORMAT(mht.month, '%Y-%m') = DATE_FORMAT(mt.data_date, '%Y-%m')
LEFT JOIN market_risk_indicators mri ON mht.region_id = mri.region_id 
    AND DATE_FORMAT(mht.month, '%Y-%m') = DATE_FORMAT(mri.data_date, '%Y-%m');

-- ====================================================================
-- 9. INDEXES FOR PERFORMANCE
-- ====================================================================

-- Additional performance indexes
CREATE INDEX idx_all_tables_region_date ON key_metrics(region_id, data_date);
CREATE INDEX idx_all_tables_housing_date ON key_metrics(housing_type_id, data_date);
CREATE INDEX idx_rental_region_bedroom ON rental_price_trends(region_id, bedroom_type_id);
CREATE INDEX idx_airbnb_region_date ON airbnb_market_data(region_id, data_date);
CREATE INDEX idx_affordability_decile_region ON ownership_affordability(decile_id, region_id);
CREATE INDEX idx_market_health_region_month ON market_health_trends(region_id, month);

-- ====================================================================
-- 10. STORED PROCEDURES FOR COMMON OPERATIONS
-- ====================================================================

DELIMITER //

-- Get key metrics for dashboard
CREATE PROCEDURE GetKeyMetrics(
    IN p_region_id INT,
    IN p_housing_type_id INT,
    IN p_date DATE
)
BEGIN
    SELECT * FROM v_key_metrics 
    WHERE region_id = p_region_id 
    AND housing_type_id = p_housing_type_id 
    AND data_date = p_date;
END //

-- Get rental trends for region
CREATE PROCEDURE GetRentalTrends(
    IN p_region_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT * FROM v_rental_price_trends 
    WHERE region_id = p_region_id 
    AND month BETWEEN p_start_date AND p_end_date
    ORDER BY month, bedroom_type_name;
END //

-- Get affordability data for region and decile
CREATE PROCEDURE GetAffordabilityData(
    IN p_region_id INT,
    IN p_decile_number INT,
    IN p_year INT
)
BEGIN
    SELECT * FROM v_ownership_affordability 
    WHERE region_id = p_region_id 
    AND decile_number = p_decile_number 
    AND data_year = p_year;
END //

DELIMITER ;

-- ====================================================================
-- SCHEMA COMPLETE
-- Supports all frontend components:
-- - Main Dashboard (Key Metrics, Price/Sales Trends, Housing Distribution)
-- - AirBnB Tab (Historical data, Property types, Competitive analysis)
-- - Rental Tab (Price trends, Vacancy rates, Yield analysis)
-- - Ownership Tab (Affordability by decile and housing type)
-- - Affordability Tab (Targets, Stress tests, Gap analysis)
-- - Market Health (Temperature, Risk, Forecasts, KPIs)
-- ==================================================================== 