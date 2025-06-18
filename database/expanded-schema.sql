-- ====================================================================
-- EXPANDED HOUSING DASHBOARD DATABASE SCHEMA
-- Comprehensive market analytics matching frontend data requirements
-- ====================================================================

-- Market metrics categories for flexible data storage
CREATE TABLE metric_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historical price trends (monthly data)
CREATE TABLE price_trends (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  housing_type_id INT NOT NULL,
  month DATE NOT NULL, -- First day of month (YYYY-MM-01)
  avg_price DECIMAL(12,2) NOT NULL,
  median_price DECIMAL(12,2),
  min_price DECIMAL(12,2),
  max_price DECIMAL(12,2),
  sales_count INT DEFAULT 0,
  mom_change_pct DECIMAL(5,2), -- Month-over-month % change
  yoy_change_pct DECIMAL(5,2), -- Year-over-year % change
  price_per_sqft DECIMAL(8,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
  INDEX idx_price_trends_region_type_month (region_id, housing_type_id, month),
  UNIQUE KEY unique_price_trend (region_id, housing_type_id, month)
);

-- Market health indicators
CREATE TABLE market_health (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  date DATE NOT NULL,
  price_to_income_ratio DECIMAL(5,2),
  market_temperature TINYINT, -- 0-100 scale
  price_growth_score TINYINT, -- 0-100 scale
  sales_volume_score TINYINT, -- 0-100 scale
  inventory_score TINYINT, -- 0-100 scale
  time_on_market_score TINYINT, -- 0-100 scale
  overall_health_score TINYINT, -- 0-100 scale
  market_status ENUM('Cold', 'Cool', 'Warm', 'Hot', 'Very Hot') DEFAULT 'Warm',
  months_of_inventory DECIMAL(4,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (region_id) REFERENCES regions(id),
  INDEX idx_market_health_region_date (region_id, date),
  UNIQUE KEY unique_market_health (region_id, date)
);

-- Market velocity and activity metrics
CREATE TABLE market_velocity (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  housing_type_id INT NOT NULL,
  month DATE NOT NULL,
  avg_days_on_market INT,
  new_listings_count INT DEFAULT 0,
  sold_listings_count INT DEFAULT 0,
  expired_listings_count INT DEFAULT 0,
  price_reductions_count INT DEFAULT 0,
  list_to_sale_ratio DECIMAL(5,2), -- Sale price / List price
  absorption_rate DECIMAL(5,2), -- Sales / New listings
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
  INDEX idx_market_velocity_region_type_month (region_id, housing_type_id, month),
  UNIQUE KEY unique_market_velocity (region_id, housing_type_id, month)
);

-- Housing type distribution by region
CREATE TABLE housing_distribution (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  housing_type_id INT NOT NULL,
  total_stock_count BIGINT NOT NULL,
  market_share_pct DECIMAL(5,2) NOT NULL,
  avg_price DECIMAL(12,2) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
  INDEX idx_housing_distribution_region (region_id),
  UNIQUE KEY unique_housing_distribution (region_id, housing_type_id)
);

-- New vs Resale market data
CREATE TABLE new_vs_resale (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  housing_type_id INT NOT NULL,
  month DATE NOT NULL,
  new_units_sold INT DEFAULT 0,
  resale_units_sold INT DEFAULT 0,
  new_avg_price DECIMAL(12,2),
  resale_avg_price DECIMAL(12,2),
  new_price_premium_pct DECIMAL(5,2), -- (New - Resale) / Resale * 100
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
  INDEX idx_new_vs_resale_region_type_month (region_id, housing_type_id, month),
  UNIQUE KEY unique_new_vs_resale (region_id, housing_type_id, month)
);

-- ====================================================================
-- RENTAL MARKET TABLES
-- ====================================================================

-- Bedroom type categories
CREATE TABLE bedroom_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE, -- 'Studio', '1-BR', '2-BR', '3+-BR'
  min_bedrooms TINYINT,
  max_bedrooms TINYINT,
  description TEXT
);

-- Rental market metrics
CREATE TABLE rental_metrics (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  bedroom_type_id INT NOT NULL,
  month DATE NOT NULL,
  avg_rent DECIMAL(8,2) NOT NULL,
  median_rent DECIMAL(8,2),
  vacancy_rate_pct DECIMAL(4,2),
  yoy_growth_pct DECIMAL(5,2),
  total_rental_units INT,
  available_units INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (bedroom_type_id) REFERENCES bedroom_types(id),
  INDEX idx_rental_metrics_region_bedroom_month (region_id, bedroom_type_id, month),
  UNIQUE KEY unique_rental_metrics (region_id, bedroom_type_id, month)
);

-- Rental stock summary
CREATE TABLE rental_stock_summary (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  year YEAR NOT NULL,
  overall_vacancy_pct DECIMAL(4,2),
  total_pbr_units BIGINT, -- Purpose Built Rental
  new_pbr_units INT,
  rented_condos_count BIGINT,
  total_rental_stock BIGINT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (region_id) REFERENCES regions(id),
  UNIQUE KEY unique_rental_stock (region_id, year)
);

-- Rental yield analysis (for investment properties)
CREATE TABLE rental_yields (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  housing_type_id INT NOT NULL,
  month DATE NOT NULL,
  avg_property_price DECIMAL(12,2) NOT NULL,
  avg_monthly_rent DECIMAL(8,2) NOT NULL,
  gross_yield_pct DECIMAL(5,2) NOT NULL, -- (Annual rent / Property price) * 100
  net_yield_pct DECIMAL(5,2), -- After expenses
  cap_rate_pct DECIMAL(5,2), -- Net operating income / Property value
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
  INDEX idx_rental_yields_region_type_month (region_id, housing_type_id, month),
  UNIQUE KEY unique_rental_yields (region_id, housing_type_id, month)
);

-- ====================================================================
-- AIRBNB MARKET TABLES
-- ====================================================================

-- AirBnB property types
CREATE TABLE airbnb_property_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type_name VARCHAR(100) NOT NULL UNIQUE, -- 'Entire home/apt', 'Private room', 'Shared room'
  description TEXT
);

