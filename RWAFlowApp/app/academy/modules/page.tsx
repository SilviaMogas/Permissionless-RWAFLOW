import Header from "@/components/header"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Play } from "lucide-react"
import type { LearningModule, QuizQuestion } from "@/app/academy/module/[moduleId]/page" // Assuming types are exported or defined here

// --- CSV data and parsing function (same as used in other academy pages) ---
const csvData = `Level,Question,Option A,Option B,Option C,Correct Answer
Beginner,What is a bond?,A digital currency,A fixed-income investment,A type of blockchain,B
Beginner,What does tokenizing a bond allow?,Faster printing,Global accessibility & liquidity,Lower interest rates,B
Beginner,What is yield?,Total investment cost,Reward for staking,Return on an investment over time,C
Beginner,What type of yield do bonds pay?,Fixed or floating interest,Dividends,Inflation-adjusted fees,A
Beginner,Why tokenize real estate?,To increase transparency and fractional ownership,To change zoning laws,To remove taxes,A
Beginner,What is the purpose of staking in DeFi?,Gambling,Earning passive income or yield,Inflating tokens,B
Beginner,Which of these is a Real World Asset?,Stock options,A luxury watch,A governance token,B
Beginner,What is a security token?,A token representing real-world financial instruments,A login key,A DeFi-only asset,A
Beginner,What does liquidity mean in investing?,How easy it is to sell an asset,Its market cap,How secure it is,A
Beginner,What’s the advantage of blockchain in RWAs?,Centralized access,Immutable transaction history,Slower transactions,B
Intermediate,What is a bond's coupon rate?,Its face value,The annual interest paid,Its market price,B
Intermediate,What is an SPV in asset tokenization?,A storage vault,Special Purpose Vehicle,Smart Protocol Vault,B
Intermediate,How does tokenization improve bond liquidity?,By creating NFTs,By eliminating taxes,By enabling easier transfer and trading,C
Intermediate,What is an investment portfolio?,A crypto wallet,A collection of financial assets,A legal document,B
Intermediate,Which of the following best describes diversification?,Buying one large asset,Investing in multiple asset types,Staking a token,B
Intermediate,What is the function of a custodian in RWA?,Manages staking,Holds and secures the real asset,Issues stablecoins,B
Intermediate,What is a yield curve?,Graph of interest rates over different maturities,Curve in token supply,Price volatility indicator,A
Intermediate,Which bond type pays no interest?,Corporate bond,Municipal bond,Zero-coupon bond,C
Intermediate,What’s the purpose of a KYC check?,Track trading volume,Verify user identity,Set token prices,B
Intermediate,What is collateral?,An unsecured loan,Asset pledged for a loan,A governance vote,B
Intermediate,What affects yield in tokenized assets?,Staking duration and asset type,Color of the token,User location,A
Intermediate,Which investment has higher liquidity?,Real estate,Tokenized bond,Antique painting,B
Intermediate,What is inflation risk in investing?,Risk of token hacking,Loss of purchasing power,Losing your wallet,B
Intermediate,Why are stablecoins used in RWA platforms?,To ensure low volatility transactions,To boost mining rewards,To pay gas fees,A
Intermediate,What is APY?,Annual Performance Yield,Average Price Yield,Annual Percentage Yield,C
Intermediate,What makes an asset token secure?,Decentralization and audits,Celebrity endorsement,Private ownership,A
Intermediate,How are dividends related to RWAs?,They are paid from staking,They are regular earnings from equity,They only apply to NFTs,B
Intermediate,Which is a benefit of tokenized debt instruments?,Reduced transparency,Faster access to capital,Less yield,B
Intermediate,What does ROI stand for?,Return of Interest,Rate on Investment,Return on Investment,C
Intermediate,What is a risk profile?,A user's ID,An evaluation of investment risk tolerance,A token portfolio,B
Intermediate,What is the face value of a bond?,The market price,The original value paid at maturity,The total return,B
Intermediate,What’s a benefit of asset-backed tokens?,They are easy to stake,They derive value from a physical asset,They offer free NFTs,B
Intermediate,What is interest compounding?,Earning interest on both the principal and prior interest,Paying off interest early,Delaying interest payments,A
Intermediate,What’s a liquidity pool?,A savings account,A collection of assets used to facilitate trading,A type of stablecoin,B
Intermediate,What is the lock-up period in investing?,Time when assets cannot be traded or withdrawn,Time to buy more tokens,KYC processing time,A
Advanced,What is a Reg S exemption?,Allows international securities offering,Removes taxes,Eliminates KYC,A
Advanced,What is the primary purpose of a DAO in RWA?,To increase trading fees,To govern decentralized investment processes,To create NFTs,B
Advanced,What does token whitelisting do?,Blocks all tokens,Pre-approves wallets for participation,Changes ownership,B
Advanced,What is the risk of default in bonds?,Issuer fails to repay,Token devaluation,Asset inflation,A
Advanced,What is real yield?,Staking rewards only,Yield adjusted for inflation,Theoretical return,B
Advanced,What is TVL (Total Value Locked)?,Total tokens burned,Total assets staked in a protocol,Total user count,B
Advanced,What are synthetic RWAs?,Fake investments,Tokenized versions of asset prices,Assets used in DeFi games,B
Advanced,What is a zero-knowledge proof?,Proof with full transparency,Verification without revealing sensitive info,Requires oracle input,B
Advanced,What is risk-adjusted return?,A return calculated without fees,Return per year,Return considering the level of risk taken,C
Advanced,Why use on-chain scoring for RWAs?,To replace wallets,To improve transparency and trust,To lower smart contract costs,B
Advanced,How does slippage impact RWA trading?,Causes higher volatility,Affects token issuance,Causes execution at different prices,C
Advanced,What’s a drawback of illiquid RWAs?,Hard to buy tokens,Difficult to sell quickly,Too many investors,B
Advanced,What’s the benefit of AI advisors in investment platforms?,Offer personalized strategies based on user data,Generate NFTs,Mint tokens,A
Advanced,What is token fractionalization?,Splitting ownership into smaller tradable parts,Removing wallet access,Reducing staking power,A
Advanced,Why are security tokens regulated?,They offer airdrops,They represent ownership of real financial instruments,They provide governance votes,B
Advanced,What does AML help prevent?,Password leaks,Fraud and illegal financial activities,Smart contract bugs,B
Advanced,What is a compliance oracle?,A prediction tool,Smart contract checker for legal compliance,Wallet monitor,B
Advanced,How is leverage used in RWA platforms?,To amplify potential returns (and risks),To reduce fees,To generate new tokens,A
Advanced,What’s a dynamic SBT (soulbound token)?,A non-transferable token that evolves with user activity,A permanent NFT,A token for trading,A
Advanced,What does portfolio rebalancing mean?,Changing passwords,Adjusting asset allocation over time,Cancelling investments,B
Advanced,What is an audit trail?,A list of crypto tokens,A transparent record of all asset-related actions,An investment strategy,B
Advanced,How are smart contracts used in RWA?,To automate ownership and transactions,To store NFTs,To host chatbots,A
Advanced,What is an investment DAO?,A centralized asset manager,A collective that invests based on token-holder votes,A government agency,B
Advanced,What is DeFi composability?,Creating music on blockchain,Combining different protocols and assets seamlessly,Breaking down asset values,B
Advanced,What does token burn mean?,Sending tokens to an unusable wallet to reduce supply,Increasing token value by minting,Disabling user wallets,A
`

