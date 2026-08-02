export const architectureCase = {
    id: 'architecture',
    number: '01',
    title: '建筑再生',
    summary: '让屋脊上的装饰语言进入当代公共空间。',
    source: '潮州嵌瓷广泛应用于祠堂、庙宇与传统民居，以屋脊、山墙上的龙凤、花鸟等立体装饰寄托吉祥寓意。',
    sourceImages: [
      {
        id: 'anji-wangmiao',
        src: '/images/building/building_01.webp',
        name: '安济王庙',
        type: '潮汕传统庙宇建筑',
        location: '屋脊、檐部与正立面装饰区域',
        meaning: '通过瑞兽、花鸟等装饰语言表达守护、祈福与地方文化认同',
      },
      {
        id: 'guangji-tianhou',
        src: '/images/building/building_02.png',
        name: '广济楼天后宫',
        type: '宫庙式公共文化建筑',
        location: '屋脊、山墙及入口上方装饰区域',
        meaning: '以海洋信仰相关意象和吉祥纹样寄托平安、顺遂与共同体愿望',
      },
      {
        id: 'guanyin-temple',
        src: '/images/building/building_03.png',
        name: '观音庙',
        type: '潮汕传统信仰建筑',
        location: '屋脊、檐口及墙面重点装饰区域',
        meaning: '借助花鸟、祥云等视觉元素传达慈佑、安宁与吉祥愿景',
      },
      {
        id: 'congxi-ancestral-hall',
        src: '/images/building/building_04.png',
        name: '从熙公祠',
        type: '潮汕传统祠堂建筑',
        location: '屋脊、山墙与门楼装饰区域',
        meaning: '通过礼序化构图和吉祥题材表达宗族记忆、家族延续与人文秩序',
      },
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
        items: [
          { label: '朱红', meaning: '关联礼制、喜庆与建筑视觉焦点。', tone: 'vermilion' },
          { label: '釉绿', meaning: '连接自然、生机与传统彩瓷的釉色特征。', tone: 'glaze-green' },
          { label: '金色', meaning: '强化庄重、光泽与重要装饰部位的层级。', tone: 'gold' },
        ],
      },
      {
        id: 'pattern',
        number: '02',
        title: '纹样提取',
        description: '从龙凤、花鸟及卷草中提取轮廓与连续构图，形成可复用的现代图形语言。',
        items: [
          { label: '龙凤', meaning: '表达祥瑞、秩序与祝愿。' },
          { label: '花鸟', meaning: '连接自然生命、繁盛与日常审美。' },
          { label: '卷草纹', meaning: '通过连续曲线形成延展、连接与装饰节奏。' },
        ],
      },
      {
        id: 'structure',
        number: '03',
        title: '拼接结构提取',
        description: '分析瓷片的方向排列、碎片层叠和高低起伏，呈现嵌瓷特有的立体秩序。',
        items: [
          { label: '瓷片排列方式', meaning: '依据轮廓方向组织碎片，形成连续边界和视觉走势。' },
          { label: '层叠关系', meaning: '以前后覆盖建立纹样层次和局部厚度。' },
          { label: '高低起伏结构', meaning: '通过不同高度塑造立体明暗和远近关系。' },
        ],
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
    coverImage: {
      src: '/images/modern/daily/cover/daily_cover.png',
      alt: '日常新生案例入口',
    },
    source: '传统嵌瓷中的牡丹、花鸟与卷草纹样，以及彩瓷碎片形成的细密质感。',
    images: {
      source: {
        src: '/images/modern/daily/source/daily_source.png',
        alt: '日常新生传统来源',
      },
      extraction: {
        src: '/images/modern/daily/extraction/daily_extraction.png',
        alt: '日常新生嵌瓷元素提取',
      },
      application: {
        src: '/images/modern/daily/application/daily_application.png',
        alt: '日常新生现代设计应用',
      },
    },
    elements: ['花瓣曲线', '碎片肌理', '低饱和朱红'],
    application: '将纹样比例缩小并简化，应用于茶器、香具、桌面摆件和文化礼品。',
    concept: '将传统花鸟纹样转化为可进入日常的器物语言。',
  },
  {
    id: 'art',
    number: '02',
    title: '艺术跨界',
    summary: '以装置和跨媒介表达重新理解嵌瓷精神。',
    coverImage: {
      src: '/images/modern/art/cover/art_cover.png',
      alt: '艺术跨界案例入口',
    },
    source: '传统屋脊瑞兽、戏曲人物和夸张动态所形成的叙事性嵌瓷场景。',
    images: {
      source: {
        src: '/images/modern/art/source/art_source.png',
        alt: '艺术跨界传统来源',
      },
      extraction: {
        src: '/images/modern/art/extraction/art_extraction.png',
        alt: '艺术跨界嵌瓷元素提取',
      },
      application: {
        src: '/images/modern/art/application/art_application.png',
        alt: '艺术跨界现代设计应用',
      },
    },
    elements: ['动态剪影', '碎片反光', '叙事组合'],
    application: '把瓷片、光影与可拆装结构结合，形成展览装置、舞台视觉和跨媒介艺术作品。',
    concept: '不复制传统题材，而是延续手工拼合、材料再生与集体叙事的文化内核。',
  },
]
