import type { Article } from '@/store/newsStore'

const empty = { title: '', excerpt: '', body: '', metaTitle: '', metaDescription: '' }

/**
 * 3 bài MẪU (tổng hợp từ chính nội dung website, không có số liệu/điều kiện cụ thể về visa hay học phí).
 * Hãy đọc lại, chỉnh sửa hoặc xóa trước khi công bố. Đã có bản dịch tiếng Hàn nháp (cần người bản ngữ rà soát); chỉnh ở /admin/news.
 */
export const newsSeed: Article[] = [
  {
    id: 'news_sample_1',
    slug: 'lo-trinh-du-hoc-han-quoc-6-buoc',
    status: 'published',
    publishedAt: '2026-11-02T08:00:00+07:00',
    updatedAt: '2026-11-02T08:00:00+07:00',
    cover: '/assets/students/visa-airport-1.jpg',
    coverAlt: 'Học viên An Tín Korea tại sân bay trước giờ xuất cảnh',
    category: 'Lộ trình',
    tags: ['du học Hàn Quốc', 'lộ trình', 'An Tín Korea'],
    isSample: true,
    vi: {
      title: 'Lộ trình du học Hàn Quốc 6 bước cùng An Tín Korea',
      excerpt: 'Từ định hướng tương lai đến khi lên đường, An Tín Korea chuẩn hóa hành trình du học thành 6 bước rõ ràng, minh bạch.',
      metaTitle: 'Lộ trình du học Hàn Quốc 6 bước chuẩn hóa | An Tín Korea',
      metaDescription: 'Định hướng, xây dựng kiến thức, chuẩn bị hồ sơ, chọn trường, hoàn tất visa và lên đường – 6 bước du học Hàn Quốc cùng An Tín Korea.',
      body: `Du học Hàn Quốc là một quyết định lớn của cả học viên và gia đình. Để hành trình đó rõ ràng và không bị bỡ ngỡ, An Tín Korea chuẩn hóa quy trình thành 6 bước.

## Bước 1 – Định hướng tương lai

Xác định mục tiêu du học và lựa chọn chương trình học phù hợp với định hướng tương lai của học viên.

## Bước 2 – Xây dựng kiến thức

Nâng cao trình độ tiếng Hàn và rèn luyện các kỹ năng nghe, nói cần thiết trước khi du học.

## Bước 3 – Chuẩn bị hồ sơ du học

Tìm hiểu điều kiện du học và chuẩn bị hồ sơ đầy đủ theo yêu cầu của chương trình.

## Bước 4 – Tìm hiểu và chọn trường học

Lựa chọn trường phù hợp, hoàn thiện hồ sơ đăng ký và chuẩn bị phỏng vấn với nhà trường.

## Bước 5 – Hoàn tất thủ tục visa

Hoàn thiện thủ tục xin visa du học và chuẩn bị kỹ lưỡng cho buổi phỏng vấn tại Đại sứ quán / Lãnh sự quán.

## Bước 6 – Khởi đầu hành trình mới

Chuẩn bị đầy đủ hành trang cần thiết và sẵn sàng lên đường bắt đầu hành trình du học.

Mỗi học viên có hoàn cảnh khác nhau, vì vậy lộ trình cụ thể sẽ được đội ngũ tư vấn điều chỉnh theo hồ sơ của bạn. Hãy để lại thông tin để được tư vấn.`,
    },
    ko: {
      title: '안틴 코리아와 함께하는 한국 유학 6단계 로드맵',
      excerpt: '미래 설정부터 출국까지, 안틴 코리아는 유학 여정을 명확하고 투명한 6단계로 표준화했습니다.',
      metaTitle: '표준화된 한국 유학 6단계 로드맵 | 안틴 코리아',
      metaDescription: '방향 설정, 실력 쌓기, 서류 준비, 학교 선택, 비자 완료, 출국까지 – 안틴 코리아와 함께하는 한국 유학 6단계.',
      body: `한국 유학은 학생과 가족 모두에게 큰 결정입니다. 그 여정이 명확하고 낯설지 않도록 안틴 코리아는 절차를 6단계로 표준화했습니다.

## 1단계 – 미래 설정

유학 목표를 정하고 학생의 미래 계획에 맞는 학업 프로그램을 선택합니다.

## 2단계 – 실력 쌓기

유학 전에 한국어 실력을 높이고 필요한 듣기·말하기 능력을 키웁니다.

## 3단계 – 유학 서류 준비

유학 조건을 알아보고 프로그램 요건에 맞춰 서류를 빠짐없이 준비합니다.

## 4단계 – 학교 알아보기 및 선택

알맞은 학교를 고르고 지원서를 완성하며 학교 면접을 준비합니다.

## 5단계 – 비자 절차 완료

유학 비자 신청 절차를 마무리하고 대사관·영사관 면접을 꼼꼼히 준비합니다.

## 6단계 – 새로운 여정의 시작

필요한 준비물을 모두 갖추고 유학 여정을 시작할 준비를 마칩니다.

학생마다 상황이 다르므로, 구체적인 로드맵은 상담팀이 학생의 서류에 맞춰 조정해 드립니다. 정보를 남겨 주시면 상담해 드리겠습니다.`,
    },
  },
  {
    id: 'news_sample_2',
    slug: 'du-hoc-tieng-han-d-4-1-hay-chuyen-nganh-d-2',
    status: 'published',
    publishedAt: '2026-11-04T08:00:00+07:00',
    updatedAt: '2026-11-04T08:00:00+07:00',
    cover: '/assets/universities/hansei-meeting.jpg',
    coverAlt: 'Buổi làm việc giữa An Tín Korea và trường đối tác tại Hàn Quốc',
    category: 'Chương trình',
    tags: ['visa D-4-1', 'visa D-2', 'chương trình du học'],
    isSample: true,
    vi: {
      title: 'Du học tiếng Hàn (D-4-1) hay du học chuyên ngành (D-2): nên chọn hướng nào?',
      excerpt: 'Tổng quan các chương trình An Tín Korea đang tư vấn: du học tiếng Hàn, chuyên ngành đại học / cao đẳng, sau đại học và lớp tiếng Hàn Online / Offline.',
      metaTitle: 'Du học tiếng Hàn D-4-1 hay chuyên ngành D-2? | An Tín Korea',
      metaDescription: 'So sánh nhanh các chương trình du học Hàn Quốc: tiếng Hàn (D-4-1), đại học / cao đẳng (D-2-1, D-2-2), sau đại học (D-2-3) và lớp tiếng Hàn.',
      body: `Khi bắt đầu tìm hiểu du học Hàn Quốc, câu hỏi đầu tiên của nhiều học viên là nên bắt đầu từ đâu. An Tín Korea hiện tư vấn bốn nhóm chương trình chính.

## Du học tiếng Hàn – Visa D-4-1

Dành cho học sinh tốt nghiệp THPT, cao đẳng hoặc đại học. Học viên học tiếng Hàn tại trường, nâng cấp trình độ TOPIK và có thể chuyển tiếp lên chuyên ngành.

## Du học chuyên ngành đại học / cao đẳng – Visa D-2-1 / D-2-2

Dành cho học viên đã sẵn sàng theo học chuyên ngành chính quy tại các trường đối tác.

## Du học sau đại học / thạc sĩ – Visa D-2-3

Dành cho học viên đã tốt nghiệp đại học và muốn tiếp tục học lên cao.

## Đào tạo tiếng Hàn – Online và Offline

Lớp tiếng Hàn giúp học viên chuẩn bị nền tảng ngôn ngữ trước khi nộp hồ sơ hoặc trong thời gian chờ xuất cảnh.

## Nên chọn hướng nào?

Câu trả lời phụ thuộc vào trình độ tiếng Hàn, học lực, tài chính và mục tiêu nghề nghiệp của từng người. Điều kiện cụ thể có thể khác nhau theo từng trường và từng thời điểm, vì vậy bạn nên liên hệ An Tín Korea để được tư vấn trực tiếp theo hồ sơ của mình.`,
    },
    ko: {
      title: '어학연수(D-4-1) vs 학위 과정(D-2): 어떤 길을 선택해야 할까요?',
      excerpt: '안틴 코리아가 상담하는 프로그램 개요: 어학연수, 대학·전문대 학위 과정, 대학원, 온라인/오프라인 한국어 수업.',
      metaTitle: '한국어 어학연수 D-4-1 vs 학위 과정 D-2 | 안틴 코리아',
      metaDescription: '한국 유학 프로그램 한눈에 비교: 어학연수(D-4-1), 대학·전문대(D-2-1, D-2-2), 대학원(D-2-3), 한국어 수업.',
      body: `한국 유학을 알아보기 시작할 때 많은 학생이 처음 묻는 것은 어디서부터 시작해야 하느냐입니다. 안틴 코리아는 현재 네 가지 주요 프로그램을 상담하고 있습니다.

## 한국어 어학연수 – D-4-1 비자

고등학교, 전문대 또는 대학교 졸업생을 대상으로 합니다. 학생은 학교에서 한국어를 배우며 TOPIK 급수를 올리고, 이후 전공 과정으로 진학할 수 있습니다.

## 대학·전문대 학위 과정 – D-2-1 / D-2-2 비자

협력 대학에서 정규 전공 과정을 바로 공부할 준비가 된 학생을 위한 과정입니다.

## 대학원 / 석사 유학 – D-2-3 비자

대학을 졸업하고 더 높은 학위를 원하는 학생을 위한 과정입니다.

## 한국어 교육 – 온라인과 오프라인

서류를 제출하기 전이나 출국을 기다리는 동안 언어 기초를 준비할 수 있는 한국어 수업입니다.

## 어떤 길을 선택할까요?

답은 한국어 실력, 학업 성적, 재정 상황, 직업 목표에 따라 사람마다 다릅니다. 구체적인 조건은 학교와 시기에 따라 달라질 수 있으므로, 안틴 코리아에 연락하셔서 본인 서류에 맞는 상담을 받아 보시기 바랍니다.`,
    },
  },
  {
    id: 'news_sample_3',
    slug: 'ky-tuc-xa-va-lop-hoc-tai-an-tin-korea',
    status: 'published',
    publishedAt: '2026-11-06T08:00:00+07:00',
    updatedAt: '2026-11-06T08:00:00+07:00',
    cover: '/assets/facilities/classroom-seated.jpg',
    coverAlt: 'Lớp học tiếng Hàn tại An Tín Korea',
    category: 'Học viên',
    tags: ['ký túc xá', 'lớp học', 'đời sống học viên'],
    isSample: true,
    vi: {
      title: 'Ký túc xá và lớp học tại An Tín Korea: học viên được chuẩn bị những gì?',
      excerpt: 'Ký túc xá nam nữ riêng biệt, lớp học thoáng mát hiện đại phục vụ đào tạo tiếng Hàn và luyện phỏng vấn.',
      metaTitle: 'Ký túc xá và lớp học tại An Tín Korea',
      metaDescription: 'Ký túc xá khu nam nữ riêng biệt, phòng học có điều hòa, bảng từ, thiết bị nghe nhìn – môi trường học tiếng Hàn và luyện phỏng vấn tại An Tín Korea.',
      body: `Trước khi sang Hàn Quốc, học viên cần một môi trường học tập và sinh hoạt thuận tiện. Dưới đây là những gì An Tín Korea chuẩn bị.

## Ký túc xá tiện nghi

Ký túc xá được bố trí khu vực nam, nữ riêng biệt, đảm bảo không gian sinh hoạt riêng tư, sạch sẽ và an toàn. Phòng ở được trang bị giường tầng, bàn học, tủ đồ và các tiện ích cần thiết.

## Không gian học tập

Lớp học thoáng mát và hiện đại, trang bị điều hòa, bảng từ và thiết bị nghe nhìn phục vụ đào tạo tiếng Hàn và luyện phỏng vấn.

## Hình ảnh thực tế

Bạn có thể xem thêm ảnh ký túc xá, lớp học và học viên nhận visa tại sân bay ở trang Cơ sở vật chất.

Nếu muốn tham quan hoặc được tư vấn trực tiếp, hãy liên hệ hotline 0988 574 395.`,
    },
    ko: {
      title: '안틴 코리아의 기숙사와 강의실: 학생들은 어떤 준비를 하게 될까요?',
      excerpt: '남녀 분리 기숙사와 쾌적하고 현대적인 강의실에서 한국어 교육과 면접 연습을 진행합니다.',
      metaTitle: '안틴 코리아의 기숙사와 강의실',
      metaDescription: '남녀 구역이 분리된 기숙사, 에어컨·마그네틱 칠판·시청각 장비를 갖춘 강의실 – 안틴 코리아의 한국어 학습 및 면접 연습 환경.',
      body: `한국에 가기 전, 학생에게는 편리한 학습과 생활 환경이 필요합니다. 안틴 코리아가 준비한 환경을 소개합니다.

## 편리한 기숙사

기숙사는 남녀 구역이 분리되어 있어 사생활이 보장되고 깨끗하며 안전합니다. 객실에는 2층 침대, 책상, 옷장 등 필요한 시설이 갖춰져 있습니다.

## 학습 공간

시원하고 현대적인 강의실에 에어컨, 마그네틱 칠판, 시청각 장비를 갖추어 한국어 교육과 면접 연습에 활용합니다.

## 실제 모습

시설 페이지에서 기숙사, 강의실, 공항에서 비자를 받는 학생들의 사진을 더 보실 수 있습니다.

견학이나 직접 상담을 원하시면 핫라인 0988 574 395로 연락해 주세요.`,
    },
  },
]
