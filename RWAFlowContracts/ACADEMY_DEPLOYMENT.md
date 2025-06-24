# Flow Passport Academy NFT Certification System

## Overview

The Flow Passport Academy features a comprehensive NFT certification system that rewards users with soulbound certificate NFTs when they pass academy modules with 50% or higher scores.

## System Components

### 1. Smart Contracts

#### AcademyCertification Contract
- **Address**: `0x66206f19Ca68C1B6286673ED3E7500AD50827df2`
- **Purpose**: Tracks exam results and pass/fail status for each user
- **Features**:
  - Records exam scores and timestamps
  - Determines pass/fail status (50% threshold)
  - Tracks statistics per module
  - Owner-only exam result submission

#### AcademyNFT Contract
- **Address**: `0xA5AC23d9f4EDc3068081D08214aa2D8fA7de7f4B`
- **Purpose**: Mints soulbound certificate NFTs for passed modules
- **Features**:
  - Mints NFTs only for users who passed exams
  - Prevents duplicate NFTs per module
  - Soulbound (non-transferable) certificates
  - Dynamic metadata based on exam results

### 2. Module Structure

The academy has 3 modules:

| Module | ID | Level | Questions | Passing Score |
|--------|----|----|-----------|---------------|
| Beginner RWA Quiz | `beginner-rwa-quiz` | 0 | 10 | 5+ (50%) |
| Intermediate RWA Quiz | `intermediate-rwa-quiz` | 1 | 25 | 13+ (50%) |
| Advanced RWA Quiz | `advanced-rwa-quiz` | 2 | 25 | 13+ (50%) |

### 3. Frontend Integration

#### QuizInterface Component
- Automatically submits exam results to blockchain after completion
- Shows NFT minting option for passed exams
- Handles transaction states and user feedback
- Prevents duplicate submissions

#### Academy Pages
- Display completion checkmarks for passed modules
- Show NFT certificate status with medal icons
- Dynamic statistics based on blockchain data
- Real-time pass/fail status from smart contracts

#### useAcademyContracts Hook
- Provides blockchain interaction methods
- Handles exam result submission
- Manages NFT minting process
- Tracks user progress and certificates

## Deployment Information

### Contract Addresses (Flow Testnet)
- **AcademyCertification**: `0x66206f19Ca68C1B6286673ED3E7500AD50827df2`
- **AcademyNFT**: `0xA5AC23d9f4EDc3068081D08214aa2D8fA7de7f4B`
- **Owner**: `0xd4af2053496Da8809BF69FF2A96E86831A8b2b62`

### Block Explorer Links
- [AcademyCertification Contract](https://evm-testnet.flowscan.io/address/0x66206f19Ca68C1B6286673ED3E7500AD50827df2)
- [AcademyNFT Contract](https://evm-testnet.flowscan.io/address/0xA5AC23d9f4EDc3068081D08214aa2D8fA7de7f4B)

### Environment Variables
```env
NEXT_PUBLIC_ACADEMY_CERTIFICATION_ADDRESS=0x66206f19Ca68C1B6286673ED3E7500AD50827df2
NEXT_PUBLIC_ACADEMY_NFT_ADDRESS=0xA5AC23d9f4EDc3068081D08214aa2D8fA7de7f4B
```

## Available Scripts

### Deployment
```bash
npm run deploy:academy           # Deploy both contracts
npm run verify:academy <CERT> <NFT>  # Verify contracts
npm run test:academy <CERT> <NFT>    # Test functionality
```

### Contract Functions

#### AcademyCertification
- `submitExamResult(user, moduleLevel, score, totalQuestions)` - Submit exam result (owner only)
- `hasPassedModule(user, moduleLevel)` - Check if user passed module
- `getExamResult(user, moduleLevel)` - Get detailed exam result
- `getUserPassedModules(user)` - Get all passed modules for user
- `getAllUserStats(user)` - Get comprehensive user statistics

#### AcademyNFT
- `mintCertificate(moduleLevel)` - Mint certificate NFT for passed module
- `hasUserMintedCertificate(user, moduleLevel)` - Check if NFT already minted
- `canMintCertificate(user, moduleLevel)` - Check if user can mint NFT
- `getUserCertificates(user)` - Get all user's certificate token IDs
- `getCertificateInfo(tokenId)` - Get certificate details

## User Flow

1. **Take Quiz**: User completes academy module quiz
2. **Auto-Submit**: Frontend automatically submits result to AcademyCertification contract
3. **Pass Check**: Contract determines if score ≥ 50%
4. **NFT Eligibility**: Passed users become eligible for certificate NFT
5. **Mint Certificate**: User can mint soulbound certificate NFT
6. **UI Updates**: Frontend shows completion status and certificate badges

## Security Features

- **Soulbound NFTs**: Certificates cannot be transferred between addresses
- **Owner Controls**: Only contract owner can submit exam results
- **Duplicate Prevention**: Users cannot mint multiple NFTs for same module
- **Pass Verification**: NFTs only mintable by users who passed exams
- **Reentrancy Protection**: All state-changing functions protected

## Testing

The deployment automatically tests:
1. Exam result submission for all 3 modules
2. Pass/fail status verification
3. NFT minting for passed modules
4. Certificate information retrieval
5. User statistics tracking

## Integration Notes

- Frontend automatically handles wallet connection requirements
- Real-time UI updates based on blockchain state
- Error handling for all transaction states
- Toast notifications for user feedback
- Loading states during blockchain operations

## Future Enhancements

- Dynamic metadata generation with custom certificate designs
- Integration with external metadata storage (IPFS)
- Advanced analytics and leaderboards
- Cross-chain certificate verification
- Batch operations for multiple modules