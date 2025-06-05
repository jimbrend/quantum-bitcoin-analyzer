"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, AlertTriangle, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import VercelLogoParticles from "@/vercel-logo-particles"

interface Question {
  id: string
  question: string
  options: { value: string; label: string; score: number }[]
  explanation?: string
  allowMultiple?: boolean
}

const questions: Question[] = [
  {
    id: "creation-year",
    question: "When was your Bitcoin wallet first created?",
    options: [
      { value: "2009-2012", label: "2009-2012 (Early Bitcoin era)", score: 3 },
      { value: "2013-2016", label: "2013-2016 (Pre-SegWit)", score: 2 },
      { value: "2017-2020", label: "2017-2020 (SegWit adoption)", score: 1 },
      { value: "2021-present", label: "2021-Present (Modern era)", score: 0 },
      { value: "2025", label: "2025+ (I live in the future)", score: 12 },
    ],
    explanation:
      "Older wallets are more likely to use legacy address formats that are more vulnerable to quantum attacks.",
  },
  {
    id: "address-format",
    question: "What does your Bitcoin address typically start with?",
    options: [
      { value: "1", label: "Starts with '1' (e.g., 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNaxxxxxxxx)", score: 3 },
      { value: "3", label: "Starts with '3' (e.g., 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLyxxxxxxxx)", score: 2 },
      { value: "bc1q", label: "Starts with 'bc1q' (e.g., bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlhxxxx)", score: 1 },
      { value: "bc1p", label: "Starts with 'bc1p' (e.g., bc1pmzfrwwndsqmk5yh69yjr5lfgfg4ev8c0tsc06exxxx)", score: 0 },
    ],
    explanation: "Address format reveals the underlying script type and cryptographic security level.",
  },
  {
    id: "wallet-type",
    question: "What type of wallet do you use? (Select all that apply)",
    options: [
      { value: "hardware", label: "Hardware wallet (Ledger, Trezor, Coldcard, Blockstream)", score: 0 },
      { value: "mobile", label: "Mobile wallet (BlueWallet, Phoenix)", score: 1 },
      { value: "desktop", label: "Desktop wallet (Electrum, Exodus, Sparrow and updated to newer versions)", score: 1 },
      { value: "exchange", label: "Exchange wallet (Coinbase, Binance, etc.)", score: 2 },
      { value: "paper", label: "Paper wallet or old backup", score: 3 },
      { value: "quantum-safe", label: "You can also just check this box instead, p.s. no wallet is quantum safe yet", score: 0 },
    ],
    explanation: "Hardware wallets and modern software wallets typically implement better security practices. You can check multiple boxes.",
    allowMultiple: true,
  },
  {
    id: "transaction-history",
    question: "How often do you reuse the same Bitcoin address?",
    options: [
      { value: "always-same", label: "I always use the same address", score: 3 },
      { value: "few-addresses", label: "I use a few different addresses repeatedly", score: 2 },
      { value: "sometimes-new", label: "I sometimes generate new addresses", score: 1 },
      { value: "always-new", label: "I always use a new address for each transaction", score: 0 },
    ],
    explanation: "Address reuse increases quantum vulnerability by exposing public keys multiple times.",
  },
]

