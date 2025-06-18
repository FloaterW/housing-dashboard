-- ====================================================================
-- EXPANDED SEED DATA ONLY (No Schema Changes)
-- ====================================================================

-- Clear existing data from new tables (if any)
-- DELETE FROM price_trends;
-- DELETE FROM market_health;

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

-- Generate price trends for key combinations
INSERT INTO price_trends (region_id, housing_type_id, month, avg_price, median_price, sales_count, mom_change_pct, yoy_change_pct, price_per_sqft) VALUES
-- Peel Region - Detached homes (14 months)
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
(1, 2, '2025-02-01', 1715000, 1690000, 160, 0.3, 5.2, 818),

-- Mississauga - Detached homes
(2, 2, '2024-01-01', 1800000, 1775000, 95, 0.0, 9.2, 895),
(2, 2, '2024-02-01', 1810000, 1785000, 88, 0.6, 9.0, 900),
(2, 2, '2024-03-01', 1820000, 1795000, 105, 0.6, 8.8, 905),
(2, 2, '2024-04-01', 1830000, 1805000, 118, 0.5, 8.5, 910),
(2, 2, '2024-05-01', 1840000, 1815000, 125, 0.5, 8.3, 915),
(2, 2, '2024-06-01', 1845000, 1820000, 122, 0.3, 8.0, 918),
(2, 2, '2024-07-01', 1848000, 1823000, 115, 0.2, 7.8, 920),
(2, 2, '2024-08-01', 1850000, 1825000, 108, 0.1, 7.5, 922),
(2, 2, '2024-09-01', 1851000, 1826000, 95, 0.1, 7.3, 923),
(2, 2, '2024-10-01', 1850000, 1825000, 85, 0.0, 7.0, 922),
(2, 2, '2024-11-01', 1848000, 1823000, 78, -0.1, 6.8, 920),
(2, 2, '2024-12-01', 1845000, 1820000, 72, -0.2, 6.5, 918),
(2, 2, '2025-01-01', 1848000, 1823000, 82, 0.2, 6.2, 920),
(2, 2, '2025-02-01', 1852000, 1827000, 88, 0.2, 6.0, 923);

-- ====================================================================
-- MARKET HEALTH INDICATORS
-- ====================================================================

INSERT INTO market_health (region_id, date, price_to_income_ratio, market_temperature, price_growth_score, sales_volume_score, inventory_score, time_on_market_score, overall_health_score, market_status, months_of_inventory) VALUES
-- Recent 3 months for all regions
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
-- RENTAL MARKET DATA
-- ====================================================================

-- Rental stock summary for 2024
INSERT INTO rental_stock_summary (region_id, year, overall_vacancy_pct, total_pbr_units, new_pbr_units, rented_condos_count, total_rental_stock) VALUES
(1, 2024, 2.1, 85000, 2500, 38000, 123000), -- Peel Region
(2, 2024, 1.8, 32000, 950, 18000, 50000),   -- Mississauga
(3, 2024, 2.3, 28000, 850, 12000, 40000),   -- Brampton
(4, 2024, 3.2, 8000, 200, 2500, 10500);     -- Caledon

-- Sample rental metrics (February 2025)
INSERT INTO rental_metrics (region_id, bedroom_type_id, month, avg_rent, median_rent, vacancy_rate_pct, yoy_growth_pct, total_rental_units, available_units) VALUES
-- Peel Region key bedroom types
(1, 2, '2025-02-01', 2295, 2250, 2.5, 7.8, 35000, 875), -- 1-BR
(1, 3, '2025-02-01', 2905, 2850, 1.9, 7.4, 42000, 798), -- 2-BR

-- Mississauga key bedroom types
(2, 2, '2025-02-01', 2450, 2400, 2.1, 8.0, 18000, 378), -- 1-BR
(2, 3, '2025-02-01', 3100, 3050, 1.7, 7.6, 20000, 340); -- 2-BR