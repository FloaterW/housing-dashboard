-- ====================================================================
-- EXPANDED SEED DATA FOR HOUSING DASHBOARD
-- Comprehensive market data matching frontend requirements
-- ====================================================================

-- Apply the expanded schema first
SOURCE expanded-schema.sql;

-- ====================================================================
-- REFERENCE DATA
-- ====================================================================

-- Metric categories
INSERT INTO metric_categories (name, description) VALUES
('Price Trends', 'Historical price movement data'),
('Market Health', 'Overall market condition indicators'),
('Rental Market', 'Rental property metrics and trends'),
('Affordability', 'Housing affordability analysis'),
('Market Velocity', 'Time on market and sales activity');

-- Bedroom types for rental analysis
INSERT INTO bedroom_types (name, min_bedrooms, max_bedrooms, description) VALUES
('Studio', 0, 0, 'Studio apartments'),
('1-BR', 1, 1, 'One bedroom units'),
('2-BR', 2, 2, 'Two bedroom units'),
('3+-BR', 3, 10, 'Three or more bedrooms');

-- AirBnB property types
INSERT INTO airbnb_property_types (type_name, description) VALUES
('Entire home/apt', 'Entire apartment or house'),
('Private room', 'Private room in shared space'),
('Shared room', 'Shared room with others');

-- Income deciles for affordability analysis
INSERT INTO income_deciles (decile_number, min_household_income, max_household_income, median_household_income, description) VALUES
(1, 0, 25000, 20000, 'Bottom 10% - Very Low Income'),
(2, 25001, 35000, 30000, '2nd Decile - Low Income'),
(3, 35001, 45000, 40000, '3rd Decile - Low-Moderate Income'),
(4, 45001, 55000, 50000, '4th Decile - Moderate Income'),
(5, 55001, 70000, 62500, '5th Decile - Middle Income'),
(6, 70001, 85000, 77500, '6th Decile - Upper-Middle Income'),
(7, 85001, 105000, 95000, '7th Decile - High Income'),
(8, 105001, 130000, 117500, '8th Decile - Higher Income'),
(9, 130001, 175000, 152500, '9th Decile - Very High Income'),
(10, 175001, 500000, 250000, 'Top 10% - Highest Income');

-- Forecast scenarios
INSERT INTO forecast_scenarios (scenario_name, description, confidence_level_pct) VALUES
('Base Case', 'Most likely outcome based on current trends', 70.0),
('Optimistic', 'Favorable economic conditions scenario', 20.0),
('Pessimistic', 'Economic downturn scenario', 10.0);

-- Mortgage scenarios
INSERT INTO mortgage_scenarios (scenario_name, base_rate_pct, stress_test_rate_pct, description) VALUES
('5-Year Fixed', 4.5, 6.5, 'Standard 5-year fixed mortgage'),
('Variable Rate', 4.0, 6.0, 'Variable rate mortgage'),
('High Interest', 6.0, 8.0, 'High interest rate environment'),
('Low Interest', 3.5, 5.5, 'Low interest rate environment');

-- AirBnB amenities
INSERT INTO airbnb_amenities (amenity_name, category) VALUES
('WiFi', 'Basic'),
('Kitchen', 'Basic'),
('Washer', 'Comfort'),
('Air conditioning', 'Comfort'),
('Heating', 'Basic'),
('TV', 'Comfort'),
('Free parking', 'Convenience'),
('Pool', 'Luxury'),
('Hot tub', 'Luxury'),
('Gym', 'Luxury'),
('Workspace', 'Business'),
('BBQ grill', 'Outdoor'),
('Balcony', 'Outdoor'),
('Garden', 'Outdoor');

-- ====================================================================
-- HOUSING TYPE DISTRIBUTION DATA
-- ====================================================================

-- Housing stock distribution by region (matching frontend data)
INSERT INTO housing_distribution (region_id, housing_type_id, total_stock_count, market_share_pct, avg_price) VALUES
-- Peel Region
(1, 2, 245000, 45.2, 1710000), -- Detached
(1, 3, 98000, 18.1, 1080000),  -- Semi-Detached
(1, 4, 125000, 23.1, 980000),  -- Townhouse
(1, 5, 74000, 13.6, 715000),   -- Condo

