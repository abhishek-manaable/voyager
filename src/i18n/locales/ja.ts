export default {
  common: {
    dashboard: 'ダッシュボード',
    settings: '設定',
    theme: {
      title: 'テーマ設定',
      light: 'ライトモード',
      dark: 'ダークモード',
    },
    language: {
      title: '言語設定',
      en: '英語',
      ja: '日本語',
    },
  },
  apps: {
    dashboard: 'ダッシュボード',
    sun: 'SUN',
    mercury: 'MERCURY',
    venus: 'VENUS',
    mars: 'MARS',
    jupiter: 'JUPITER',
    saturn: 'SATURN',
    uranus: 'URANUS',
    neptune: 'NEPTUNE'
  },
  dashboard: {
    metrics: {
      moon: 'Moon Metrics',
      northStar: 'North Star Metrics',
    },
    roles: {
      manager: '管理者向け',
    },
    kpi: {
      arr: 'ARR',
      arrProgress: '四半期目標進捗',
      nrr: 'NRR',
      milestones: '重要マイルストーン',
      trainingApplicants: '研修申込者数',
      trainingCompletion: '研修修了率',
    },
  },
  contracts: {
    title: '契約管理',
    list: '契約一覧',
    new: '新規契約',
    renewal: '契約更新',
    edit: '契約編集',
    form: {
      clientName: 'クライアント名',
      startDate: '契約開始日',
      endDate: '契約終了日',
      annualValue: '年間契約額 (ARR)',
      notes: '備考',
      save: '保存',
      cancel: 'キャンセル',
      required: 'この項目は必須です',
      invalidValue: '有効な値を入力してください',
    },
    initialDate: '初回契約日',
  },
  chart: {
    arr: {
      title: 'ARR推移',
      period: {
        '1y': '1年',
        '2y': '2年',
        '3y': '3年',
        'all': '全期間',
      },
    },
  },
  targets: {
    title: 'ARR目標',
    year: '年度',
    month: '月',
    amount: '目標額',
  },
  manager: {
    menu: {
      contracts: '契約管理',
      targets: 'ARR目標',
    },
  },
  admin: {
    userManagement: {
      title: 'ユーザー管理',
      searchPlaceholder: 'ユーザーを検索...',
      allRoles: '全ての役割',
      table: {
        user: 'ユーザー',
        role: '役割',
        status: 'ステータス',
        lastLogin: '最終ログイン',
        actions: '操作'
      },
      roles: {
        admin: '管理者',
        hr_manager: 'HR管理者',
        manager: 'マネージャー',
        employee: '従業員'
      },
      roleDescriptions: {
        admin: 'システムへのフルアクセスと制御',
        hr_manager: 'HR管理と従業員データへのアクセス',
        manager: 'チーム管理とレポートへのアクセス',
        employee: '個人データとツールへの基本的なアクセス'
      },
      status: {
        active: '有効',
        inactive: '無効'
      },
      statusDescriptions: {
        active: 'システムにアクセス可能',
        inactive: 'システムへのアクセスが無効'
      },
      actions: {
        edit: '編集'
      },
      modal: {
        updateRole: 'ユーザー役割の更新',
        updateStatus: 'ユーザーステータスの更新'
      }
    }
  }
};