function parseCSVToQuizzes(csv: string): LearningModule[] {
  const lines = csv.trim().split("\n")
  const headers = lines[0].split(",")

  const questionsByLevel: Record<string, QuizQuestion[]> = {
    Beginner: [],
    Intermediate: [],
    Advanced: [],
  }

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",")
    const entry: Record<string, string> = {}
    headers.forEach((header, index) => {
      entry[header.trim()] = values[index] ? values[index].trim() : ""
    })

    const correctAnswerLetter = entry["Correct Answer"]?.toUpperCase()
    let correctAnswerId = ""
    if (correctAnswerLetter === "A") correctAnswerId = "a"
    else if (correctAnswerLetter === "B") correctAnswerId = "b"
    else if (correctAnswerLetter === "C") correctAnswerId = "c"

    const question: QuizQuestion = {
      id: `q${i}`,
      questionText: entry["Question"] || "N/A",
      options: [
        { id: "a", text: entry["Option A"] || "N/A" },
        { id: "b", text: entry["Option B"] || "N/A" },
        { id: "c", text: entry["Option C"] || "N/A" },
      ],
      correctAnswerId: correctAnswerId,
    }

    const level = entry["Level"]
    if (level && questionsByLevel[level]) {
      questionsByLevel[level].push(question)
    }
  }

  const quizzes: LearningModule[] = []
  if (questionsByLevel.Beginner.length > 0) {
    quizzes.push({
      id: "beginner-rwa-quiz",
      title: "Beginner RWA Quiz",
      level: 1,
      questions: questionsByLevel.Beginner,
      description: `Test your basic knowledge of Real World Assets. Covers ${questionsByLevel.Beginner.length} topics.`,
    })
  }
  if (questionsByLevel.Intermediate.length > 0) {
    quizzes.push({
      id: "intermediate-rwa-quiz",
      title: "Intermediate RWA Quiz",
      level: 2,
      questions: questionsByLevel.Intermediate,
      description: `Challenge your intermediate understanding of RWAs. Covers ${questionsByLevel.Intermediate.length} topics.`,
    })
  }
  if (questionsByLevel.Advanced.length > 0) {
    quizzes.push({
      id: "advanced-rwa-quiz",
      title: "Advanced RWA Quiz",
      level: 3,
      questions: questionsByLevel.Advanced,
      description: `Assess your advanced expertise in RWAs. Covers ${questionsByLevel.Advanced.length} topics.`,
    })
  }
  return quizzes
}

const quizzesToList = parseCSVToQuizzes(csvData)

export default function LearningModulesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Learning Modules</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Master the fundamental concepts of Real World Assets through our interactive quizzes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzesToList.map((quizModule) => (
            <Card
              key={quizModule.id}
              className="flex flex-col bg-white shadow-lg hover:shadow-xl transition-shadow border-gray-200"
            >
              <CardHeader>
                <Badge variant="outline" className="w-fit bg-emerald-50 text-metallic-green border-emerald-200 mb-2">
                  Level {quizModule.level}
                </Badge>
                <CardTitle className="text-xl text-gray-800">{quizModule.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 mb-3">{quizModule.description}</p>
                <p className="text-xs text-gray-500">
                  {quizModule.questions.length} question{quizModule.questions.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full bg-green-gradient text-white hover:opacity-90 transition-opacity shadow-md"
                >
                  <Link href={`/academy/module/${quizModule.id}`}>
                    <Play className="mr-2 h-4 w-4" /> Start Quiz
                  </Link>
                </Button>              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
