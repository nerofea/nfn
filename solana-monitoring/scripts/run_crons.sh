#!/bin/bash

# Purchases
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address PURCHASE_PROGRAM_ID \
  --category purchases \
  --filter_memo purchase_complete \
  --limit 20

# Couriers
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address COURIER_PROGRAM_ID \
  --category couriers \
  --filter_memo courier_active \
  --limit 20

# Rewards
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address REWARD_PROGRAM_ID \
  --category rewards \
  --filter_memo reward_awarded \
  --limit 20

# PoW
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address PoW_PROGRAM_ID \
  --category PoW \
  --filter_memo PoW_onChain \
  --limit 20

# PoW
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address PoW_PROGRAM_ID \
  --category PoW_Rewards \
  --filter_memo PoW_Rewards_Unclaimed \
  --limit 20

# PoW
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address PoW_PROGRAM_ID \
  --category PoW_Rewards \
  --filter_memo PoW_Rewards_Claimed \
  --limit 20

# PoW
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address PoW_PROGRAM_ID \
  --category PoW_Accounts \
  --filter_memo PoW_Accounts \
  --limit 20

# Accounts (creation, initial deposit as proof, and potentially verified)
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address ACCOUNTS_PROGRAM_ID \
  --category Accounts \
  --filter_memo Accounts \
  --limit 20

# Accounts (creation, initial deposit as proof, and potentially verified, and first livestream longer than 15 minutes)
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address ACCOUNTS_PROGRAM_ID \
  --category LiveStreamers \
  --filter_memo Accounts \
  --limit 20

# Accounts (creation, initial deposit as proof, and potentially verified, and first livestream longer than 15 minutes)
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address ACCOUNTS_PROGRAM_ID \
  --category LiveStreamers \
  --filter_memo Livestreamers \
  --limit 20

# Accounts (creation, initial deposit as proof, and potentially verified, and first livestream longer than 15 minutes)
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address ACCOUNTS_PROGRAM_ID \
  --category CampaignManagers \
  --filter_memo CampaignManagers \
  --limit 20


# Accounts (creation, initial deposit as proof, and potentially verified, and first livestream longer than 15 minutes)
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address ACCOUNTS_PROGRAM_ID \
  --category Advertisement \
  --filter_memo Advertisements \
  --limit 20

# Ads or Accounts
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address ACCOUNTS_PROGRAM_ID \
  --category AdvertisementManagers \
  --filter_memo AdvertisementManagers \
  --limit 20


# Events
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address EVENTS_PROGRAM_ID \
  --category Events \
  --filter_memo EventsLaunched \
  --limit 20

# Events
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address EVENTS_PROGRAM_ID \
  --category Tickets \
  --filter_memo TicketsIssued \
  --limit 20

# Events
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address EVENTS_PROGRAM_ID \
  --category Tickets \
  --filter_memo TicketsUsed \
  --limit 20

# Events
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address EVENTS_PROGRAM_ID \
  --category Tickets \
  --filter_memo RewardsIssued \
  --limit 20

# Events
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address EVENTS_PROGRAM_ID \
  --category Tickets \
  --filter_memo RewardsUsed \
  --limit 20

# Events
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address EVENTS_PROGRAM_ID \
  --category Events \
  --filter_memo EventManagers \
  --limit 20

# Events
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address EVENTS_PROGRAM_ID \
  --category Events \
  --filter_memo EventsPlanned \
  --limit 20

# Events
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address EVENTS_PROGRAM_ID \
  --category Events \
  --filter_memo EventsonProfit \
  --limit 20

# Events
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address EVENTS_PROGRAM_ID \
  --category Events \
  --filter_memo EventsonLoss \
  --limit 20

# Stakes paid out
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address StakingFinance_PROGRAM_ID \
  --category Sponsorships \
  --filter_memo PaidOutSponsorships \
  --limit 20

# Merch
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Merch_PROGRAM_ID \
  --category Merch \
  --filter_memo LaunchedMerch \
  --limit 20


# Merch
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Merch_PROGRAM_ID \
  --category Merch \
  --filter_memo MerchonStock \
  --limit 20

# Merch
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Merch_PROGRAM_ID \
  --category Merch \
  --filter_memo PaidOutMerch \
  --limit 20

# Bids
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address AuctionBids_PROGRAM_ID \
  --category AuctionBids \
  --filter_memo ForEventParticipation \
  --limit 20

# Bids
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address AuctionBids_PROGRAM_ID \
  --category AuctionBids \
  --filter_memo ForTechnicalEquipment \
  --limit 20

# Bids
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address AuctionBids_PROGRAM_ID \
  --category AuctionBids \
  --filter_memo ForManagers \
  --limit 20

# Calls
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Calls_PROGRAM_ID \
  --category Calls \
  --filter_memo CoWorking \
  --limit 20

# Calls
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Calls_PROGRAM_ID \
  --category Calls \
  --filter_memo CoWorkingandLiving \
  --limit 20

