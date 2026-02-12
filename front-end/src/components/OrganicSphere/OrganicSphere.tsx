import React from 'react'
import { OrganicSphereInternal } from './components/SphereRenderer'
import { OrganicSphereProps } from './types'

export const OrganicSphere: React.FC<OrganicSphereProps> = (props) => {
  return <OrganicSphereInternal {...props} />
}