-- Mississauga
(2, 2, 85000, 38.2, 1850000),  -- Detached
(2, 3, 35000, 15.7, 1180000),  -- Semi-Detached
(2, 4, 52000, 23.4, 1050000),  -- Townhouse
(2, 5, 50000, 22.5, 780000),   -- Condo

-- Brampton
(3, 2, 135000, 52.1, 1620000), -- Detached
(3, 3, 48000, 18.5, 1020000),  -- Semi-Detached
(3, 4, 58000, 22.4, 920000),   -- Townhouse
(3, 5, 18000, 7.0, 650000),    -- Condo

-- Caledon
(4, 2, 25000, 75.8, 1950000),  -- Detached
(4, 3, 15000, 15.2, 1250000),  -- Semi-Detached
(4, 4, 8000, 7.6, 1200000),    -- Townhouse
(4, 5, 2000, 1.9, 875000);     -- Condo

-- ====================================================================
-- HISTORICAL PRICE TRENDS (Jan 2024 - Feb 2025)
-- ====================================================================

-- Generate price trends for each region and housing type
-- Peel Region - Detached homes
INSERT INTO price_trends (region_id, housing_type_id, month, avg_price, median_price, sales_count, mom_change_pct, yoy_change_pct, price_per_sqft) VALUES
(1, 2, '2024-01-01', 1650000, 1625000, 180, 0.0, 8.5, 785),
(1, 2, '2024-02-01', 1655000, 1630000, 165, 0.3, 8.2, 788),
(1, 2, '2024-03-01', 1665000, 1640000, 195, 0.6, 8.0, 792),
(1, 2, '2024-04-01', 1675000, 1650000, 220, 0.6, 7.8, 798),
(1, 2, '2024-05-01', 1685000, 1660000, 240, 0.6, 7.5, 802),
(1, 2, '2024-06-01', 1695000, 1670000, 235, 0.6, 7.3, 806),
(1, 2, '2024-07-01', 1700000, 1675000, 220, 0.3, 7.0, 810),
(1, 2, '2024-08-01', 1705000, 1680000, 200, 0.3, 6.8, 812),
(1, 2, '2024-09-01', 1708000, 1683000, 180, 0.2, 6.5, 814),
(1, 2, '2024-10-01', 1710000, 1685000, 160, 0.1, 6.2, 815),
(1, 2, '2024-11-01', 1708000, 1683000, 140, -0.1, 6.0, 814),
(1, 2, '2024-12-01', 1705000, 1680000, 130, -0.2, 5.8, 812),
(1, 2, '2025-01-01', 1710000, 1685000, 145, 0.3, 5.5, 815),
(1, 2, '2025-02-01', 1715000, 1690000, 160, 0.3, 5.2, 818);

-- Peel Region - Townhouses
INSERT INTO price_trends (region_id, housing_type_id, month, avg_price, median_price, sales_count, mom_change_pct, yoy_change_pct, price_per_sqft) VALUES
(1, 4, '2024-01-01', 945000, 930000, 125, 0.0, 9.2, 680),
(1, 4, '2024-02-01', 950000, 935000, 115, 0.5, 9.0, 685),
(1, 4, '2024-03-01', 955000, 940000, 140, 0.5, 8.8, 688),
(1, 4, '2024-04-01', 962000, 947000, 155, 0.7, 8.5, 692),
(1, 4, '2024-05-01', 968000, 953000, 165, 0.6, 8.3, 696),
(1, 4, '2024-06-01', 975000, 960000, 160, 0.7, 8.0, 700),
(1, 4, '2024-07-01', 978000, 963000, 150, 0.3, 7.8, 702),
(1, 4, '2024-08-01', 980000, 965000, 140, 0.2, 7.5, 704),
(1, 4, '2024-09-01', 982000, 967000, 130, 0.2, 7.3, 705),
(1, 4, '2024-10-01', 983000, 968000, 120, 0.1, 7.0, 706),
(1, 4, '2024-11-01', 981000, 966000, 110, -0.2, 6.8, 704),
(1, 4, '2024-12-01', 978000, 963000, 105, -0.3, 6.5, 702),
(1, 4, '2025-01-01', 980000, 965000, 115, 0.2, 6.2, 704),
(1, 4, '2025-02-01', 985000, 970000, 125, 0.5, 6.0, 708);

