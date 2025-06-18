-- Seed data for Housing Dashboard MySQL Database
-- Initial data to populate lookup tables and sample records

USE housing_dashboard;

-- ====================================================================
-- 1. POPULATE LOOKUP TABLES
-- ====================================================================

-- Insert regions
INSERT INTO regions (name, code, parent_region_id, population, area_km2) VALUES
('Peel Region', 'PEEL', NULL, 1400000, 1241.99),
('Mississauga', 'MISS', 1, 750000, 292.74),
('Brampton', 'BRAM', 1, 650000, 266.34),
('Caledon', 'CALD', 1, 70000, 688.14);

-- Insert housing types
INSERT INTO housing_types (name, code, description, typical_size_sqft_min, typical_size_sqft_max) VALUES
('All Types', 'ALL', 'All housing types combined', 500, 5000),
('Detached', 'DET', 'Single-family detached homes', 1500, 4000),
('Semi-Detached', 'SEMI', 'Semi-detached homes', 1200, 2500),
('Townhouse', 'TOWN', 'Townhouse/row homes', 1000, 2000),
('Condo', 'CONDO', 'Condominium apartments', 500, 1500);

-- Insert market status options
INSERT INTO market_status (name, code, description) VALUES
('Active', 'ACT', 'Currently listed and available'),
('Pending', 'PEN', 'Sale pending, under contract'),
('Sold', 'SLD', 'Successfully sold'),
('Expired', 'EXP', 'Listing expired without sale'),
('Withdrawn', 'WTD', 'Withdrawn from market');

-- Insert data sources
INSERT INTO data_sources (source_name, source_type, update_frequency, is_active) VALUES
('MLS Data Feed', 'API', 'Daily', TRUE),
('AirBnB Scraper', 'SCRAPER', 'Weekly', TRUE),
('Manual Entry', 'MANUAL', 'As Needed', TRUE),
('Government Statistics', 'IMPORT', 'Monthly', TRUE);

-- ====================================================================
-- 2. SAMPLE PROPERTY SALES DATA
-- ====================================================================

-- Sample property sales for last 14 months (Feb 2024 - Feb 2025)
INSERT INTO property_sales (
    region_id, housing_type_id, sale_date, sale_price, list_price, 
    price_per_sqft, size_sqft, bedrooms, bathrooms, days_on_market,
    list_date, is_new_construction, latitude, longitude, postal_code
) VALUES
-- Mississauga Detached Homes
(2, 2, '2025-02-15', 1760000, 1799000, 742, 2372, 4, 3.5, 18, '2025-01-28', FALSE, 43.5890, -79.6441, 'L5B 3Y4'),
(2, 2, '2025-02-10', 1820000, 1850000, 758, 2401, 4, 3.0, 25, '2025-01-16', FALSE, 43.5952, -79.6361, 'L5M 4Z5'),
(2, 2, '2025-02-08', 1680000, 1699000, 715, 2350, 3, 2.5, 12, '2025-01-27', FALSE, 43.6089, -79.6583, 'L5L 5V8'),
(2, 2, '2025-01-28', 1925000, 1980000, 785, 2452, 5, 4.0, 31, '2024-12-28', FALSE, 43.5847, -79.6152, 'L5N 2X7'),
(2, 2, '2025-01-25', 2150000, 2199000, 823, 2612, 5, 4.5, 22, '2025-01-03', TRUE, 43.5783, -79.6289, 'L5B 1M4'),

