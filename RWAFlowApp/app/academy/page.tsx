import type React from "react"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star, TrendingUp, BookOpen, CheckCircle, Circle, Award, Gem, PlayCircle } from "lucide-react"
import type { QuizQuestion, LearningModule } from "@/app/academy/module/[moduleId]/types"

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
  const questionsByLevel: Record<string, QuizQuestion[]> = { Beginner: [], Intermediate: [], Advanced: [] }
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
      completed: false,
      description: `Test your basic knowledge of Real World Assets. Contains ${questionsByLevel.Beginner.length} questions.`,
    })
  }
  if (questionsByLevel.Intermediate.length > 0) {
    quizzes.push({
      id: "intermediate-rwa-quiz",
      title: "Intermediate RWA Quiz",
      level: 2,
      questions: questionsByLevel.Intermediate,
      completed: false,
      description: `Challenge your intermediate understanding of RWAs. Contains ${questionsByLevel.Intermediate.length} questions.`,
    })
  }
  if (questionsByLevel.Advanced.length > 0) {
    quizzes.push({
      id: "advanced-rwa-quiz",
      title: "Advanced RWA Quiz",
      level: 3,
      questions: questionsByLevel.Advanced,
      completed: false,
      description: `Assess your advanced expertise in RWAs. Contains ${questionsByLevel.Advanced.length} questions.`,
    })
  }
  return quizzes
}
const newQuizList = parseCSVToQuizzes(csvData)
const academyData = {
  currentLevel: 1,
  experience: 0,
  flowTokens: 100,
  modulesCompleted: newQuizList.filter((q) => q.completed).length,
  totalModules: newQuizList.length,
  nft: {
    level: 1,
    rank: "Novice",
    tier: "Bronze Novice",
    currentXp: 0,
    xpForNextLevel: 1000,
    icon: <Award className="h-16 w-16 text-white" />,
    bgColor: "bg-green-gradient shadow-lg",
  },
  modules: newQuizList,
}

const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
  <Card className="shadow-lg bg-white border-gray-200">
    <CardContent className="pt-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      {icon}
    </CardContent>
  </Card>
)

export default function AcademyPage() {
  const { currentLevel, experience, flowTokens, modulesCompleted, totalModules, nft, modules } = academyData

  return (
    <div className="min-h-screen bg-white">
      {" "}
      {/* Ensure main content area is on top */}
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Current Level" value={currentLevel} icon={<Star className="h-8 w-8 text-yellow-400" />} />
          <StatCard
            title="Experience"
            value={`${experience} XP`}
            icon={<TrendingUp className="h-8 w-8 text-metallic-green" />}
          />
          <StatCard title="Flow Tokens" value={flowTokens} icon={<Gem className="h-8 w-8 text-purple-500" />} />{" "}
          {/* Kept purple for variety or change to metallic-green */}
          <StatCard
            title="Modules"
            value={`${modulesCompleted}/${totalModules}`}
            icon={<BookOpen className="h-8 w-8 text-metallic-green" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 shadow-xl bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Your Dynamic NFT</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className={`flex items-center justify-center h-40 w-40 rounded-2xl ${nft.bgColor}`}>
                  {nft.icon}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-700 text-white text-xs font-semibold rounded-md shadow">
                  {nft.tier}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Level {nft.level}</h3>
              <p className="text-md text-gray-500 mb-4">{nft.rank}</p>
              <Progress
                value={(nft.currentXp / nft.xpForNextLevel) * 100}
                className="w-full mb-1 [&>*]:bg-metallic-green"
              />
              <p className="text-xs text-gray-500">
                {nft.currentXp}/{nft.xpForNextLevel} XP for next level
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-xl bg-white border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-gray-800">Module Progress</CardTitle>
              <Button asChild className="bg-green-gradient text-white hover:opacity-90 transition-opacity shadow-md">
                <Link href="/academy/modules">
                  <PlayCircle className="mr-2 h-4 w-4" /> View All Quizzes
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {modules.map((quizModule) => (
                <Link key={quizModule.id} href={`/academy/module/${quizModule.id}`} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors border border-gray-200 hover:border-emerald-300 shadow-sm hover:shadow-md">

                    <div>
                      <p className="font-semibold text-gray-700">{quizModule.title}</p>
                      <p className="text-sm text-gray-500">
                        Level {quizModule.level} - {quizModule.questions.length} questions
                      </p>
                    </div>
                    {quizModule.completed ? (
                      <CheckCircle className="h-6 w-6 text-metallic-green" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-300" />
                    )}

                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
