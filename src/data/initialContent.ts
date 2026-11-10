/**
 * NỘI DUNG GỐC của website – nguyên văn theo hồ sơ năng lực An Tín Korea.
 * Mọi văn bản hiển thị ở trang chủ đều đi qua store (localStorage) khởi tạo từ file này,
 * và có thể sửa trực tiếp tại /admin/content mà không cần đụng vào JSX.
 */

export interface ProgramItem {
  id: string
  title: string
  badge: string
  description: string
}

export interface RoadmapStep {
  no: string
  title: string
  description: string
}

export interface OrgBlock {
  title: string
  block: string
  units: string[]
}

export interface KoreaStaff {
  name: string
  role: string
}


/** Nhãn giao diện (menu, nút, form…) – cũng nằm trong CMS để sửa và dịch như mọi nội dung khác. */
const uiDefaults = {
  nav: {
    home: 'Trang chủ',
    about: 'Giới thiệu',
    team: 'Đội ngũ',
    programs: 'Chương trình',
    roadmap: 'Lộ trình',
    facilities: 'Cơ sở vật chất',
    universities: 'Trường đối tác',
    news: 'Tin tức',
    contact: 'Liên hệ',
    register: 'Đăng ký tư vấn',
    menuOpen: 'Mở menu',
    menuClose: 'Đóng menu',
    mainLabel: 'Điều hướng chính',
    mobileLabel: 'Menu di động',
    langLabel: 'Ngôn ngữ',
  },
  common: {
    hotline: 'Hotline',
    email: 'Email',
    taxCode: 'Mã số thuế',
    legalRep: 'Đại diện pháp luật',
    hqVn: 'Trụ sở chính (Việt Nam)',
    hqKr: 'Chi nhánh tại Hàn Quốc',
    admin: 'Quản trị',
    breadcrumbHome: 'Trang chủ',
    notFoundTitle: 'Không tìm thấy trang bạn cần.',
    backHome: 'Về trang chủ',
    loading: 'Đang tải…',
    sitemap: 'Sơ đồ trang',
    close: 'Đóng',
    prevPhoto: 'Ảnh trước',
    nextPhoto: 'Ảnh sau',
    viewPhoto: 'Xem ảnh',
  },
  home: {
    cardsEyebrow: 'Khám phá An Tín Korea',
    cardsTitle: 'Mọi điều bạn cần biết trước khi du học Hàn Quốc',
    cardAbout: 'Câu chuyện, tầm nhìn, sứ mệnh và 5 giá trị cốt lõi của An Tín Korea.',
    cardTeam: 'Bộ máy lãnh đạo và đội ngũ chuyên viên tại Việt Nam và Hàn Quốc.',
    cardPrograms: 'Du học tiếng Hàn, chuyên ngành, sau đại học và lớp tiếng Hàn Online / Offline.',
    cardRoadmap: '6 bước chuẩn hóa từ định hướng đến khi lên đường.',
    cardFacilities: 'Ký túc xá, lớp học và hình ảnh thực tế của học viên.',
    cardUniversities: 'Danh sách trường đối tác tại Hàn Quốc, lọc theo khu vực và hệ đào tạo.',
    learnMore: 'Xem chi tiết',
    newsEyebrow: 'Tin tức',
    newsTitle: 'Bài viết mới nhất',
    newsAll: 'Xem tất cả bài viết',
    ctaTitle: 'Sẵn sàng bắt đầu hành trình du học?',
    ctaText: 'Để lại thông tin, đội ngũ An Tín Korea sẽ tư vấn lộ trình phù hợp với bạn.',
  },
  about: { eyebrow: 'An Tín Korea' },
  team: { eyebrow: 'Đội ngũ' },
  programs: {
    eyebrow: 'Chương trình',
    tabsLabel: 'Chương trình đào tạo',
    registerThis: 'Đăng ký tư vấn chương trình này',
    posterAlt: 'Tuyển sinh du học Hàn Quốc các hệ đào tạo – An Tín Korea',
  },
  roadmap: { eyebrow: 'Quy trình', step: 'Bước' },
  facilities: {
    eyebrow: 'Thực tế tại An Tín',
    tabsLabel: 'Cơ sở vật chất và hình ảnh học viên',
    empty: 'Chưa có ảnh nào được hiển thị trong mục này.',
    showAll: 'Xem tất cả {n} ảnh',
    collapse: 'Thu gọn',
  },
  universities: {
    eyebrow: 'Đối tác',
    intro: 'Lọc theo khu vực và hệ đào tạo để tìm trường phù hợp với hồ sơ của bạn.',
    filterRegion: 'Lọc theo khu vực',
    filterTrack: 'Lọc theo hệ đào tạo',
    all: 'Tất cả',
    allTracks: 'Mọi hệ',
    regionSeoul: 'Seoul',
    regionGyeonggi: 'Gyeonggi - Incheon',
    regionOther: 'Khu vực khác',
    d4: 'Hệ tiếng D-4-1',
    d2: 'Chuyên ngành D-2',
    featured: 'Nổi bật',
    tuition: 'Học phí dự kiến',
    showing: 'Hiển thị {n} / {total} trường',
    none: 'Chưa có trường nào khớp bộ lọc này.',
    partnersLabel: 'Một số trường đối tác',
  },
  contact: {
    eyebrow: 'Liên hệ',
    formTitle: 'Nhận tư vấn lộ trình miễn phí',
    formIntro: 'Để lại thông tin, đội ngũ An Tín Korea sẽ liên hệ lại với bạn.',
    name: 'Họ và tên',
    namePh: 'Nguyễn Văn A',
    phone: 'SĐT / Zalo',
    birthYear: 'Năm sinh',
    gpa: 'GPA',
    gpaHint: 'Điểm trung bình (thang 10)',
    school: 'Trường mong muốn',
    noSchool: 'Chưa chọn trường',
    program: 'Chương trình quan tâm',
    noProgram: 'Chưa chọn chương trình',
    note: 'Ghi chú',
    notePh: 'Bạn muốn được tư vấn điều gì?',
    send: 'Gửi đăng ký tư vấn',
    sending: 'Đang gửi…',
    sent: 'Đã gửi ✓',
    errName: 'Vui lòng nhập họ tên.',
    errPhone: 'Vui lòng nhập số điện thoại / Zalo.',
    errPhoneFormat: 'Số điện thoại chưa đúng định dạng (ví dụ 0988 574 395).',
    errBirth: 'Năm sinh gồm 4 chữ số.',
    errGpa: 'GPA nhập trong khoảng 0 – 10.',
    errCheck: 'Vui lòng kiểm tra lại thông tin',
    okTitle: 'Đã gửi đăng ký tư vấn',
    okText: 'An Tín Korea sẽ liên hệ với bạn sớm nhất.',
    officeVnAlt: 'Trụ sở chính tại Hoài Đức, Hà Nội',
    officeKrAlt: 'Chi nhánh tại Hàn Quốc',
  },
  news: {
    eyebrow: 'Tin tức',
    intro: 'Kinh nghiệm, quy trình và thông tin hữu ích cho học viên và phụ huynh đang tìm hiểu du học Hàn Quốc.',
    empty: 'Chưa có bài viết nào.',
    readMore: 'Đọc tiếp',
    back: 'Tất cả bài viết',
    publishedOn: 'Đăng ngày',
    related: 'Bài viết liên quan',
    all: 'Tất cả',
    notFound: 'Không tìm thấy bài viết này.',
    ctaTitle: 'Cần tư vấn riêng cho hồ sơ của bạn?',
    ctaButton: 'Đăng ký tư vấn',
  },
}

