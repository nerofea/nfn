#[derive(Accounts)]
pub struct RecordSale<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut)]
    pub campaign_state: Account<'info, CampaignState>,
    #[account(mut)]
    pub treasury: SystemAccount<'info>,
    #[account(mut)]
    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct SaleInput {
    pub campaign_id: u64,
    pub referrer: Option<Pubkey>,
    pub amount: u64,
    pub manager: Pubkey,
    pub influencer: Pubkey,
    pub manager_cut: u8,     // 60 = 60%
    pub influencer_cut: u8,  // 40 = 40%
}

#[account]
pub struct CampaignState {
    pub total_sales: u64,
    pub commissions: Vec<CommissionRecord>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CommissionRecord {
    pub sale_id: u64,
    pub manager: Pubkey,
    pub influencer: Pubkey,
    pub manager_amount: u64,
    pub influencer_amount: u64,
    pub timestamp: i64,
}
