-- ====================================================================
-- COMPREHENSIVE HOUSING DASHBOARD SEED DATA
-- Populates ALL tables to support every frontend tab and component
-- ====================================================================

USE housing_dashboard;

-- Disable foreign key checks for faster bulk insert
SET FOREIGN_KEY_CHECKS = 0;

-- Clear all existing data
TRUNCATE TABLE key_metrics;
TRUNCATE TABLE housing_distribution;
TRUNCATE TABLE price_per_sqft;
TRUNCATE TABLE price_trends;
TRUNCATE TABLE sales_data;
TRUNCATE TABLE inventory_data;
TRUNCATE TABLE market_velocity;
TRUNCATE TABLE new_vs_resale;
TRUNCATE TABLE rental_price_trends;
TRUNCATE TABLE rental_market_summary;
TRUNCATE TABLE vacancy_rates;
TRUNCATE TABLE rental_yield_analysis;
TRUNCATE TABLE airbnb_market_data;
TRUNCATE TABLE airbnb_property_types;
TRUNCATE TABLE airbnb_price_ranges;
TRUNCATE TABLE airbnb_amenities;
TRUNCATE TABLE airbnb_competitive_analysis;
TRUNCATE TABLE affordability_thresholds;
TRUNCATE TABLE ownership_affordability;
TRUNCATE TABLE performance_targets;
TRUNCATE TABLE homeownership_trends;
TRUNCATE TABLE mortgage_stress_test;
TRUNCATE TABLE interest_rate_scenarios;
TRUNCATE TABLE price_to_income_ratios;
TRUNCATE TABLE market_temperature;
TRUNCATE TABLE supply_demand_metrics;
TRUNCATE TABLE market_risk_indicators;
TRUNCATE TABLE market_health_trends;
TRUNCATE TABLE market_forecasts;
TRUNCATE TABLE market_forecast_risks;
TRUNCATE TABLE key_performance_indicators;
TRUNCATE TABLE bedroom_types;
TRUNCATE TABLE income_deciles;
TRUNCATE TABLE market_status;
TRUNCATE TABLE housing_types;
TRUNCATE TABLE regions;

-- ====================================================================
-- 1. REFERENCE DATA
-- ====================================================================

-- Insert regions
INSERT INTO regions (id, name, code, parent_region_id, population, area_km2) VALUES
(1, 'Peel Region', 'PEEL', NULL, 1381739, 1242.0),
(2, 'Mississauga', 'MISS', 1, 717961, 292.74),
(3, 'Brampton', 'BRAM', 1, 593638, 266.34),
(4, 'Caledon', 'CALE', 1, 66502, 688.02);

-- Insert housing types
INSERT INTO housing_types (id, name, code, description, typical_size_sqft_min, typical_size_sqft_max) VALUES
(1, 'All Types', 'ALL', 'All housing types combined', 0, 10000),
(2, 'Detached', 'DET', 'Single detached houses', 1500, 5000),
(3, 'Semi-Detached', 'SEMI', 'Semi-detached houses', 1000, 2500),
(4, 'Townhouse', 'TOWN', 'Townhouses and row houses', 900, 2000),
(5, 'Condo', 'COND', 'Condominiums and apartments', 400, 1500);

-- Insert bedroom types for rental data
INSERT INTO bedroom_types (id, name, code, description) VALUES
(1, 'Studio', 'STUDIO', 'Studio apartments'),
(2, '1-BR', '1BR', 'One bedroom units'),
(3, '2-BR', '2BR', 'Two bedroom units'),
(4, '3+-BR', '3BR', 'Three or more bedroom units');

-- Insert income deciles
INSERT INTO income_deciles (id, decile_number, min_income, max_income, description) VALUES
(1, 1, 0, 35000, 'Lowest income decile'),
(2, 2, 35001, 45000, 'Second income decile'),
(3, 3, 45001, 55000, 'Third income decile'),
(4, 4, 55001, 65000, 'Fourth income decile'),
(5, 5, 65001, 75000, 'Fifth income decile'),
(6, 6, 75001, 85000, 'Sixth income decile'),
(7, 7, 85001, 95000, 'Seventh income decile'),
(8, 8, 95001, 110000, 'Eighth income decile'),
(9, 9, 110001, 130000, 'Ninth income decile'),
(10, 10, 130001, NULL, 'Highest income decile');

