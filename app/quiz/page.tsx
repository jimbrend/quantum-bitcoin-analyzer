"use client"

import { useState } from 'react'

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const questions = [
    {
      question: "What type of Bitcoin wallet do you use?",
      options: [
        "Hardware wallet (e.g., Ledger, Trezor)",
        "Software wallet (e.g., Electrum, Bitcoin Core)",
        "Mobile wallet (e.g., BlueWallet, Phoenix)",
        "Exchange wallet (e.g., Coinbase, Binance)"
      ]
    }
    // Add more questions here
  ]

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }))
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Bitcoin Wallet Security Quiz</h1>
        
        {currentQuestion < questions.length ? (
          <div className="space-y-6">
            <h2 className="text-xl">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <p className="text-lg">{questions[currentQuestion].question}</p>
            
            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-4 text-left border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl mb-4">Quiz Completed!</h2>
            <p>Thank you for completing the quiz. Your answers have been recorded.</p>
          </div>
        )}
      </div>
    </div>
  )
} 