-- Similar data for other regions and housing types...
-- (For brevity, showing pattern - would generate for all combinations)

-- ====================================================================
-- MARKET HEALTH INDICATORS
-- ====================================================================

-- Market health data for recent months
INSERT INTO market_health (region_id, date, price_to_income_ratio, market_temperature, price_growth_score, sales_volume_score, inventory_score, time_on_market_score, overall_health_score, market_status, months_of_inventory) VALUES
-- Peel Region
(1, '2024-12-01', 12.8, 78, 85, 72, 65, 68, 74, 'Hot', 2.4),
(1, '2025-01-01', 12.9, 79, 86, 74, 64, 67, 75, 'Hot', 2.3),
(1, '2025-02-01', 13.0, 80, 87, 75, 63, 66, 76, 'Hot', 2.2),

-- Mississauga
(2, '2024-12-01', 13.5, 82, 88, 75, 60, 65, 78, 'Very Hot', 2.1),
(2, '2025-01-01', 13.6, 83, 89, 76, 59, 64, 79, 'Very Hot', 2.0),
(2, '2025-02-01', 13.7, 84, 90, 77, 58, 63, 80, 'Very Hot', 1.9),

-- Brampton
(3, '2024-12-01', 11.9, 74, 80, 78, 70, 72, 75, 'Hot', 2.8),
(3, '2025-01-01', 12.0, 75, 81, 79, 69, 71, 76, 'Hot', 2.7),
(3, '2025-02-01', 12.1, 76, 82, 80, 68, 70, 77, 'Hot', 2.6),

-- Caledon
(4, '2024-12-01', 15.2, 68, 72, 58, 75, 85, 70, 'Warm', 3.5),
(4, '2025-01-01', 15.3, 69, 73, 59, 74, 84, 71, 'Warm', 3.4),
(4, '2025-02-01', 15.4, 70, 74, 60, 73, 83, 72, 'Warm', 3.3);

-- ====================================================================
-- NEW VS RESALE MARKET DATA
-- ====================================================================

INSERT INTO new_vs_resale (region_id, housing_type_id, month, new_units_sold, resale_units_sold, new_avg_price, resale_avg_price, new_price_premium_pct) VALUES
-- Peel Region - February 2025
(1, 2, '2025-02-01', 80, 950, 1850000, 1700000, 8.8), -- Detached
(1, 3, '2025-02-01', 35, 280, 1200000, 1060000, 13.2), -- Semi-Detached
(1, 4, '2025-02-01', 95, 350, 1080000, 960000, 12.5), -- Townhouse
(1, 5, '2025-02-01', 185, 240, 785000, 695000, 12.9), -- Condo

-- Mississauga - February 2025
(2, 2, '2025-02-01', 35, 385, 2050000, 1820000, 12.6), -- Detached
(2, 3, '2025-02-01', 25, 150, 1280000, 1160000, 10.3), -- Semi-Detached
(2, 4, '2025-02-01', 85, 200, 1150000, 1020000, 12.7), -- Townhouse
(2, 5, '2025-02-01', 125, 160, 825000, 755000, 9.3), -- Condo

-- Brampton - February 2025
(3, 2, '2025-02-01', 75, 610, 1720000, 1600000, 7.5), -- Detached
(3, 3, '2025-02-01', 45, 200, 1120000, 1000000, 12.0), -- Semi-Detached
(3, 4, '2025-02-01', 125, 200, 980000, 905000, 8.3), -- Townhouse
(3, 5, '2025-02-01', 45, 60, 715000, 635000, 12.6), -- Condo

-- Caledon - February 2025
(4, 2, '2025-02-01', 15, 130, 2150000, 1925000, 11.7), -- Detached
(4, 3, '2025-02-01', 15, 50, 1350000, 1225000, 10.2), -- Semi-Detached
(4, 4, '2025-02-01', 35, 40, 1250000, 1125000, 11.1), -- Townhouse
(4, 5, '2025-02-01', 15, 20, 950000, 825000, 15.2); -- Condo