-- Insert market status
INSERT INTO market_status (id, name, code, description) VALUES
(1, 'Active', 'ACT', 'Currently active listings'),
(2, 'Sold', 'SLD', 'Successfully sold properties'),
(3, 'Expired', 'EXP', 'Expired listings'),
(4, 'Pending', 'PND', 'Sale pending completion');

-- ====================================================================
-- 2. KEY METRICS (Main Dashboard)
-- ====================================================================

-- Key metrics for all region/housing type combinations (current month)
INSERT INTO key_metrics (region_id, housing_type_id, data_date, avg_price, price_change_pct, total_sales, sales_change_pct, avg_days_on_market, days_change_pct, inventory_count, inventory_change_pct) VALUES
-- Peel Region
(1, 1, '2025-06-01', 1245000, 8.5, 1400, 12.5, 21, -8.2, 3500, -5.2),
(1, 2, '2025-06-01', 1710000, 9.2, 420, 15.8, 24, -12.5, 1200, -8.1),
(1, 3, '2025-06-01', 1080000, 7.8, 385, 8.9, 19, -5.2, 900, -3.8),
(1, 4, '2025-06-01', 980000, 6.5, 440, 11.2, 18, -6.8, 800, -4.2),
(1, 5, '2025-06-01', 715000, 5.8, 240, 6.5, 15, -2.5, 600, -1.8),

-- Mississauga
(2, 1, '2025-06-01', 1350000, 8.8, 700, 14.2, 18, -10.5, 1850, -6.8),
(2, 2, '2025-06-01', 1850000, 9.5, 185, 18.2, 22, -15.2, 520, -9.2),
(2, 3, '2025-06-01', 1180000, 8.1, 150, 12.5, 17, -8.8, 380, -5.2),
(2, 4, '2025-06-01', 1050000, 7.2, 200, 15.8, 16, -9.2, 420, -6.5),
(2, 5, '2025-06-01', 780000, 6.8, 160, 8.5, 14, -4.2, 530, -3.8),

-- Brampton
(3, 1, '2025-06-01', 1150000, 8.2, 465, 10.8, 22, -6.5, 1280, -3.5),
(3, 2, '2025-06-01', 1620000, 8.8, 185, 12.5, 25, -8.2, 420, -5.8),
(3, 3, '2025-06-01', 1020000, 7.5, 140, 6.8, 20, -4.2, 320, -2.5),
(3, 4, '2025-06-01', 920000, 6.2, 165, 8.5, 19, -5.5, 280, -3.2),
(3, 5, '2025-06-01', 650000, 5.2, 60, 4.8, 16, -1.8, 160, -1.2),

-- Caledon
(4, 1, '2025-06-01', 1650000, 7.5, 95, 8.2, 35, -2.8, 485, 2.5),
(4, 2, '2025-06-01', 1950000, 8.2, 50, 12.5, 38, -5.2, 180, -1.5),
(4, 3, '2025-06-01', 1250000, 6.8, 15, 5.8, 32, -2.2, 85, 1.8),
(4, 4, '2025-06-01', 1150000, 6.2, 25, 6.8, 30, -1.8, 120, 2.2),
(4, 5, '2025-06-01', 850000, 5.5, 5, 2.5, 28, -0.8, 100, 3.5);

-- ====================================================================
-- 3. HOUSING DISTRIBUTION
-- ====================================================================

INSERT INTO housing_distribution (region_id, housing_type_id, stock_count, market_share_pct, avg_price, updated_date) VALUES
-- Peel Region
(1, 2, 245000, 45.2, 1710000, '2025-06-01'),
(1, 3, 98000, 18.1, 1080000, '2025-06-01'),
(1, 4, 125000, 23.1, 980000, '2025-06-01'),
(1, 5, 74000, 13.6, 715000, '2025-06-01'),