# Calls
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Calls_PROGRAM_ID \
  --category CoLiving \
  --filter_memo CoHome \
  --limit 20

# Calls
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Calls_PROGRAM_ID \
  --category Calls \
  --filter_memo CoCouch \
  --limit 20

# Calls
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Calls_PROGRAM_ID \
  --category Calls \
  --filter_memo CoShopping \
  --limit 20

# Calls
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Calls_PROGRAM_ID \
  --category Calls \
  --filter_memo CoEvent \
  --limit 20

# Calls
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Calls_PROGRAM_ID \
  --category Calls \
  --filter_memo CoSports \
  --limit 20

# Calls
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Calls_PROGRAM_ID \
  --category Calls \
  --filter_memo CoHobby \
  --limit 20

# Calls
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Calls_PROGRAM_ID \
  --category Calls \
  --filter_memo CoMusic \
  --limit 20

# Calls
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Calls_PROGRAM_ID \
  --category Calls \
  --filter_memo CoGardening \
  --limit 20

# Calls
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Calls_PROGRAM_ID \
  --category Calls \
  --filter_memo CoWaterSports \
  --limit 20

# Calls
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Calls_PROGRAM_ID \
  --category Calls \
  --filter_memo CoExtreme \
  --limit 20

# Calls
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Calls_PROGRAM_ID \
  --category Calls \
  --filter_memo CoRealEstate \
  --limit 20

# Calls
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Calls_PROGRAM_ID \
  --category Calls \
  --filter_memo CoTravel \
  --limit 20

# Loyalty
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Loyalty_PROGRAM_ID \
  --category Cards \
  --filter_memo Issued \
  --limit 20

# Loyalty
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Loyalty_PROGRAM_ID \
  --category Cards \
  --filter_memo Used \
  --limit 20

# Loyalty
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Loyalty_PROGRAM_ID \
  --category Rewards \
  --filter_memo LoyaltyCampaignCreated \
  --limit 20

  # Loyalty
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Loyalty_PROGRAM_ID \
  --category Rewards \
  --filter_memo LoyaltyRewardClaimed \
  --limit 20


# Loyalty
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address Loyalty_PROGRAM_ID \
  --category Rewards \
  --filter_memo Campaigns \
  --limit 20


# Article Writers
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address CONTRIBUTORS_PROGRAM_ID \
  --category Contributors \
  --filter_memo ArticleWriters \
  --limit 20

# E-book Writers
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address CONTRIBUTORS_PROGRAM_ID \
  --category Contributors \
  --filter_memo EbookWriters \
  --limit 20

# Social Media Managers
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address CONTRIBUTORS_PROGRAM_ID \
  --category Contributors \
  --filter_memo SocialMediaManagers \
  --limit 20

# Hackathon Coordinators
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address CONTRIBUTORS_PROGRAM_ID \
  --category Contributors \
  --filter_memo HackathonCoordinators \
  --limit 20

# Influencers
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address CONTRIBUTORS_PROGRAM_ID \
  --category Contributors \
  --filter_memo Influencers \
  --limit 20

# Actors
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address CONTRIBUTORS_PROGRAM_ID \
  --category Contributors \
  --filter_memo Actors \
  --limit 20

# Models
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address CONTRIBUTORS_PROGRAM_ID \
  --category Contributors \
  --filter_memo Models \
  --limit 20

# EventCoordinators
python3 /home/you/scripts/fetch_filtered_transactions.py \
  --address CONTRIBUTORS_PROGRAM_ID \
  --category Contributors \
  --filter_memo Coordinators \
  --limit 20

# Online Tickets # Commission payout
python3 fetch_filtered_transactions.py \
  --address TICKETS_PROGRAM_ID \
  --category TicketSales \
  --filter_memo OnlinePurchase \
  --limit 50

# In-Person Bookings # Commission payout
python3 fetch_filtered_transactions.py \
  --address TICKETS_PROGRAM_ID \
  --category TicketSales \
  --filter_memo InPersonBooking \
  --limit 50
Monitor Campaign Activity

# Commission payout
python3 fetch_filtered_transactions.py \
  --address CAMPAIGN_PROGRAM_ID \
  --category Campaigns \
  --filter_memo ActiveCampaign \
  --limit 50
Rotate Campaign Managers

# Commission payout
python3 fetch_filtered_transactions.py \
  --address MANAGER_PROGRAM_ID \
  --category ManagerRotation \
  --filter_memo ManagerRotated \
  --limit 20
Track Influencer Participation

# Commission payout
python3 fetch_filtered_transactions.py \
  --address INFLUENCER_PROGRAM_ID \
  --category Influencers \
  --filter_memo InfluencerTagged \
  --limit 50
Log Commission Claims

# Commission payout
python3 fetch_filtered_transactions.py \
  --address COMMISSIONS_PROGRAM_ID \
  --category Commissions \
  --filter_memo CommissionClaimed \
  --limit 50