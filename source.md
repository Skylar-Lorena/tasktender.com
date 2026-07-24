# Task Tender Project Documentation

**Author:** Lorenah M.  
**Target Market:** Kenya (Nairobi, Mombasa, Kisumu, Nakuru, and other urban hubs)  
**Document Version:** 2.0 (Refined MVP Architecture)

---

# 1. Executive Summary

## Overview

Task Tender is an on-demand, hyper-local task and gig management platform that connects **Task Posters (Employers)** with reliable **Taskers (Job Seekers)** across urban Kenya.

The platform focuses on enabling trusted, secure, and fast hiring for everyday physical errands and short-term work through identity verification, escrow payments, and location-based matching.

---

## Market Challenges

### Trust Deficit

Peer-to-peer hiring in Kenya often suffers from fraud and unreliable service providers.

**Solution**

- National ID verification
- User ratings and reviews
- Reputation-based trust system

### Payment Insecurity

Taskers risk unpaid work while employers risk paying before work is completed.

**Solution**

- M-Pesa Escrow payment model
- Funds remain locked until task completion is approved

### Urban Unemployment

Many skilled and unskilled workers require flexible income opportunities.

**Solution**

- Immediate access to nearby gigs
- Hyper-local matching
- Mobile-first experience

---

# 2. MVP Roadmap

To maximize adoption while minimizing operational complexity, Task Tender is released in three phases.

| Phase | Focus |
|--------|-------|
| Phase 1 | Hyper-local physical errands with M-Pesa escrow |
| Phase 2 | Skilled service marketplace with enhanced trust and safety |
| Phase 3 | Professional contract work and enterprise hiring |

---

# Phase 1: Core MVP

## Objective

Launch a reliable marketplace for simple physical errands with secure payments and proximity-based matching.

### Core Components

| Component | Functionality | Local Context / Technical Notes |
|-----------|---------------|---------------------------------|
| Authentication | Mobile Number + OTP | Primary login using Safaricom and Airtel numbers |
| Identity Verification | National ID Upload | Manual or semi-automated verification |
| Task Creation | Fixed Price or Bidding | GPS and Google Maps location tagging |
| Escrow Payments | M-Pesa STK Push | Funds locked until task completion |
| Proximity Matching | Neighborhood Radius Search | Search within configurable distance (2–10 km) |
| Real-Time Messaging | In-App Chat | Contact details hidden until bid acceptance |

---

# Phase 2: Growth and Safety

## Objective

Expand into skilled services while improving platform trust and dispute management.

### New Features

#### Skilled Service Categories

- Plumbing
- Electrical Services
- Home Repairs
- Technical Support
- Appliance Installation

#### Enhanced Identity Verification

Potential integrations include:

- KRA PIN verification
- eCitizen verification (where applicable)

#### Dispute Resolution

Administrative tools for:

- Reviewing disputes
- Managing incomplete work
- Escrow mediation
- Manual payout decisions

#### Trust System

User reputation enhancements including:

- Top Rated Tasker
- Background Checked
- Completion Rate
- Response Rate
- Customer Ratings

---

# Phase 3: Scale and Enterprise

## Objective

Expand beyond errands into formal short-term employment and enterprise workforce management.

### Planned Features

#### Professional Job Board

Support for:

- Temporary contracts
- Software development projects
- Remote administrative work
- Freelance professional services

#### Expanded Payment Methods

Beyond M-Pesa:

- Pesalink
- Bank Transfers
- Debit/Credit Cards

#### Business Accounts

Dedicated employer tools for:

- SMEs
- Event staffing
- Casual labor management
- Bulk task creation

---

# 3. Core MVP Features

## User Roles

A single account can switch between:

- Task Poster
- Tasker

No separate registration is required.

---

## Task Poster Features

Task Posters can:

- Create tasks
- Set budgets
- Add photos
- Specify deadlines
- Choose task locations
- Receive bids
- Review tasker profiles
- View ratings and completed work history
- Fund tasks using M-Pesa Escrow
- Approve completed work
- Trigger payment release

---

## Tasker Features

Taskers can:

- Browse nearby tasks
- View tasks on a map
- Filter by:
  - Budget
  - Distance
  - Urgency
- Submit bids
- Add proposal notes
- Complete assigned work
- Request escrow payout

---

# 4. Payment Architecture

## M-Pesa Escrow Workflow

```
Poster Creates Task
        │
        ▼
Taskers Submit Bids
        │
        ▼
Poster Accepts a Bid
        │
        ▼
Poster Pays via M-Pesa STK Push
        │
        ▼
Funds Held Securely in Escrow
        │
        ▼
Tasker Completes Work
        │
        ▼
Poster Confirms Completion
        │
        ▼
Escrow Releases Payment
        │
        ▼
Tasker Receives Funds
```

---

## Payment Principles

### M-Pesa STK Push

The employer receives an STK Push request after selecting a tasker.

### Escrow

Funds remain securely held until task completion is confirmed.

### Platform Fee

Task Tender deducts a platform commission during payout.

Suggested range:

- 8%–12%

### Instant Withdrawal

Taskers receive payouts directly to their registered M-Pesa numbers.

---

# 5. MVP Categories

The initial launch focuses on high-frequency, low-complexity errands.

| Category | Description |
|-----------|-------------|
| Grocery and Market Shopping | Shopping assistance |
| Light Delivery and Courier | Parcel and item delivery |
| House Cleaning and Laundry | Home cleaning services |
| Gardening and Yard Maintenance | Outdoor maintenance |
| Basic Home Repairs | Minor repair tasks |
| Pet Care | Walking and feeding pets |
| Queueing Services | Standing in queues on behalf of clients |
| Event Support and Logistics | Event setup and assistance |

---

# 6. Success Metrics (KPIs)

## Liquidity / Match Rate

Percentage of posted tasks matched with a tasker within 30 minutes.

---

## Escrow Conversion Rate

Percentage of accepted bids that successfully convert into funded M-Pesa escrow transactions.

---

## Task Completion Rate

Percentage of funded tasks completed without disputes.

---

## Trust Index

Measured using:

- Average user rating
- Repeat hiring rate
- Successful completion percentage
- Customer satisfaction

---

# Vision

Task Tender aims to become Kenya's most trusted hyper-local marketplace for errands, gigs, and short-term work by combining:

- Secure identity verification
- M-Pesa-first escrow payments
- Fast proximity-based matching
- Transparent reputation systems
- A scalable architecture that evolves from everyday errands to enterprise workforce management