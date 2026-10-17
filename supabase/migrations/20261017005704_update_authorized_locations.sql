/*
# Update authorized hiring locations

## Overview
Replaces the previously seeded public location list with only the locations
provided by the authorized operator. Existing applications and job records
are preserved; existing store records are relabeled in place where possible,
and the additional authorized locations are added.

## Modified tables
- `stores.location_type` — identifies Petro-Canada, A&W, or Petro Pass.
- Existing store names and location labels are updated to the authorized list.

## New location entries
- Northgate
- Keewatin
- Ellice
- Portage
- Nairn
- Mint
- Deacons — Petro-Canada
- Selkirk
- Lac du Bonnet
- 3033 Pembina
- Deacons — A&W
- Deacons — Petro Pass

## Security
No access policy changes are made. Existing public read and authenticated
management policies remain in place.

## Important notes
1. No rows are deleted and no applications are removed.
2. Exact street addresses, postal codes, and phone numbers were not supplied,
   so the provided location names are displayed as the location labels.
3. A Gmail account cannot be created automatically by this application. Email
   forwarding requires an operator-owned destination address and a configured
   email provider connection.
*/

ALTER TABLE stores
  ADD COLUMN IF NOT EXISTS location_type text NOT NULL DEFAULT 'Petro-Canada';

UPDATE stores
SET name = 'Petro-Canada - Northgate', address = 'Northgate', city = 'Winnipeg', province = 'MB', location_type = 'Petro-Canada'
WHERE address = '747 Osborne St.';

UPDATE stores
SET name = 'Petro-Canada - Keewatin', address = 'Keewatin', city = 'Winnipeg', province = 'MB', location_type = 'Petro-Canada'
WHERE address = '1701 Ellice Avenue';

UPDATE stores
SET name = 'Petro-Canada - Ellice', address = 'Ellice', city = 'Winnipeg', province = 'MB', location_type = 'Petro-Canada'
WHERE address = '490 Madison Street';

UPDATE stores
SET name = 'Petro-Canada - Portage', address = 'Portage', city = 'Winnipeg', province = 'MB', location_type = 'Petro-Canada'
WHERE address = '1284 Portage Avenue';

UPDATE stores
SET name = 'Petro-Canada - Nairn', address = 'Nairn', city = 'Winnipeg', province = 'MB', location_type = 'Petro-Canada'
WHERE address = '2012 Pembina Highway';

UPDATE stores
SET name = 'Petro-Canada - Mint', address = 'Mint', city = 'Winnipeg', province = 'MB', location_type = 'Petro-Canada'
WHERE address = '670 St. Anne''s Road';

UPDATE stores
SET name = 'Petro-Canada - Deacons', address = 'Deacons', city = 'Winnipeg', province = 'MB', location_type = 'Petro-Canada'
WHERE address = '1622 St Mary''s Road';

UPDATE stores
SET name = 'Petro-Canada - Selkirk', address = 'Selkirk', city = 'Winnipeg', province = 'MB', location_type = 'Petro-Canada'
WHERE address = '107 Pandora Ave W';

INSERT INTO stores (name, address, city, province, location_type)
SELECT 'Petro-Canada - Lac du Bonnet', 'Lac du Bonnet', 'Lac du Bonnet', 'MB', 'Petro-Canada'
WHERE NOT EXISTS (SELECT 1 FROM stores WHERE name = 'Petro-Canada - Lac du Bonnet');

INSERT INTO stores (name, address, city, province, location_type)
SELECT 'Petro-Canada - 3033 Pembina', '3033 Pembina', 'Winnipeg', 'MB', 'Petro-Canada'
WHERE NOT EXISTS (SELECT 1 FROM stores WHERE name = 'Petro-Canada - 3033 Pembina');

INSERT INTO stores (name, address, city, province, location_type)
SELECT 'A&W - Deacons', 'Deacons', 'Winnipeg', 'MB', 'A&W'
WHERE NOT EXISTS (SELECT 1 FROM stores WHERE name = 'A&W - Deacons');

INSERT INTO stores (name, address, city, province, location_type)
SELECT 'Petro Pass - Deacons', 'Deacons', 'Winnipeg', 'MB', 'Petro Pass'
WHERE NOT EXISTS (SELECT 1 FROM stores WHERE name = 'Petro Pass - Deacons');

CREATE INDEX IF NOT EXISTS idx_stores_location_type ON stores(location_type);