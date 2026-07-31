export const architectureCase = {
    id: 'architecture',
    number: '01',
    title: '建筑再生',
    summary: '让屋脊上的装饰语言进入当代公共空间。',
    source: '潮州嵌瓷广泛应用于祠堂、庙宇与传统民居，以屋脊、山墙上的龙凤、花鸟等立体装饰寄托吉祥寓意。',
    sourceImages: [
      { src: '/images/building/building-01.webp', name: '安济王庙' },
      { src: '/images/building/building-02.png', name: '广济楼天后宫' },
      { src: '/images/building/building-03.png', name: '观音庙' },
      { src: '/images/building/building-04.png', name: '从熙公祠' },
    ],
    elements: [
      '色彩｜低饱和朱红、釉绿与金色关系',
      '纹样｜龙凤、花鸟及卷草轮廓',
      '瓷片拼接结构｜碎片层叠、方向排列与高低起伏',
    ],
    extractions: [
      {
        id: 'color',
        number: '01',
        title: '色彩提取',
        description: '提炼低饱和朱红、釉绿与金色关系，保留传统建筑装饰的节奏和层次。',
      },
      {
        id: 'pattern',
        number: '02',
        title: '纹样提取',
        description: '从龙凤、花鸟及卷草中提取轮廓与连续构图，形成可复用的现代图形语言。',
      },
      {
        id: 'structure',
        number: '03',
        title: '拼接结构提取',
        description: '分析瓷片的方向排列、碎片层叠和高低起伏，呈现嵌瓷特有的立体秩序。',
      },
    ],
    application: '将传统色彩、纹样和瓷片拼接秩序转化为空间界面、导视系统与公共艺术语言。',
    concept: '通过数字化提取与重组传统文化结构，使嵌瓷非遗元素进入现代设计语境，在延续文化识别的同时形成新的应用方式。',
}

export const modernCases = [
  {
    id: 'daily',
    number: '01',
    title: '日常新生',
    summary: '把花鸟纹样和瓷片肌理带回日常生活。',
    source: '传统嵌瓷中的牡丹、花鸟与卷草纹样，以及彩瓷碎片形成的细密质感。',
    elements: ['花瓣曲线', '碎片肌理', '低饱和朱红'],
    application: '将纹样比例缩小并简化，应用于茶器、香具、桌面摆件和文化礼品。',
    concept: '将传统花鸟纹样转化为可进入日常的器物语言。',
  },
  {
    id: 'art',
    number: '02',
    title: '艺术跨界',
    summary: '以装置和跨媒介表达重新理解嵌瓷精神。',
    source: '传统屋脊瑞兽、戏曲人物和夸张动态所形成的叙事性嵌瓷场景。',
    elements: ['动态剪影', '碎片反光', '叙事组合'],
    application: '把瓷片、光影与可拆装结构结合，形成展览装置、舞台视觉和跨媒介艺术作品。',
    concept: '不复制传统题材，而是延续手工拼合、材料再生与集体叙事的文化内核。',
  },
]