-- Mississauga Condos
(2, 5, '2025-02-12', 780000, 789000, 976, 799, 2, 2.0, 15, '2025-01-28', FALSE, 43.5942, -79.6431, 'L5B 4M2'),
(2, 5, '2025-02-09', 715000, 729000, 894, 800, 1, 1.0, 8, '2025-02-01', FALSE, 43.6014, -79.6519, 'L5R 3K8'),
(2, 5, '2025-02-05', 825000, 839000, 1031, 800, 2, 2.0, 19, '2025-01-17', FALSE, 43.5896, -79.6397, 'L5M 6P3'),
(2, 5, '2025-01-30', 695000, 710000, 869, 800, 1, 1.0, 28, '2025-01-02', FALSE, 43.6089, -79.6447, 'L5B 2H7'),
(2, 5, '2025-01-22', 890000, 899000, 1112, 800, 3, 2.0, 11, '2025-01-11', TRUE, 43.5756, -79.6198, 'L5N 8R4'),

-- Brampton Detached Homes
(3, 2, '2025-02-14', 1620000, 1649000, 649, 2495, 4, 3.5, 21, '2025-01-24', FALSE, 43.7315, -79.7624, 'L6Y 4H3'),
(3, 2, '2025-02-11', 1585000, 1599000, 635, 2495, 4, 3.0, 16, '2025-01-26', FALSE, 43.7182, -79.7751, 'L6X 1M8'),
(3, 2, '2025-02-07', 1750000, 1789000, 701, 2495, 5, 4.0, 29, '2025-01-09', FALSE, 43.7456, -79.7389, 'L6Z 2K9'),
(3, 2, '2025-01-29', 1520000, 1545000, 609, 2495, 3, 2.5, 18, '2025-01-11', FALSE, 43.7289, -79.7512, 'L6V 3R7'),
(3, 2, '2025-01-26', 1680000, 1699000, 673, 2495, 4, 3.5, 14, '2025-01-12', TRUE, 43.7398, -79.7445, 'L6P 1S4'),

-- Brampton Townhouses
(3, 4, '2025-02-13', 920000, 939000, 690, 1333, 3, 2.5, 12, '2025-02-01', FALSE, 43.7234, -79.7589, 'L6Y 0M3'),
(3, 4, '2025-02-06', 965000, 979000, 724, 1333, 3, 2.5, 25, '2025-01-12', FALSE, 43.7412, -79.7298, 'L6Z 4K8'),
(3, 4, '2025-01-31', 885000, 899000, 664, 1333, 3, 2.0, 19, '2025-01-12', FALSE, 43.7156, -79.7623, 'L6X 5H2'),
(3, 4, '2025-01-28', 1025000, 1049000, 769, 1333, 4, 3.0, 22, '2025-01-06', TRUE, 43.7345, -79.7467, 'L6P 2R8'),
(3, 4, '2025-01-24', 895000, 905000, 671, 1333, 3, 2.5, 8, '2025-01-16', FALSE, 43.7289, -79.7556, 'L6V 1K5'),

-- Caledon Detached Homes
(4, 2, '2025-02-10', 1950000, 1995000, 782, 2495, 5, 4.0, 35, '2025-01-06', FALSE, 43.8554, -79.8711, 'L7E 2M8'),
(4, 2, '2025-02-02', 2100000, 2150000, 842, 2495, 5, 4.5, 28, '2025-01-05', FALSE, 43.8623, -79.8598, 'L7E 4K3'),
(4, 2, '2025-01-25', 1825000, 1869000, 731, 2495, 4, 3.5, 41, '2024-12-15', FALSE, 43.8456, -79.8789, 'L7C 1R7'),
(4, 2, '2025-01-20', 2250000, 2299000, 902, 2495, 6, 5.0, 31, '2024-12-20', TRUE, 43.8678, -79.8634, 'L7E 1P5'),
(4, 2, '2025-01-15', 1780000, 1799000, 713, 2495, 4, 3.0, 26, '2024-12-20', FALSE, 43.8512, -79.8745, 'L7C 3M2');

-- ====================================================================
-- 3. ACTIVE LISTINGS SAMPLE DATA
-- ====================================================================