-- Mississauga
(2, 2, 85000, 38.2, 1850000, '2025-06-01'),
(2, 3, 35000, 15.7, 1180000, '2025-06-01'),
(2, 4, 52000, 23.4, 1050000, '2025-06-01'),
(2, 5, 50000, 22.5, 780000, '2025-06-01'),

-- Brampton
(3, 2, 135000, 52.1, 1620000, '2025-06-01'),
(3, 3, 48000, 18.5, 1020000, '2025-06-01'),
(3, 4, 58000, 22.4, 920000, '2025-06-01'),
(3, 5, 18000, 7.0, 650000, '2025-06-01'),

-- Caledon
(4, 2, 25000, 75.8, 1950000, '2025-06-01'),
(4, 3, 3000, 9.1, 1250000, '2025-06-01'),
(4, 4, 4500, 13.6, 1150000, '2025-06-01'),
(4, 5, 500, 1.5, 850000, '2025-06-01');

-- ====================================================================
-- 4. PRICE PER SQFT DATA
-- ====================================================================

INSERT INTO price_per_sqft (region_id, housing_type_id, price_per_sqft, avg_sqft, sqft_range_min, sqft_range_max, data_date) VALUES
-- Peel Region
(1, 1, 545, 2285, 400, 5000, '2025-06-01'),
(1, 2, 598, 2860, 1500, 5000, '2025-06-01'),
(1, 3, 695, 1555, 1000, 2500, '2025-06-01'),
(1, 4, 712, 1378, 900, 2000, '2025-06-01'),
(1, 5, 826, 866, 400, 1500, '2025-06-01'),

-- Mississauga  
(2, 1, 585, 2308, 400, 5000, '2025-06-01'),
(2, 2, 628, 2945, 1500, 5000, '2025-06-01'),
(2, 3, 748, 1578, 1000, 2500, '2025-06-01'),
(2, 4, 765, 1373, 900, 2000, '2025-06-01'),
(2, 5, 895, 872, 400, 1500, '2025-06-01'),

-- Brampton
(3, 1, 512, 2246, 400, 5000, '2025-06-01'),
(3, 2, 568, 2852, 1500, 5000, '2025-06-01'),
(3, 3, 652, 1564, 1000, 2500, '2025-06-01'),
(3, 4, 675, 1363, 900, 2000, '2025-06-01'),
(3, 5, 758, 858, 400, 1500, '2025-06-01'),

-- Caledon
(4, 1, 598, 2758, 400, 5000, '2025-06-01'),
(4, 2, 645, 3023, 1500, 5000, '2025-06-01'),
(4, 3, 785, 1592, 1000, 2500, '2025-06-01'),
(4, 4, 812, 1416, 900, 2000, '2025-06-01'),
(4, 5, 925, 919, 400, 1500, '2025-06-01');

-- ====================================================================
-- 5. RENTAL MARKET DATA
-- ====================================================================

-- Rental market summary for 2024/2025
INSERT INTO rental_market_summary (region_id, data_date, overall_vacancy_pct, total_pbr_units, new_pbr_units, rented_condos) VALUES
(1, '2025-06-01', 2.1, 85000, 2500, 38000),
(2, '2025-06-01', 1.8, 35000, 950, 18000),
(3, '2025-06-01', 2.3, 32000, 1200, 12000),
(4, '2025-06-01', 3.2, 18000, 350, 8000);

-- Vacancy rates by bedroom type (current)
INSERT INTO vacancy_rates (region_id, bedroom_type_id, data_date, vacancy_rate_pct) VALUES
-- Peel Region
(1, 1, '2025-06-01', 3.2),
(1, 2, '2025-06-01', 2.5),
(1, 3, '2025-06-01', 1.9),
(1, 4, '2025-06-01', 1.6),

