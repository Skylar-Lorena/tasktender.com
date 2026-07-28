export const TASK_STATUS = {
  OPEN: 'OPEN',               // Open for bids
  BID_ACCEPTED: 'BID_ACCEPTED',// Bid selected, pending STK Push
  FUNDED: 'FUNDED',           // Escrow active, tasker working
  COMPLETED: 'COMPLETED',     // Work submitted by tasker
  PAID_OUT: 'PAID_OUT',       // Poster confirmed, escrow released
  DISPUTED: 'DISPUTED'        // Under admin review
};

export const MPESA_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};