import InheritorLineage from '../components/InheritorLineage'

export default function Inheritors() {
  return (
    <div className="basic-page inheritors-page">
      <section className="basic-page__heading">
        <p className="basic-page__label">潮汕嵌瓷 · 传承谱系</p>
        <h1>守艺传承</h1>
        <span aria-hidden="true" />
        <p>一条屋脊，连接数代匠人的坚守与创新</p>
      </section>

      <InheritorLineage />
    </div>
  )
}
