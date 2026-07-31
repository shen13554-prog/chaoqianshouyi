import ModernCaseDetail from '../components/ModernCaseDetail'
import { architectureCase } from '../data/modernCases'

export default function Building() {
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
        showHeader={false}
        showModernTranslation={false}
      />
    </div>
  )
}