-- AirBnB market data
CREATE TABLE airbnb_metrics (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  property_type_id INT NOT NULL,
  month DATE NOT NULL,
  total_listings INT DEFAULT 0,
  active_listings INT DEFAULT 0,
  avg_daily_rate DECIMAL(8,2),
  occupancy_rate_pct DECIMAL(5,2),
  avg_monthly_revenue DECIMAL(10,2),
  avg_rating DECIMAL(3,2), -- 1.00 to 5.00
  total_reviews_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (property_type_id) REFERENCES airbnb_property_types(id),
  INDEX idx_airbnb_metrics_region_type_month (region_id, property_type_id, month),
  UNIQUE KEY unique_airbnb_metrics (region_id, property_type_id, month)
);

-- AirBnB amenities analysis
CREATE TABLE airbnb_amenities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  amenity_name VARCHAR(100) NOT NULL UNIQUE, -- 'WiFi', 'Kitchen', 'Washer', etc.
  category VARCHAR(50) -- 'Basic', 'Comfort', 'Safety', 'Accessibility'
);

-- AirBnB amenity availability by region
CREATE TABLE airbnb_amenity_stats (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  amenity_id INT NOT NULL,
  month DATE NOT NULL,
  listings_with_amenity INT DEFAULT 0,
  total_listings INT DEFAULT 0,
  availability_pct DECIMAL(5,2), -- Calculated: (listings_with / total) * 100
  premium_pct DECIMAL(5,2), -- Price premium for having this amenity
  
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (amenity_id) REFERENCES airbnb_amenities(id),
  INDEX idx_airbnb_amenity_stats_region_month (region_id, month),
  UNIQUE KEY unique_airbnb_amenity_stats (region_id, amenity_id, month)
);

-- ====================================================================
-- AFFORDABILITY ANALYSIS TABLES
-- ====================================================================

-- Income deciles for affordability analysis
CREATE TABLE income_deciles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  decile_number TINYINT NOT NULL UNIQUE, -- 1-10
  min_household_income DECIMAL(12,2) NOT NULL,
  max_household_income DECIMAL(12,2),
  median_household_income DECIMAL(12,2) NOT NULL,
  description VARCHAR(100) -- 'Bottom 10%', 'Top 10%', etc.
);

