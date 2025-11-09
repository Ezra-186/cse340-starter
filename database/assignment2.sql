
-- 1) Insert Tony Stark
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- show Tony
SELECT account_id, account_firstname, account_lastname, account_email, account_type
FROM public.account
WHERE account_email = 'tony@starkent.com';

-- 2) Promote Tony to Admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = (
  SELECT account_id FROM public.account WHERE account_email = 'tony@starkent.com'
);

-- show Tony as Admin
SELECT account_id, account_firstname, account_lastname, account_email, account_type
FROM public.account
WHERE account_email = 'tony@starkent.com';

-- 3) Delete Tony
DELETE FROM public.account
WHERE account_id = (
  SELECT account_id FROM public.account WHERE account_email = 'tony@starkent.com'
);

-- show Tony is gone
SELECT COUNT(*) AS tony_rows_remaining
FROM public.account
WHERE account_email = 'tony@starkent.com';

-- 4) Fix GM Hummer description
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- show Hummer description
SELECT inv_make, inv_model, inv_description
FROM public.inventory
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5) List Sport inventory
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport'
ORDER BY i.inv_make, i.inv_model;

-- 6) Add /vehicles to image paths
UPDATE public.inventory
SET  inv_image     = REPLACE(inv_image,     '/images/', '/images/vehicles/'),
     inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

-- show 5 updated paths
SELECT inv_id, inv_image, inv_thumbnail
FROM public.inventory
ORDER BY inv_id
LIMIT 5;