export default function Page() {
  const [showSplash, setShowSplash] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [showResults, setShowResults] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  if (showSplash) {
    return (
      <div onClick={() => setShowSplash(false)} style={{ cursor: 'pointer' }}>
        <VercelLogoParticles />
      </div>
    )
  }

  const handleAnswer = (value: string) => {
    const question = questions[currentStep]
    
    if (question.allowMultiple) {
      setAnswers((prev) => {
        const currentAnswers = (prev[question.id] as string[]) || []
        const newAnswers = currentAnswers.includes(value)
          ? currentAnswers.filter((v) => v !== value)
          : [...currentAnswers, value]
        return { ...prev, [question.id]: newAnswers }
      })
    } else {
      setAnswers((prev) => ({ ...prev, [question.id]: value }))
      if (currentStep < questions.length - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        setShowResults(true)
      }
    }
  }

  const calculateRiskScore = () => {
    let totalScore = 0
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find((q) => q.id === questionId)
      if (question) {
        if (Array.isArray(answer)) {
          // For multiple selection, take the highest score
          const questionScore = Math.max(
            ...answer.map(
              (value) =>
                question.options.find((opt) => opt.value === value)?.score || 0
            )
          )
          totalScore += questionScore
        } else {
          // For single selection
          const option = question.options.find((opt) => opt.value === answer)
          if (option) totalScore += option.score
        }
      }
    })
    return totalScore
  }

  const getRiskLevel = (score: number) => {
    if (score >= 9)
      return { level: "High", color: "destructive", description: "Legacy wallet with high quantum vulnerability" }
    if (score >= 6)
      return { level: "Medium", color: "warning", description: "Mixed legacy features with some quantum risks" }
    if (score >= 3) return { level: "Low", color: "secondary", description: "Modern wallet with reduced quantum risks" }
    return { level: "Very Low", color: "default", description: "Quantum-resistant wallet configuration" }
  }

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      setShowSplash(true)
    }
  }

  const progress = ((currentStep + 1) / questions.length) * 100

  if (showResults) {
    const riskScore = calculateRiskScore()
    const riskLevel = getRiskLevel(riskScore)
    const selectedFuture = answers["creation-year"] === "2025"

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6" />
              Wallet Analysis Results
            </CardTitle>
            <CardDescription>
              Based on your answers, here's your wallet's quantum vulnerability assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Badge variant={riskLevel.color as any} className="text-lg px-4 py-2">
                {riskLevel.level} Risk
              </Badge>
              <p className="mt-2 text-muted-foreground">
                {selectedFuture
                  ? "You chose you lived in the future so you're not safe, but don't be worried, Bitcoiners will probably fix this"
                  : riskLevel.description}
              </p>
              <p className="text-sm mt-1">Risk Percentage: {Math.round((riskScore / 12) * 100)}%</p>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>External Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Learn More</h4>
                  <div className="space-y-2">
                    <a
                      href="https://cointelegraph.com/news/quantum-computers-could-break-bitcoin-encryption-by-2022"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-orange-200 hover:text-orange-300"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Coin Telegraph Article on Quantum Bitcoin Threat
                    </a>
                    <a
                      href="https://grok.x.ai/search?q=quantum+bitcoin+security"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-orange-200 hover:text-orange-300"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Search Grok for Quantum Bitcoin Security
                    </a>
                    <a
                      href="https://bitcoin.org/en/choose-your-wallet?step=1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-orange-200 hover:text-orange-300"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      More about Bitcoin wallets via Bitcoin.org here
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>What is the Quantum Threat?</strong>
                <br />
                Quantum computers could potentially break the cryptographic algorithms that secure Bitcoin wallets.
                This threat is still not realized, and mostly in a research phase.
                Quantum computers are not optimized like modern platforms, they do not yet scale to pose a serious threat.
                Legacy wallets using older address formats (starting with "1") are most vulnerable because they expose
                public keys when spending, which quantum computers could use to derive private keys.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {selectedFuture ? (
                    <>
                      <p>
                        <strong>Current Status:</strong> No quantum threat yet (In reality there is no quantum threat yet)
                      </p>
                      <p>
                        <strong>Estimated Timeline:</strong> 10-20 years for cryptographically relevant quantum computers
                      </p>
                      <p>
                        <strong>Vulnerable Wallets:</strong> P2PKH addresses (starting with "1") with exposed public keys
                      </p>
                      <p>
                        <strong>Safe Practices:</strong> Use new addresses, modern wallet software, and hardware wallets
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => {
                          setCurrentStep(0)
                          setAnswers({})
                          setShowResults(false)
                        }}
                      >
                        Click here to come back to the present
                      </Button>
                      <div className="mt-4 space-y-2 text-orange-500">
                        <p>You're living in the future!</p>
                        <p>Bitcoin's security is being tested.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>Current Status:</strong> No quantum threat yet (In reality there is no quantum threat yet)
                      </p>
                      <p>
                        <strong>Estimated Timeline:</strong> 10-20 years for cryptographically relevant quantum computers
                      </p>
                      <p>
                        <strong>Vulnerable Wallets:</strong> P2PKH addresses (starting with "1") with exposed public keys
                      </p>
                      <p>
                        <strong>Safe Practices:</strong> Use new addresses, modern wallet software, and hardware wallets
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Immediate Steps</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Use a modern Bitcoin wallet (2020 or newer)</li>
                      <li>Enable SegWit or Native SegWit addresses</li>
                      <li>Consider using a hardware wallet</li>
                      <li>Keep your wallet software updated</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Long-term Security</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Monitor quantum computing developments</li>
                      <li>Stay informed about Bitcoin protocol updates</li>
                      <li>Consider using a multi-signature setup</li>
                      <li>Keep your private keys secure and offline</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep(0)
                  setAnswers({})
                  setShowResults(false)
                }}
              >
                Start Over
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {!showResults && (
        <div className="flex justify-between items-center mb-6">
          <Progress value={progress} className="w-full" />
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-200">Quantum Bitcoin Security Assessment</CardTitle>
          <CardDescription className="text-orange-200/70">
            {showResults ? 'Your Results' : `Question ${currentStep + 1} of ${questions.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showResults ? (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-orange-200">{questions[currentStep].question}</h3>
                {questions[currentStep].explanation && (
                  <div className="text-sm text-orange-200/70">
                    <strong>Why this is important:</strong> {questions[currentStep].explanation}
                  </div>
                )}
                {questions[currentStep].allowMultiple ? (
                  <div className="space-y-2">
                    {questions[currentStep].options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg border border-orange-500/30 hover:bg-muted/50">
                        <Checkbox
                          id={option.value}
                          checked={(answers[questions[currentStep].id] as string[])?.includes(option.value)}
                          onCheckedChange={() => handleAnswer(option.value)}
                          className="border-orange-500/30 data-[state=checked]:bg-orange-500/30 data-[state=checked]:border-orange-500/30"
                        />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer text-orange-200">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <RadioGroup
                    value={answers[questions[currentStep].id] as string}
                    onValueChange={handleAnswer}
                    className="space-y-2"
                  >
                    {questions[currentStep].options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg border border-orange-500/30 hover:bg-muted/50">
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className="border-orange-500/30 data-[state=checked]:bg-orange-500 data-[state=checked]:text-orange-900"
                        />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer text-orange-200">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
              <div className="flex justify-between mt-6">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="px-6 py-2 rounded-lg hover:bg-orange-500/20 border-orange-500/30 text-orange-200"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                )}
                <div className="flex-1" />
                <Button onClick={nextStep} className="px-6 py-2 rounded-lg bg-orange-500/30 hover:bg-orange-500/40 text-orange-200">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <Badge variant={getRiskLevel(calculateRiskScore()).color as any} className="text-lg px-4 py-2">
                  {getRiskLevel(calculateRiskScore()).level} Risk
                </Badge>
                <p className="mt-2 text-muted-foreground">
                  {answers["creation-year"] === "2025"
                    ? "You chose you lived in the future so you're not safe, but don't be worried, Bitcoiners will probably fix this"
                    : getRiskLevel(calculateRiskScore()).description}
                </p>
                <p className="text-sm mt-1">Risk Percentage: {Math.round((calculateRiskScore() / 12) * 100)}%</p>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>External Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Learn More</h4>
                    <div className="space-y-2">
                      <a
                        href="https://cointelegraph.com/news/quantum-computers-could-break-bitcoin-encryption-by-2022"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-orange-200 hover:text-orange-300"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Coin Telegraph Article on Quantum Bitcoin Threat
                      </a>
                      <a
                        href="https://grok.x.ai/search?q=quantum+bitcoin+security"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-orange-200 hover:text-orange-300"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Search Grok for Quantum Bitcoin Security
                      </a>
                      <a
                        href="https://bitcoin.org/en/choose-your-wallet?step=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-orange-200 hover:text-orange-300"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        More about Bitcoin wallets via Bitcoin.org here
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>What is the Quantum Threat?</strong>
                  <br />
                  Quantum computers could potentially break the cryptographic algorithms that secure Bitcoin wallets.
                  This threat is still not realized, and mostly in a research phase.
                  Quantum computers are not optimized like modern platforms, they do not yet scale to pose a serious threat.
                  Legacy wallets using older address formats (starting with "1") are most vulnerable because they expose
                  public keys when spending, which quantum computers could use to derive private keys.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {answers["creation-year"] === "2025" ? (
                      <>
                        <p>
                          <strong>Current Status:</strong> No quantum threat yet (In reality there is no quantum threat yet)
                        </p>
                        <p>
                          <strong>Estimated Timeline:</strong> 10-20 years for cryptographically relevant quantum computers
                        </p>
                        <p>
                          <strong>Vulnerable Wallets:</strong> P2PKH addresses (starting with "1") with exposed public keys
                        </p>
                        <p>
                          <strong>Safe Practices:</strong> Use new addresses, modern wallet software, and hardware wallets
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4"
                          onClick={() => {
                            setCurrentStep(0)
                            setAnswers({})
                            setShowResults(false)
                          }}
                        >
                          Click here to come back to the present
                        </Button>
                        <div className="mt-4 space-y-2 text-orange-500">
                          <p>You're living in the future!</p>
                          <p>Bitcoin's security is being tested.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>Current Status:</strong> No quantum threat yet (In reality there is no quantum threat yet)
                        </p>
                        <p>
                          <strong>Estimated Timeline:</strong> 10-20 years for cryptographically relevant quantum computers
                        </p>
                        <p>
                          <strong>Vulnerable Wallets:</strong> P2PKH addresses (starting with "1") with exposed public keys
                        </p>
                        <p>
                          <strong>Safe Practices:</strong> Use new addresses, modern wallet software, and hardware wallets
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Learn More</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">External Resources</h4>
                      <div className="space-y-2">
                        <a
                          href="https://cointelegraph.com/news/quantum-computers-could-break-bitcoin-encryption-by-2022"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-orange-200 hover:text-orange-300"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Coin Telegraph Article on Quantum Bitcoin Threat
                        </a>
                        <a
                          href="https://grok.x.ai/search?q=quantum+bitcoin+security"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-orange-200 hover:text-orange-300"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Search Grok for Quantum Bitcoin Security
                        </a>
                        <a
                          href="https://bitcoin.org/en/choose-your-wallet?step=1"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-orange-200 hover:text-orange-300"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          More about Bitcoin wallets via Bitcoin.org here
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}