INSERT INTO active_listings (
    region_id, housing_type_id, status_id, list_price, price_per_sqft,
    size_sqft, bedrooms, bathrooms, list_date, is_new_construction,
    latitude, longitude, postal_code
) VALUES
-- Currently Active Listings
(2, 2, 1, 1899000, 761, 2495, 4, 3.5, '2025-02-10', FALSE, 43.5923, -79.6478, 'L5M 5K9'),
(2, 2, 1, 2150000, 862, 2495, 5, 4.0, '2025-02-08', TRUE, 43.5834, -79.6234, 'L5N 7R3'),
(2, 5, 1, 795000, 994, 800, 2, 2.0, '2025-02-12', FALSE, 43.5978, -79.6456, 'L5B 8M4'),
(2, 5, 1, 849000, 1061, 800, 2, 2.0, '2025-02-05', FALSE, 43.6012, -79.6398, 'L5R 2L7'),

(3, 2, 1, 1649000, 661, 2495, 4, 3.5, '2025-02-09', FALSE, 43.7298, -79.7567, 'L6V 4H8'),
(3, 2, 1, 1789000, 717, 2495, 5, 4.0, '2025-02-07', FALSE, 43.7423, -79.7334, 'L6Z 1M9'),
(3, 4, 1, 939000, 704, 1333, 3, 2.5, '2025-02-11', FALSE, 43.7267, -79.7612, 'L6Y 3K2'),
(3, 5, 1, 689000, 861, 800, 2, 1.0, '2025-02-10', FALSE, 43.7189, -79.7598, 'L6X 2R5'),

(4, 2, 1, 2199000, 881, 2495, 5, 4.5, '2025-02-01', TRUE, 43.8645, -79.8623, 'L7E 5P8'),
(4, 2, 1, 1995000, 800, 2495, 4, 3.5, '2025-01-28', FALSE, 43.8534, -79.8756, 'L7C 2K4'),

-- Pending Sales
(2, 2, 2, 1799000, 721, 2495, 4, 3.0, '2025-01-25', FALSE, 43.5912, -79.6512, 'L5M 3H7'),
(3, 4, 2, 925000, 694, 1333, 3, 2.5, '2025-01-30', FALSE, 43.7345, -79.7445, 'L6P 5K9');

-- ====================================================================
-- 4. RENTAL DATA SAMPLE
-- ====================================================================

INSERT INTO rental_data (
    region_id, housing_type_id, monthly_rent, rent_per_sqft, size_sqft,
    bedrooms, bathrooms, lease_start_date, lease_term_months,
    is_furnished, includes_utilities, listing_date, rented_date,
    days_to_rent, latitude, longitude, postal_code
) VALUES
-- Mississauga Rentals
(2, 5, 2850, 3.56, 800, 2, 2.0, '2025-03-01', 12, FALSE, FALSE, '2025-02-05', '2025-02-15', 10, 43.5945, -79.6423, 'L5B 4M8'),
(2, 5, 3200, 4.00, 800, 2, 2.0, '2025-02-15', 12, TRUE, TRUE, '2025-01-28', '2025-02-10', 13, 43.6001, -79.6487, 'L5R 3L9'),
(2, 2, 4500, 1.80, 2495, 4, 3.5, '2025-02-01', 12, FALSE, FALSE, '2025-01-15', '2025-01-28', 13, 43.5889, -79.6356, 'L5M 2K7'),
(2, 4, 3800, 2.85, 1333, 3, 2.5, '2025-02-10', 12, FALSE, FALSE, '2025-01-20', '2025-02-05', 16, 43.5823, -79.6278, 'L5N 5R2'),

-- Brampton Rentals
(3, 5, 2400, 3.00, 800, 2, 1.0, '2025-02-15', 12, FALSE, FALSE, '2025-01-25', '2025-02-08', 14, 43.7234, -79.7589, 'L6Y 1M5'),
(3, 4, 3200, 2.40, 1333, 3, 2.5, '2025-02-01', 12, FALSE, FALSE, '2025-01-10', '2025-01-25', 15, 43.7298, -79.7456, 'L6V 3H8'),
(3, 2, 3800, 1.52, 2495, 4, 3.0, '2025-01-15', 12, FALSE, FALSE, '2024-12-20', '2025-01-05', 16, 43.7412, -79.7334, 'L6Z 2K9'),