-- Mississauga
(2, 1, '2025-06-01', 2.8),
(2, 2, '2025-06-01', 2.1),
(2, 3, '2025-06-01', 1.6),
(2, 4, '2025-06-01', 1.3),

-- Brampton
(3, 1, '2025-06-01', 3.5),
(3, 2, '2025-06-01', 2.8),
(3, 3, '2025-06-01', 2.1),
(3, 4, '2025-06-01', 1.8),

-- Caledon
(4, 1, '2025-06-01', 4.2),
(4, 2, '2025-06-01', 3.5),
(4, 3, '2025-06-01', 2.8),
(4, 4, '2025-06-01', 2.2);

-- Rental yield analysis (current)
INSERT INTO rental_yield_analysis (region_id, bedroom_type_id, data_date, avg_rent, avg_price, gross_yield_pct, net_yield_pct, cap_rate_pct, cash_on_cash_return_pct) VALUES
-- Peel Region
(1, 2, '2025-06-01', 2295, 600000, 4.6, 3.2, 3.8, 6.5),
(1, 3, '2025-06-01', 2910, 750000, 4.6, 3.3, 3.9, 6.8),
(1, 4, '2025-06-01', 3525, 950000, 4.5, 3.1, 3.7, 6.2),

-- Mississauga
(2, 2, '2025-06-01', 2510, 680000, 4.4, 3.0, 3.6, 5.8),
(2, 3, '2025-06-01', 3175, 850000, 4.5, 3.1, 3.7, 6.2),
(2, 4, '2025-06-01', 3990, 1100000, 4.4, 3.0, 3.6, 5.9),

-- Brampton
(3, 2, '2025-06-01', 2145, 520000, 4.9, 3.5, 4.1, 7.2),
(3, 3, '2025-06-01', 2710, 650000, 5.0, 3.6, 4.2, 7.5),
(3, 4, '2025-06-01', 3160, 800000, 4.7, 3.3, 3.9, 6.8),

-- Caledon
(4, 2, '2025-06-01', 2595, 750000, 4.2, 2.8, 3.4, 5.5),
(4, 3, '2025-06-01', 3260, 950000, 4.1, 2.7, 3.3, 5.2),
(4, 4, '2025-06-01', 4125, 1200000, 4.1, 2.7, 3.3, 5.1);

-- ====================================================================
-- 6. AIRBNB DATA
-- ====================================================================

-- AirBnB market data (last 6 months sample)
INSERT INTO airbnb_market_data (region_id, data_date, month_label, average_price, total_listings, average_rating, occupancy_rate_pct, new_listings, review_count, superhost_percentage, avg_response_time_minutes) VALUES
-- Recent months for all regions
(1, '2025-01-01', 'Jan 2025', 185, 650, 4.2, 68, 25, 420, 28, 45),
(1, '2025-02-01', 'Feb 2025', 192, 685, 4.3, 71, 35, 485, 29, 42),
(1, '2025-03-01', 'Mar 2025', 198, 710, 4.3, 74, 28, 520, 31, 38),
(1, '2025-04-01', 'Apr 2025', 205, 745, 4.4, 76, 35, 565, 32, 35),
(1, '2025-05-01', 'May 2025', 212, 780, 4.4, 78, 42, 595, 33, 33),
(1, '2025-06-01', 'Jun 2025', 218, 815, 4.5, 81, 38, 630, 35, 30),

(2, '2025-01-01', 'Jan 2025', 205, 285, 4.3, 72, 12, 185, 31, 38),
(2, '2025-02-01', 'Feb 2025', 215, 305, 4.4, 75, 18, 210, 32, 35),
(2, '2025-03-01', 'Mar 2025', 225, 320, 4.4, 78, 15, 235, 34, 32),
(2, '2025-04-01', 'Apr 2025', 235, 340, 4.5, 80, 20, 260, 35, 28),
(2, '2025-05-01', 'May 2025', 245, 365, 4.5, 82, 25, 285, 36, 25),
(2, '2025-06-01', 'Jun 2025', 255, 385, 4.6, 85, 22, 310, 38, 22),

