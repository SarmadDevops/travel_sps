import React from 'react'
import RefreshBalanceForm from '../../components/dashboard/balance/RefeshBalanceForm'
import RefreshBalanceTable from '../../components/dashboard/balance/RefreshBalanceTable'

const RefreshBalance = () => {
  return (
    <div className='flex flex-col gap-14 p-2'>
      <div>
        <RefreshBalanceForm/>
      </div>
     <div>
       <RefreshBalanceTable/>
     </div>
    </div>
  )
}

export default RefreshBalance