import { useState } from 'react'
import BuildingResearchGallery from '../components/BuildingResearchGallery'
import ModernCaseDetail from '../components/ModernCaseDetail'
import { architectureCase } from '../data/modernCases'

export default function Building() {
  const [activeBuildingId, setActiveBuildingId] = useState(null)

  const handleBuildingToggle = (buildingId) => {
    setActiveBuildingId((currentId) => (
      currentId === buildingId ? null : buildingId
    ))
  }

  return (
    <div className="basic-page">
      <section className="basic-page__heading">
        <p className="basic-page__label">建筑艺术 · 数字展陈</p>
        <h1>{architectureCase.title}</h1>
        <span aria-hidden="true" />
        <p>{architectureCase.summary}</p>
      </section>

      <ModernCaseDetail
        item={architectureCase}
        sourceContent={(
          <BuildingResearchGallery
            images={architectureCase.sourceImages}
            activeId={activeBuildingId}
            onToggle={handleBuildingToggle}
          />
        )}
        showHeader={false}
        showModernTranslation={false}
      />
    </div>
  )
}
