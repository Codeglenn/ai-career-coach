"use client"
import { PricingTable } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import axios from 'axios'

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'Forever Free',
        description: 'Perfect for getting started',
        features: [
            'Up to 5 AI Chats',
            '1 Resume Analysis',
            'No Career Roadmap',
            'Basic Support',
            'Limited History',
        ],
        cta: 'Current Plan',
        popular: false,
        planId: 'free'
    },
    {
        name: 'Professional',
        price: '$9.99',
        period: '/month',
        description: 'Best for active job seekers',
        features: [
            'Unlimited AI Chats',
            'Unlimited Resume Analysis',
            'Limited Roadmaps (5/month)',
            'Priority Email Support',
            'Full History Access',
            'Export Insights',
        ],
        cta: 'Upgrade to Professional',
        popular: true,
        planId: 'professional'
    },
    {
        name: 'Premium',
        price: '$24.99',
        period: '/month',
        description: 'For serious career changers',
        features: [
            'Unlimited Everything',
            'Unlimited Career Roadmaps',
            'Personal Career Coach Chat',
            '24/7 Priority Support',
            'Advanced Analytics',
            'Custom Reports',
            'Job Market Insights',
        ],
        cta: 'Upgrade to Premium',
        popular: false,
        planId: 'premium'
    },
]

function Billing() {
    const [userPlan, setUserPlan] = useState<string>('free')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUserSubscription()
    }, [])

    const fetchUserSubscription = async () => {
        try {
            const result = await axios.get('/api/subscription')
            setUserPlan(result.data.plan || 'free')
        } catch (error) {
            console.error('Failed to fetch subscription:', error)
            setUserPlan('free')
        } finally {
            setLoading(false)
        }
    }

    const handleUpgrade = async (planId: string) => {
        if (planId === userPlan) return
        
        try {
            setLoading(true)
            await axios.post('/api/subscription', {
                plan: planId,
                clerkSubscriptionId: `${planId}-${Date.now()}`
            })
            setUserPlan(planId)
            alert(`Successfully upgraded to ${planId}!`)
        } catch (error) {
            console.error('Upgrade failed:', error)
            alert('Failed to upgrade. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12'>
            {/* Header */}
            <div className='text-center mb-12'>
                <h1 className='font-bold text-4xl mb-4 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent'>Choose Your Plan</h1>
                <p className='text-lg text-gray-600 dark:text-gray-400'>Select a subscription to unlock all AI tools and features</p>
            </div>

            {/* Plans Grid */}
            <div className='max-w-7xl mx-auto px-4 mb-12'>
                <div className='grid md:grid-cols-3 gap-8'>
                    {plans.map((plan) => (
                        <div
                            key={plan.planId}
                            className={`relative rounded-2xl transition-all duration-300 ${
                                plan.popular
                                    ? 'md:scale-105 bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-2xl'
                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg'
                            }`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                                    <span className='bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold'>Most Popular</span>
                                </div>
                            )}

                            <div className='p-8'>
                                {/* Plan Name */}
                                <h3 className='text-2xl font-bold mb-2'>{plan.name}</h3>
                                <p className={`text-sm mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {plan.description}
                                </p>

                                {/* Price */}
                                <div className='mb-6'>
                                    <span className='text-4xl font-bold'>{plan.price}</span>
                                    <span className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {plan.period}
                                    </span>
                                </div>

                                {/* CTA Button */}
                                <Button
                                    onClick={() => handleUpgrade(plan.planId)}
                                    disabled={userPlan === plan.planId || loading}
                                    className={`w-full mb-8 rounded-lg font-semibold py-3 ${
                                        userPlan === plan.planId
                                            ? plan.popular
                                                ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-white cursor-default'
                                                : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-default'
                                            : plan.popular
                                                ? 'bg-white text-blue-600 hover:bg-gray-100'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {userPlan === plan.planId ? '✓ Current Plan' : plan.cta}
                                </Button>

                                {/* Features List */}
                                <div className='space-y-4'>
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className='flex items-start gap-3'>
                                            <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                                plan.popular ? 'text-white' : 'text-green-500'
                                            }`} />
                                            <span className='text-sm'>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className='max-w-4xl mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white'>Frequently Asked Questions</h2>
                <div className='grid gap-6'>
                    {[
                        {
                            q: 'Can I change my plan anytime?',
                            a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
                        },
                        {
                            q: 'Do you offer refunds?',
                            a: 'We offer a 7-day money-back guarantee if you are not satisfied with your subscription.'
                        },
                        {
                            q: 'What payment methods do you accept?',
                            a: 'We accept all major credit cards, Apple Pay, Google Pay, and bank transfers.'
                        },
                        {
                            q: 'Is there a free trial?',
                            a: 'Yes! Start with our free plan to explore all features. Upgrade anytime to get unlimited access.'
                        },
                    ].map((item, idx) => (
                        <div key={idx} className='bg-white dark:bg-gray-800 rounded-lg p-6'>
                            <h3 className='font-semibold text-lg mb-2 text-gray-900 dark:text-white'>{item.q}</h3>
                            <p className='text-gray-600 dark:text-gray-400'>{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Billing