-- Affordability thresholds by income and region
CREATE TABLE affordability_thresholds (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  housing_type_id INT NOT NULL,
  income_decile_id INT NOT NULL,
  year YEAR NOT NULL,
  max_affordable_price DECIMAL(12,2) NOT NULL,
  down_payment_required DECIMAL(12,2),
  monthly_payment_limit DECIMAL(8,2),
  affordability_pct DECIMAL(5,2), -- % of households in decile that can afford
  
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
  FOREIGN KEY (income_decile_id) REFERENCES income_deciles(id),
  INDEX idx_affordability_region_type_decile (region_id, housing_type_id, income_decile_id),
  UNIQUE KEY unique_affordability (region_id, housing_type_id, income_decile_id, year)
);

-- Homeownership trends and targets
CREATE TABLE ownership_trends (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  year YEAR NOT NULL,
  overall_ownership_rate_pct DECIMAL(5,2) NOT NULL,
  first_time_buyer_rate_pct DECIMAL(5,2),
  target_ownership_rate_pct DECIMAL(5,2),
  ownership_gap_pct DECIMAL(5,2), -- Target - Actual
  
  FOREIGN KEY (region_id) REFERENCES regions(id),
  INDEX idx_ownership_trends_region_year (region_id, year),
  UNIQUE KEY unique_ownership_trends (region_id, year)
);

-- Mortgage stress test scenarios
CREATE TABLE mortgage_scenarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  scenario_name VARCHAR(100) NOT NULL UNIQUE, -- '5-year Fixed', 'Variable Rate', etc.
  base_rate_pct DECIMAL(5,2) NOT NULL,
  stress_test_rate_pct DECIMAL(5,2) NOT NULL,
  description TEXT
);

-- Mortgage affordability under different scenarios
CREATE TABLE mortgage_affordability (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  housing_type_id INT NOT NULL,
  scenario_id INT NOT NULL,
  month DATE NOT NULL,
  avg_property_price DECIMAL(12,2) NOT NULL,
  min_income_required DECIMAL(10,2) NOT NULL,
  monthly_payment DECIMAL(8,2) NOT NULL,
  stress_test_payment DECIMAL(8,2) NOT NULL,
  affordability_index DECIMAL(5,2), -- Higher = more affordable
  
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
  FOREIGN KEY (scenario_id) REFERENCES mortgage_scenarios(id),
  INDEX idx_mortgage_affordability_region_type (region_id, housing_type_id),
  UNIQUE KEY unique_mortgage_affordability (region_id, housing_type_id, scenario_id, month)
);

-- ====================================================================
-- MARKET FORECASTS AND ANALYSIS
-- ====================================================================

-- Forecast scenarios
CREATE TABLE forecast_scenarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  scenario_name VARCHAR(100) NOT NULL UNIQUE, -- 'Base Case', 'Optimistic', 'Pessimistic'
  description TEXT,
  confidence_level_pct DECIMAL(5,2) -- Confidence in this scenario
);

-- Price growth forecasts
CREATE TABLE price_forecasts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  housing_type_id INT NOT NULL,
  scenario_id INT NOT NULL,
  forecast_month DATE NOT NULL,
  predicted_avg_price DECIMAL(12,2) NOT NULL,
  price_growth_yoy_pct DECIMAL(5,2),
  confidence_interval_low DECIMAL(12,2),
  confidence_interval_high DECIMAL(12,2),
  key_assumptions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (housing_type_id) REFERENCES housing_types(id),
  FOREIGN KEY (scenario_id) REFERENCES forecast_scenarios(id),
  INDEX idx_price_forecasts_region_type (region_id, housing_type_id),
  UNIQUE KEY unique_price_forecasts (region_id, housing_type_id, scenario_id, forecast_month)
);

-- Key risks and market indicators
CREATE TABLE market_risks (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  region_id INT NOT NULL,
  risk_category VARCHAR(100) NOT NULL, -- 'Interest Rate', 'Supply', 'Demand', 'Economic'
  risk_description TEXT NOT NULL,
  probability_pct DECIMAL(5,2), -- Likelihood of risk materializing
  impact_score TINYINT, -- 1-10 scale
  mitigation_factors TEXT,
  date_assessed DATE NOT NULL,
  
  FOREIGN KEY (region_id) REFERENCES regions(id),
  INDEX idx_market_risks_region_date (region_id, date_assessed)
);