(3, '2025-01-01', 'Jan 2025', 168, 245, 4.1, 65, 8, 165, 25, 52),
(3, '2025-02-01', 'Feb 2025', 175, 260, 4.2, 68, 12, 185, 26, 48),
(3, '2025-03-01', 'Mar 2025', 182, 275, 4.2, 71, 10, 205, 28, 45),
(3, '2025-04-01', 'Apr 2025', 189, 290, 4.3, 73, 15, 225, 29, 42),
(3, '2025-05-01', 'May 2025', 196, 310, 4.3, 75, 18, 245, 30, 38),
(3, '2025-06-01', 'Jun 2025', 203, 325, 4.4, 78, 15, 265, 32, 35),

(4, '2025-01-01', 'Jan 2025', 245, 120, 4.4, 58, 5, 70, 35, 85),
(4, '2025-02-01', 'Feb 2025', 255, 125, 4.5, 61, 8, 78, 36, 82),
(4, '2025-03-01', 'Mar 2025', 265, 130, 4.5, 64, 6, 85, 38, 78),
(4, '2025-04-01', 'Apr 2025', 275, 138, 4.6, 67, 10, 92, 39, 75),
(4, '2025-05-01', 'May 2025', 285, 145, 4.6, 69, 12, 98, 41, 72),
(4, '2025-06-01', 'Jun 2025', 295, 152, 4.7, 72, 9, 105, 42, 68);

-- ====================================================================
-- 7. AFFORDABILITY DATA
-- ====================================================================

-- Affordability thresholds by decile for 2024
INSERT INTO affordability_thresholds (decile_id, data_year, min_income, max_house_price) VALUES
(1, 2024, 35000, 150000),
(2, 2024, 45000, 200000),
(3, 2024, 55000, 250000),
(4, 2024, 65000, 300000),
(5, 2024, 75000, 350000),
(6, 2024, 85000, 425000),
(7, 2024, 95000, 500000),
(8, 2024, 110000, 600000),
(9, 2024, 130000, 750000),
(10, 2024, 160000, 950000);

-- Interest rate scenarios
INSERT INTO interest_rate_scenarios (rate_pct, scenario_label, qualifying_multiplier, description) VALUES
(4.0, 'Historic Low', 0.85, 'Historically low interest rate environment'),
(5.25, 'Current Rate', 1.0, 'Current market interest rate'),
(6.0, 'Moderate Increase', 1.12, 'Moderate interest rate increase'),
(7.25, 'Stress Test Rate', 1.26, 'Bank of Canada stress test rate'),
(8.0, 'High Rate', 1.35, 'High interest rate scenario'),
(9.0, 'Crisis Scenario', 1.48, 'Economic crisis interest rate scenario');

-- Performance targets for recent years
INSERT INTO performance_targets (region_id, data_year, ownership_rate_actual_pct, ownership_rate_target_pct, rental_rate_actual_pct, rental_rate_target_pct, density_actual, density_target) VALUES
(1, 2022, 69.8, 72.0, 30.2, 28.0, 54.4, 58.0),
(1, 2023, 70.1, 72.5, 29.9, 27.5, 56.7, 60.0),
(1, 2024, 70.4, 73.0, 29.6, 27.0, 59.0, 62.0),

(2, 2022, 67.2, 73.5, 32.8, 26.5, 52.1, 56.0),
(2, 2023, 65.8, 74.0, 34.2, 26.0, 54.4, 58.0),
(2, 2024, 64.5, 74.5, 35.5, 25.5, 56.7, 60.0),

(3, 2022, 71.9, 76.0, 28.1, 24.0, 56.7, 60.0),
(3, 2023, 70.8, 76.5, 29.2, 23.5, 59.0, 62.0),
(3, 2024, 69.9, 77.0, 30.1, 23.0, 61.3, 64.0),

(4, 2022, 75.1, 79.5, 24.9, 20.5, 48.4, 52.0),
(4, 2023, 73.6, 80.0, 26.4, 20.0, 50.7, 54.0),
(4, 2024, 72.3, 80.5, 27.7, 19.5, 53.0, 56.0);

