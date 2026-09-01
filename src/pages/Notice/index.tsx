import { ErrorBlock } from 'antd-mobile'

import AppNavBar from '@/components/AppNavBar'

const Notice = () => {
  return (
    <>
      <AppNavBar title="公告" />

      <ErrorBlock status='empty' />
    </>
  )
}

export default Notice