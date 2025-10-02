import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Billing() {
  return (
    <div>
      <h2 className='font-bold text-3x text-center'>Choose Your Plan</h2>
      <p className='text-lg'>Select a Subscription Bundle to Get Access to ALL TOOLS</p>
      <PricingTable />
    </div>
  )
}

export default Billing