export type UiContent = typeof uiDefaults

export type PageKey = 'home' | 'about' | 'team' | 'programs' | 'roadmap' | 'facilities' | 'universities' | 'news' | 'contact'
export interface SeoEntry {
  title: string
  description: string
}

export interface SiteContent {
  sections: {
    about: string
    programs: string
    roadmap: string
    facilities: string
    universities: string
    contact: string
    news: string
  }
  ui: UiContent
  seo: Record<PageKey, SeoEntry>
  brand: {
    nameVi: string
    nameEn: string
    slogan: string
    taxCode: string
    legalRep: string
    legalRepTitle: string
  }
  contact: {
    address: string
    koreaBranch: string
    hotline: string
    email: string
  }
  hero: {
    eyebrow: string
    subline: string
    ctaPrimary: string
    ctaSecondary: string
  }
  ceoLetter: {
    ceoName: string
    ceoTitle: string
    greeting: string
    paragraphs: string[]
  }
  vision: {
    visionTitle: string
    vision: string
    missionTitle: string
    mission: string
    valuesTitle: string
    values: string[]
  }
  team: {
    headline: string
    tagline: string
    ceoTitle: string
    ceoName: string
    deputy1: OrgBlock
    deputy2: OrgBlock
    koreaTitle: string
    koreaIntro: string
    koreaStaff: KoreaStaff[]
  }
  programs: {
    intro: string
    items: ProgramItem[]
  }
  roadmap: {
    steps: RoadmapStep[]
  }
  facilities: {
    dormTitle: string
    dormText: string
    studyTitle: string
    studyText: string
    socialTitle: string
    socialText: string
    hashtag: string
  }
}