-- ====================================================================
-- RENTAL MARKET DATA
-- ====================================================================

-- Rental stock summary for 2024
INSERT INTO rental_stock_summary (region_id, year, overall_vacancy_pct, total_pbr_units, new_pbr_units, rented_condos_count, total_rental_stock) VALUES
(1, 2024, 2.1, 85000, 2500, 38000, 123000), -- Peel Region
(2, 2024, 1.8, 32000, 950, 18000, 50000),   -- Mississauga
(3, 2024, 2.3, 28000, 850, 12000, 40000),   -- Brampton
(4, 2024, 3.2, 8000, 200, 2500, 10500);     -- Caledon

-- Rental metrics by bedroom type (February 2025)
INSERT INTO rental_metrics (region_id, bedroom_type_id, month, avg_rent, median_rent, vacancy_rate_pct, yoy_growth_pct, total_rental_units, available_units) VALUES
-- Peel Region
(1, 1, '2025-02-01', 2100, 2050, 3.2, 7.8, 8500, 272), -- Studio
(1, 2, '2025-02-01', 2295, 2250, 2.5, 7.8, 35000, 875), -- 1-BR
(1, 3, '2025-02-01', 2905, 2850, 1.9, 7.4, 42000, 798), -- 2-BR
(1, 4, '2025-02-01', 3580, 3500, 1.6, 7.0, 28000, 448), -- 3+-BR

-- Mississauga
(2, 1, '2025-02-01', 2250, 2200, 2.8, 8.2, 4200, 118), -- Studio
(2, 2, '2025-02-01', 2450, 2400, 2.1, 8.0, 18000, 378), -- 1-BR
(2, 3, '2025-02-01', 3100, 3050, 1.7, 7.6, 20000, 340), -- 2-BR
(2, 4, '2025-02-01', 3800, 3700, 1.4, 7.2, 12000, 168), -- 3+-BR

-- Brampton
(3, 1, '2025-02-01', 1950, 1900, 3.5, 7.4, 3800, 133), -- Studio
(3, 2, '2025-02-01', 2150, 2100, 2.8, 7.6, 14000, 392), -- 1-BR
(3, 3, '2025-02-01', 2720, 2650, 2.1, 7.2, 18000, 378), -- 2-BR
(3, 4, '2025-02-01', 3380, 3250, 1.8, 6.8, 10000, 180), -- 3+-BR

-- Caledon
(4, 1, '2025-02-01', 1850, 1800, 4.2, 6.8, 500, 21), -- Studio
(4, 2, '2025-02-01', 2050, 2000, 3.8, 7.0, 2800, 106), -- 1-BR
(4, 3, '2025-02-01', 2580, 2500, 3.2, 6.8, 3500, 112), -- 2-BR
(4, 4, '2025-02-01', 3200, 3100, 2.8, 6.5, 2500, 70); -- 3+-BR

-- ====================================================================
-- AIRBNB MARKET DATA
-- ====================================================================

-- AirBnB metrics for February 2025
INSERT INTO airbnb_metrics (region_id, property_type_id, month, total_listings, active_listings, avg_daily_rate, occupancy_rate_pct, avg_monthly_revenue, avg_rating, total_reviews_count) VALUES
-- Peel Region
(1, 1, '2025-02-01', 2850, 2280, 165, 68, 3366, 4.2, 45600), -- Entire home/apt
(1, 2, '2025-02-01', 1250, 1000, 85, 58, 1479, 4.1, 18750), -- Private room
(1, 3, '2025-02-01', 180, 144, 45, 52, 702, 3.9, 2520), -- Shared room

-- Mississauga
(2, 1, '2025-02-01', 1650, 1320, 185, 72, 3996, 4.3, 28350), -- Entire home/apt
(2, 2, '2025-02-01', 720, 576, 95, 62, 1767, 4.2, 12240), -- Private room
(2, 3, '2025-02-01', 95, 76, 55, 55, 906, 4.0, 1425), -- Shared room

