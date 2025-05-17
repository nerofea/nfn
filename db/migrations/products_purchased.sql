CREATE TABLE products_purchased (
  purchase_id UUID REFERENCES purchases(id),           -- Link to the purchase
  product_id UUID REFERENCES products(id),             -- Link to the purchased product
  product_amount NUMERIC(10,2),                          -- The amount of the product purchased
  loyalty_token_pair_id UUID REFERENCES loyalty_token_pairs(id),  -- Link to the loyalty token pair used
  poll_id UUID REFERENCES polls(id),                   -- Link to the poll the product was purchased through
  PRIMARY KEY (purchase_id, product_id)                 -- Composite primary key to uniquely identify a product in a purchase
);