export const initialContent: SiteContent = {
  sections: {
    about: 'Về Chúng Tôi',
    programs: 'Lĩnh Vực Hoạt Động & Các Chương Trình Đào Tạo',
    roadmap: 'Lộ Trình Du Học Hàn Quốc 6 Bước Chuẩn Hóa',
    facilities: 'Cơ Sở Vật Chất & Hình Ảnh Học Viên Thực Tế',
    universities: 'Hệ Thống Trường Đối Tác Hàn Quốc',
    contact: 'Đăng ký tư vấn',
    news: 'Tin Tức & Chia Sẻ Du Học Hàn Quốc',
  },

  ui: uiDefaults,

  seo: {
    home: {
      title: 'An Tín Korea – Tư vấn du học Hàn Quốc uy tín, minh bạch',
      description:
        'AN TÍN KOREA chuyên tư vấn du học Hàn Quốc với quy trình chuyên nghiệp, minh bạch và tận tâm. Visa D-4-1, D-2, lớp tiếng Hàn, 18 trường đối tác.',
    },
    about: {
      title: 'Giới thiệu An Tín Korea – Tầm nhìn, sứ mệnh, giá trị cốt lõi',
      description: 'Thư ngỏ Tổng Giám đốc, tầm nhìn, sứ mệnh và 5 giá trị cốt lõi: Tận tâm, Uy tín, Trách nhiệm, Đồng hành, Phát triển.',
    },
    team: {
      title: 'Đội ngũ An Tín Korea – Lãnh đạo và chuyên viên tại Hàn Quốc',
      description: 'Sơ đồ tổ chức, bộ máy lãnh đạo và đội ngũ chuyên viên đối ngoại tại Hàn Quốc đồng hành cùng học viên.',
    },
    programs: {
      title: 'Chương trình du học Hàn Quốc – Visa D-4-1, D-2 và lớp tiếng Hàn',
      description: 'Du học tiếng Hàn (D-4-1), chuyên ngành đại học / cao đẳng (D-2), sau đại học và lớp tiếng Hàn Online / Offline.',
    },
    roadmap: {
      title: 'Lộ trình du học Hàn Quốc 6 bước chuẩn hóa',
      description: 'Từ định hướng tương lai đến hoàn tất visa và lên đường: 6 bước rõ ràng, minh bạch cùng An Tín Korea.',
    },
    facilities: {
      title: 'Cơ sở vật chất và hình ảnh học viên thực tế – An Tín Korea',
      description: 'Ký túc xá nam nữ riêng biệt, lớp học hiện đại và hình ảnh thực tế của học viên An Tín Korea.',
    },
    universities: {
      title: 'Trường đối tác tại Hàn Quốc – Danh sách 18 trường',
      description: 'Hệ thống trường đối tác của An Tín Korea tại Seoul, Gyeonggi - Incheon và các khu vực khác; lọc theo hệ tiếng D-4-1 và chuyên ngành D-2.',
    },
    news: {
      title: 'Tin tức du học Hàn Quốc – An Tín Korea',
      description: 'Kinh nghiệm, quy trình và thông tin hữu ích cho học viên và phụ huynh đang tìm hiểu du học Hàn Quốc.',
    },
    contact: {
      title: 'Liên hệ & đăng ký tư vấn du học Hàn Quốc – An Tín Korea',
      description: 'Hotline 0988 574 395, email duhocatk@gmail.com. Để lại thông tin để nhận tư vấn lộ trình miễn phí.',
    },
  },

  brand: {
    nameVi: 'CÔNG TY TNHH HỢP TÁC QUỐC TẾ AN TÍN KOREA',
    nameEn: 'AN TIN KOREA INTERNATIONAL COOPERATION COMPANY LIMITED',
    slogan: 'Kết nối uy tín - Vươn tầm quốc tế',
    taxCode: '0111443127',
    legalRep: 'Ông Trương Văn Thêm',
    legalRepTitle: 'Tổng Giám đốc',
  },

  contact: {
    address: 'Liền kề 1, Số 07, Khu đô thị Lideco, Xã Hoài Đức, Thành phố Hà Nội, Việt Nam',
    koreaBranch: 'Có văn phòng đại diện trực tiếp tại Hàn Quốc hỗ trợ học viên.',
    hotline: '0988 574 395',
    email: 'duhocatk@gmail.com',
  },

  hero: {
    eyebrow: 'Tư vấn du học Hàn Quốc',
    subline: 'AN TÍN KOREA chuyên tư vấn du học Hàn Quốc với quy trình chuyên nghiệp, minh bạch và tận tâm.',
    ctaPrimary: 'Đăng ký tư vấn',
    ctaSecondary: 'Xem lộ trình 6 bước',
  },

  ceoLetter: {
    ceoName: 'Trương Văn Thêm',
    ceoTitle: 'Tổng Giám đốc',
    greeting: 'Kính gửi Quý Khách hàng, Quý Phụ huynh, Học viên và Quý Đối tác!',
    paragraphs: [
      'CÔNG TY TNHH HỢP TÁC QUỐC TẾ AN TÍN KOREA hoạt động trong lĩnh vực tư vấn du học Hàn Quốc, với mong muốn trở thành người bạn đồng hành đáng tin cậy, hỗ trợ học viên từng bước hiện thực hóa ước mơ học tập, trải nghiệm và phát triển trong môi trường quốc tế.',
      'Chúng tôi hiểu rằng du học không đơn thuần là hành trình đến với một đất nước mới, mà còn là một quyết định quan trọng, mở ra cơ hội tiếp cận tri thức, khám phá bản thân và xây dựng nền tảng cho tương lai. Vì vậy, AN TÍN KOREA luôn chú trọng lắng nghe, tư vấn phù hợp và đặt lợi ích của học viên làm trọng tâm.',
      'Với mong muốn mang đến sự chuẩn bị tốt nhất cho mỗi hành trình, chúng tôi không ngừng nâng cao chất lượng dịch vụ, đồng hành cùng học viên từ quá trình định hướng học tập, lựa chọn chương trình, chuẩn bị hồ sơ đến việc sẵn sàng cho cuộc sống tại Hàn Quốc. Sự tận tâm, trách nhiệm và uy tín luôn được AN TÍN KOREA đặt lên hàng đầu trong từng hoạt động tư vấn và hỗ trợ.',
      'Sự tin tưởng của Quý Phụ huynh, Học viên và Quý Đối tác là nguồn động lực quý báu để AN TÍN KOREA ngày càng hoàn thiện và khẳng định uy tín. Chúng tôi trân trọng cảm ơn sự đồng hành của Quý vị và mong muốn tiếp tục cùng Quý vị trên chặng đường phía trước.',
    ],
  },

  vision: {
    visionTitle: 'Tầm nhìn',
    vision:
      'Trở thành đơn vị tư vấn du học Hàn Quốc uy tín và chuyên nghiệp, đồng hành cùng học viên trên hành trình học tập, phát triển bản thân và kiến tạo tương lai.',
    missionTitle: 'Sứ mệnh',
    mission:
      'Mang đến dịch vụ tư vấn du học tận tâm và minh bạch, đồng hành cùng học viên từ định hướng, chuẩn bị hồ sơ đến hành trình học tập và phát triển tại Hàn Quốc.',
    valuesTitle: 'Giá trị cốt lõi',
    values: ['TẬN TÂM', 'UY TÍN', 'TRÁCH NHIỆM', 'ĐỒNG HÀNH', 'PHÁT TRIỂN'],
  },

  team: {
    headline: 'Nhân Sự Là Tài Sản Quý Giá Nhất',
    tagline: 'Đội ngũ chuyên nghiệp - Tận tâm - Đồng hành.',
    ceoTitle: 'Tổng Giám đốc',
    ceoName: 'Trương Văn Thêm',
    deputy1: {
      title: 'Phó Tổng Giám đốc 1',
      block: 'Khối Vận hành & Tài chính',
      units: [
        'Phòng hồ sơ',
        'Phòng hành chính nhân sự',
        'Phòng kế toán tài chính',
        'Bộ phận pháp chế hợp đồng',
        'Bộ phận quản sinh ký túc xá',
      ],
    },
    deputy2: {
      title: 'Phó Tổng Giám đốc 2',
      block: 'Khối Kinh doanh & Đào tạo',
      units: [
        'Phòng tuyển sinh',
        'Phòng đào tạo',
        'Phòng Marketing',
        'Phòng đối ngoại Hàn Quốc',
        'Phòng chăm sóc khách hàng',
      ],
    },
    koreaTitle: 'Đội ngũ Chuyên viên Đối ngoại tại Hàn Quốc',
    koreaIntro: 'Cầu nối trực tiếp với các trường ĐH Hàn Quốc và hỗ trợ du học sinh',
    koreaStaff: [
      { name: 'Nguyễn Đình Kỷ', role: 'Chuyên viên đối ngoại tại Hàn Quốc' },
      { name: 'Lee Hyun', role: 'Chuyên viên đối ngoại tại Hàn Quốc' },
      { name: 'Lee Eun Ji', role: 'Chuyên viên đối ngoại tại Hàn Quốc' },
    ],
  },

  programs: {
    intro:
      'AN TÍN KOREA chuyên tư vấn du học Hàn Quốc với quy trình chuyên nghiệp, minh bạch và tận tâm. Chúng tôi cung cấp lộ trình phù hợp, hỗ trợ hồ sơ bài bản và đồng hành cùng học viên trong suốt hành trình du học, giúp mỗi học viên an tâm chuẩn bị và tự tin chinh phục mục tiêu học tập tại Hàn Quốc.',
    items: [
      {
        id: 'd4-1',
        title: 'Du học Tiếng Hàn',
        badge: 'Visa D-4-1',
        description:
          'Dành cho học sinh tốt nghiệp THPT/Cao đẳng/Đại học, lộ trình nâng cấp TOPIK tại Hàn Quốc và chuyển tiếp lên chuyên ngành.',
      },
      {
        id: 'd2-1',
        title: 'Du học Chuyên ngành Đại học / Cao đẳng',
        badge: 'Visa D-2-1 / D-2-2',
        description:
          'Tuyển thẳng chuyên ngành đa lĩnh vực (Kinh tế, Truyền thông, Kỹ thuật, Làm đẹp, Công nghệ...) với học bổng từ 30% - 100%.',
      },
      {
        id: 'd2-3',
        title: 'Du học Sau Đại học / Thạc sĩ',
        badge: 'Visa D-2-3',
        description:
          'Lộ trình tối ưu thời gian học tập, cơ hội chuyển đổi visa làm việc lâu dài tại Hàn Quốc.',
      },
      {
        id: 'korean-class',
        title: 'Đào tạo Tiếng Hàn',
        badge: 'Online & Offline',
        description:
          'Lớp Online tương tác trực tiếp & lớp Offline tại trung tâm. Đào tạo bài bản từ sơ cấp đến luyện phỏng vấn trường và phỏng vấn Đại sứ quán/Lãnh sự quán, phù hợp cho cả học viên ở xa học trực tuyến.',
      },
    ],
  },

  roadmap: {
    steps: [
      {
        no: '01',
        title: 'Định hướng tương lai',
        description: 'Xác định mục tiêu du học và lựa chọn chương trình học phù hợp với định hướng tương lai.',
      },
      {
        no: '02',
        title: 'Xây dựng kiến thức',
        description: 'Nâng cao trình độ tiếng Hàn và rèn luyện các kỹ năng nghe, nói cần thiết trước khi du học.',
      },
      {
        no: '03',
        title: 'Chuẩn bị hồ sơ du học',
        description: 'Tìm hiểu điều kiện du học và chuẩn bị hồ sơ đầy đủ theo yêu cầu của chương trình.',
      },
      {
        no: '04',
        title: 'Tìm hiểu & Chọn trường học',
        description: 'Lựa chọn trường phù hợp, hoàn thiện hồ sơ đăng ký và chuẩn bị phỏng vấn với nhà trường.',
      },
      {
        no: '05',
        title: 'Hoàn tất thủ tục Visa',
        description: 'Hoàn thiện thủ tục xin visa du học và chuẩn bị kỹ lưỡng cho buổi phỏng vấn ĐSQ/LSQ.',
      },
      {
        no: '06',
        title: 'Khởi đầu hành trình mới',
        description: 'Chuẩn bị đầy đủ hành trang cần thiết và sẵn sàng lên đường bắt đầu hành trình du học.',
      },
    ],
  },

  facilities: {
    dormTitle: 'Ký túc xá tiện nghi',
    dormText:
      'Ký túc xá được bố trí khu vực nam, nữ riêng biệt, đảm bảo không gian sinh hoạt riêng tư, sạch sẽ và an toàn cho học viên. Phòng ở được trang bị đầy đủ giường tầng, bàn học, tủ đồ và các tiện ích cần thiết, tạo môi trường sinh hoạt thuận tiện trong quá trình học tập.',
    studyTitle: 'Không gian học tập',
    studyText:
      'Không gian học tập thoáng mát & hiện đại, trang bị đầy đủ điều hòa, bảng từ, thiết bị nghe nhìn phục vụ đào tạo tiếng Hàn và luyện phỏng vấn.',
    socialTitle: 'Hình ảnh thực tế học viên',
    socialText:
      'Bộ sưu tập ảnh học viên An Tín Korea cầm hashtag "Chọn An Tín - Chọn Tương lai" và nhận visa tại sân bay trước giờ xuất cảnh.',
    hashtag: 'Chọn An Tín - Chọn Tương lai',
  },
}