-- Brampton
(3, 1, '2025-02-01', 950, 760, 145, 65, 2827, 4.1, 14250), -- Entire home/apt
(3, 2, '2025-02-01', 420, 336, 75, 56, 1260, 4.0, 5880), -- Private room
(3, 3, '2025-02-01', 65, 52, 40, 50, 600, 3.8, 845), -- Shared room

-- Caledon
(4, 1, '2025-02-01', 250, 200, 220, 58, 3828, 4.4, 3750), -- Entire home/apt
(4, 2, '2025-02-01', 110, 88, 120, 52, 1872, 4.2, 1540), -- Private room
(4, 3, '2025-02-01', 20, 16, 65, 45, 877, 4.0, 260); -- Shared room

-- ====================================================================
-- AFFORDABILITY ANALYSIS
-- ====================================================================

-- Affordability thresholds for 2025 (sample data for key deciles and regions)
INSERT INTO affordability_thresholds (region_id, housing_type_id, income_decile_id, year, max_affordable_price, down_payment_required, monthly_payment_limit, affordability_pct) VALUES
-- Peel Region affordability (decile 5 - middle income)
(1, 2, 5, 2025, 350000, 35000, 1750, 12.5), -- Detached
(1, 3, 5, 2025, 525000, 52500, 1750, 38.2), -- Semi-Detached
(1, 4, 5, 2025, 625000, 62500, 1750, 65.8), -- Townhouse
(1, 5, 5, 2025, 750000, 75000, 1750, 89.3), -- Condo

-- Peel Region affordability (decile 8 - higher income)
(1, 2, 8, 2025, 750000, 75000, 3500, 28.4), -- Detached
(1, 3, 8, 2025, 1200000, 120000, 3500, 78.6), -- Semi-Detached
(1, 4, 8, 2025, 1400000, 140000, 3500, 95.2), -- Townhouse
(1, 5, 8, 2025, 1600000, 160000, 3500, 98.7), -- Condo

-- Similar patterns for other regions...
-- (For brevity, showing representative sample)

-- Homeownership trends
INSERT INTO ownership_trends (region_id, year, overall_ownership_rate_pct, first_time_buyer_rate_pct, target_ownership_rate_pct, ownership_gap_pct) VALUES
(1, 2019, 72.5, 28.3, 75.0, 2.5), -- Peel Region
(1, 2020, 71.8, 26.1, 75.0, 3.2),
(1, 2021, 70.9, 24.8, 75.0, 4.1),
(1, 2022, 69.2, 22.5, 75.0, 5.8),
(1, 2023, 67.8, 20.1, 75.0, 7.2),
(1, 2024, 66.5, 18.7, 75.0, 8.5),
(1, 2025, 65.2, 17.3, 75.0, 9.8),

(2, 2024, 64.1, 16.8, 73.0, 8.9), -- Mississauga
(2, 2025, 62.9, 15.4, 73.0, 10.1),

(3, 2024, 68.7, 20.6, 76.0, 7.3), -- Brampton
(3, 2025, 67.4, 19.2, 76.0, 8.6),

(4, 2024, 78.3, 15.2, 80.0, 1.7), -- Caledon
(4, 2025, 77.8, 14.8, 80.0, 2.2);

-- ====================================================================
-- MARKET VELOCITY AND ACTIVITY
-- ====================================================================

INSERT INTO market_velocity (region_id, housing_type_id, month, avg_days_on_market, new_listings_count, sold_listings_count, expired_listings_count, price_reductions_count, list_to_sale_ratio, absorption_rate) VALUES
-- February 2025 data
(1, 2, '2025-02-01', 28, 320, 275, 25, 48, 98.2, 85.9), -- Peel Detached
(1, 4, '2025-02-01', 22, 180, 165, 12, 24, 99.1, 91.7), -- Peel Townhouse
(2, 2, '2025-02-01', 18, 145, 138, 5, 15, 99.8, 95.2), -- Mississauga Detached
(2, 5, '2025-02-01', 15, 95, 92, 2, 8, 100.2, 96.8), -- Mississauga Condo
(3, 2, '2025-02-01', 32, 285, 245, 28, 42, 97.8, 86.0), -- Brampton Detached
(4, 2, '2025-02-01', 45, 65, 48, 12, 8, 96.5, 73.8); -- Caledon Detached