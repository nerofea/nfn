-- A purchase intent must not be confused with confirmed on-chain settlement.
ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending';

ALTER TABLE purchases
  DROP CONSTRAINT IF EXISTS purchases_payment_status_check;

ALTER TABLE purchases
  ADD CONSTRAINT purchases_payment_status_check
  CHECK (payment_status IN ('pending', 'confirmed', 'failed', 'refunded'));