-- Caledon Rentals (fewer, higher prices)
(4, 2, 5200, 2.08, 2495, 5, 4.0, '2025-02-01', 12, FALSE, FALSE, '2025-01-05', '2025-01-20', 15, 43.8567, -79.8698, 'L7E 3M7'),
(4, 4, 4200, 3.15, 1333, 3, 2.5, '2025-01-15', 12, FALSE, FALSE, '2024-12-28', '2025-01-10', 13, 43.8634, -79.8623, 'L7E 1P8');

-- ====================================================================
-- 5. AIRBNB SAMPLE DATA
-- ====================================================================

INSERT INTO airbnb_listings (
    region_id, housing_type_id, nightly_rate, cleaning_fee, service_fee_percent,
    bedrooms, bathrooms, max_guests, occupancy_rate, monthly_revenue,
    average_rating, total_reviews, listing_created_date, last_booked_date,
    is_entire_home, is_superhost, instant_book, latitude, longitude, postal_code
) VALUES
-- High-performing AirBnB units in Mississauga
(2, 5, 189, 85, 14.2, 2, 2.0, 4, 78.5, 4250, 4.8, 127, '2023-03-15', '2025-02-14', TRUE, TRUE, TRUE, 43.5934, -79.6445, 'L5B 3K8'),
(2, 5, 165, 75, 14.2, 1, 1.0, 2, 82.3, 3890, 4.9, 89, '2023-08-22', '2025-02-13', TRUE, TRUE, FALSE, 43.6023, -79.6478, 'L5R 4M2'),
(2, 2, 285, 125, 14.2, 3, 2.5, 6, 71.2, 5980, 4.7, 156, '2022-11-10', '2025-02-12', TRUE, FALSE, TRUE, 43.5856, -79.6298, 'L5N 2R7'),
(2, 4, 225, 95, 14.2, 3, 2.5, 6, 75.8, 4890, 4.6, 92, '2023-05-18', '2025-02-11', TRUE, TRUE, FALSE, 43.5812, -79.6234, 'L5N 7K5'),

-- Brampton AirBnB listings
(3, 5, 145, 65, 14.2, 2, 1.0, 4, 69.4, 2890, 4.5, 63, '2023-09-12', '2025-02-10', TRUE, FALSE, TRUE, 43.7245, -79.7598, 'L6Y 2M8'),
(3, 2, 245, 105, 14.2, 4, 3.0, 8, 68.7, 4820, 4.4, 78, '2023-02-28', '2025-02-09', TRUE, FALSE, FALSE, 43.7334, -79.7445, 'L6P 1K9'),
(3, 4, 185, 85, 14.2, 3, 2.5, 6, 72.1, 3820, 4.7, 94, '2023-06-14', '2025-02-08', TRUE, TRUE, TRUE, 43.7289, -79.7534, 'L6V 3H2'),

-- Caledon luxury AirBnB listings
(4, 2, 385, 165, 14.2, 5, 4.0, 10, 64.2, 7230, 4.9, 145, '2022-04-20', '2025-02-07', TRUE, TRUE, FALSE, 43.8589, -79.8712, 'L7E 4P3'),
(4, 2, 325, 145, 14.2, 4, 3.5, 8, 67.8, 6340, 4.8, 98, '2023-01-15', '2025-02-06', TRUE, TRUE, TRUE, 43.8623, -79.8656, 'L7E 2M4');

-- ====================================================================
-- 6. AFFORDABILITY DATA
-- ====================================================================