-- ====================================================================
-- 8. MARKET HEALTH DATA
-- ====================================================================

-- Price-to-income ratios (current)
INSERT INTO price_to_income_ratios (region_id, data_date, ratio_value, benchmark_ratio, status, trend) VALUES
(1, '2025-06-01', 12.8, 10.0, 'Overvalued', 'Rising'),
(2, '2025-06-01', 13.5, 10.0, 'Overvalued', 'Rising'),
(3, '2025-06-01', 11.9, 10.0, 'Overvalued', 'Stable'),
(4, '2025-06-01', 15.2, 10.0, 'Severely Overvalued', 'Rising');

-- Market temperature (current)
INSERT INTO market_temperature (region_id, data_date, overall_score, price_growth_score, sales_volume_score, inventory_score, time_on_market_score, status) VALUES
(1, '2025-06-01', 78, 85, 72, 65, 68, 'Hot'),
(2, '2025-06-01', 82, 88, 75, 60, 65, 'Very Hot'),
(3, '2025-06-01', 74, 80, 78, 70, 72, 'Hot'),
(4, '2025-06-01', 68, 72, 58, 75, 85, 'Warm');

-- Market risk indicators (current)
INSERT INTO market_risk_indicators (region_id, data_date, overvaluation_level, interest_rate_sensitivity, speculative_activity, household_debt_level, overall_risk_level, risk_score) VALUES
(1, '2025-06-01', 'High', 'Very High', 'Moderate', 'High', 'High', 78),
(2, '2025-06-01', 'Very High', 'Very High', 'High', 'Very High', 'Very High', 85),
(3, '2025-06-01', 'High', 'High', 'Moderate', 'High', 'High', 74),
(4, '2025-06-01', 'Very High', 'High', 'Low', 'Moderate', 'Moderate', 68);

-- Key performance indicators (current)
INSERT INTO key_performance_indicators (region_id, data_date, health_score, risk_score, opportunity_score, affordability_score, sustainability_score, growth_score, stability_score) VALUES
(1, '2025-06-01', 78, 78, 72, 32, 45, 88, 61),
(2, '2025-06-01', 82, 85, 68, 28, 42, 92, 58),
(3, '2025-06-01', 74, 74, 76, 36, 48, 85, 65),
(4, '2025-06-01', 68, 68, 70, 25, 52, 68, 72);

-- Market forecasts (current)
INSERT INTO market_forecasts (region_id, forecast_date, price_growth_next_12_months_pct, confidence_level, outlook) VALUES
(1, '2025-06-01', 8.5, 'Moderate', 'Cautiously Optimistic'),
(2, '2025-06-01', 7.2, 'Low', 'Concerning'),
(3, '2025-06-01', 9.1, 'Moderate', 'Positive'),
(4, '2025-06-01', 6.8, 'High', 'Stable');

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- VERIFICATION QUERIES
-- ====================================================================

-- Count records in key tables
SELECT 'key_metrics' as table_name, COUNT(*) as record_count FROM key_metrics
UNION ALL
SELECT 'housing_distribution', COUNT(*) FROM housing_distribution
UNION ALL
SELECT 'rental_market_summary', COUNT(*) FROM rental_market_summary
UNION ALL
SELECT 'airbnb_market_data', COUNT(*) FROM airbnb_market_data
UNION ALL
SELECT 'affordability_thresholds', COUNT(*) FROM affordability_thresholds
UNION ALL
SELECT 'market_temperature', COUNT(*) FROM market_temperature;

-- Sample key metrics data
SELECT r.name as region, ht.name as housing_type, km.avg_price, km.total_sales, km.avg_days_on_market
FROM key_metrics km
JOIN regions r ON km.region_id = r.id
JOIN housing_types ht ON km.housing_type_id = ht.id
WHERE km.data_date = '2025-06-01'
ORDER BY r.name, ht.name;

-- Database seeding completed successfully! 