INSERT INTO affordability_data (
    region_id, data_date, median_household_income, avg_household_income,
    housing_affordability_index, price_to_income_ratio, mortgage_payment_to_income,
    first_time_buyer_index, rental_affordability_index, unemployment_rate, population_growth_rate
) VALUES
-- Latest affordability data for all regions
(1, '2025-02-01', 89500, 105600, 45.2, 13.9, 42.8, 31.5, 68.7, 5.8, 2.1), -- Peel Region
(2, '2025-02-01', 94200, 112800, 42.1, 14.6, 45.2, 28.3, 65.4, 5.2, 1.8), -- Mississauga
(3, '2025-02-01', 87800, 101200, 48.7, 13.6, 41.3, 35.2, 71.8, 6.1, 2.3), -- Brampton
(4, '2025-02-01', 112500, 142300, 38.9, 15.8, 48.7, 24.1, 58.9, 4.9, 1.9); -- Caledon

-- ====================================================================
-- 7. MARKET METRICS MONTHLY (PRE-CALCULATED)
-- ====================================================================

-- Sample monthly metrics for performance
INSERT INTO market_metrics_monthly (
    region_id, housing_type_id, metric_month, avg_sale_price, median_sale_price,
    avg_price_per_sqft, price_change_mom, price_change_yoy, total_sales, total_listings,
    sales_change_mom, avg_days_on_market, dom_change_mom, months_of_inventory,
    absorption_rate, list_to_sale_ratio, avg_rental_rate, rental_yield
) VALUES
-- Mississauga All Types - Recent months
(2, 1, '2025-02-01', 1295000, 1240000, 742, 1.2, 8.7, 420, 785, 5.2, 16.8, -3.1, 1.9, 53.5, 98.9, 3100, 2.87),
(2, 1, '2025-01-01', 1280000, 1225000, 734, 0.8, 8.1, 399, 742, 2.1, 17.4, -2.8, 1.8, 53.8, 98.5, 3080, 2.88),
(2, 1, '2024-12-01', 1270000, 1210000, 728, -0.5, 7.9, 391, 698, -1.2, 17.9, 1.1, 1.8, 56.0, 98.2, 3050, 2.87),

-- Mississauga Detached
(2, 2, '2025-02-01', 1760000, 1695000, 742, 1.1, 9.2, 145, 285, 4.8, 20.2, -2.0, 2.0, 50.9, 98.6, 4800, 3.27),
(2, 2, '2025-01-01', 1740000, 1675000, 734, 0.9, 8.8, 139, 275, 1.9, 20.6, -1.8, 2.0, 50.5, 98.3, 4750, 3.26),

-- Mississauga Condos
(2, 5, '2025-02-01', 765000, 740000, 976, 1.3, 7.8, 128, 245, 6.2, 12.5, -4.0, 1.9, 52.2, 99.1, 2950, 4.62),
(2, 5, '2025-01-01', 755000, 730000, 963, 1.1, 7.1, 120, 235, 3.8, 13.0, -3.5, 2.0, 51.1, 98.8, 2900, 4.60),

-- Brampton All Types
(3, 1, '2025-02-01', 1195000, 1150000, 649, 1.4, 9.1, 315, 620, 4.8, 20.5, -1.8, 2.0, 50.8, 98.7, 2850, 2.86),
(3, 1, '2025-01-01', 1178000, 1135000, 640, 1.2, 8.5, 301, 595, 2.9, 20.9, -1.5, 2.0, 50.6, 98.4, 2820, 2.87),

-- Caledon All Types
(4, 1, '2025-02-01', 1460000, 1395000, 782, 1.8, 10.2, 78, 165, 7.2, 25.8, -0.5, 2.1, 47.3, 98.1, 4650, 3.82),
(4, 1, '2025-01-01', 1434000, 1370000, 768, 1.5, 9.8, 73, 158, 5.8, 25.9, -0.3, 2.2, 46.2, 97.9, 4580, 3.83);