/**
 * Ánh xạ toàn bộ ảnh thật của An Tín Korea (đã được chọn lọc và sao chép từ thư mục
 * C:\Users\super\Downloads\duhocantin vào public/assets/).
 * UI chỉ dùng đường dẫn từ file này – không hard-code đường dẫn ảnh trong component.
 */
const a = (path: string) => `/assets/${path}`

export const ASSETS = {
  logo: {
    mark: a('logo/logo-mark.png'), // logo nền trong suốt
    square: a('logo/logo-square.jpg'),
    lockup: a('logo/logo-lockup.jpg'), // logo + tên công ty
  },
  leadership: {
    ceo: a('leadership/ceo-portrait.jpg'),
    ceoSignature: a('leadership/ceo-signature.jpg'),
    deputy1: a('leadership/deputy-1.jpg'),
    deputy2: a('leadership/deputy-2.jpg'),
    lobby: a('leadership/leadership-lobby.jpg'),
  },
  staff: {
    teamGroup: a('staff/team-group.jpg'),
    teamFrontOffice: a('staff/team-front-office.jpg'),
    teamTrio: a('staff/team-trio.jpg'),
    teamMeeting: a('staff/team-meeting.jpg'),
    teamReception: a('staff/team-reception.jpg'),
    koreaKy: a('staff/korea-nguyen-dinh-ky.jpg'),
    koreaHyun: a('staff/korea-lee-hyun.jpg'),
    koreaEunJi: a('staff/korea-lee-eun-ji.jpg'),
    koreaBanner: a('staff/korea-trio-banner.png'),
  },
  offices: {
    vietnam: a('offices/hq-vietnam.jpg'),
    korea: a('offices/hq-korea.jpg'),
  },
  facilities: {
    classroomTeaching: a('facilities/classroom-teaching.jpg'),
    classroomSeated: a('facilities/classroom-seated.jpg'),
    classroomWhiteboard: a('facilities/classroom-whiteboard.jpg'),
    classroomTables: a('facilities/classroom-tables.jpg'),
    classroomDoor1: a('facilities/classroom-door-1.jpg'),
    classroomDoor2: a('facilities/classroom-door-2.jpg'),
    dormMaleDoor: a('facilities/dorm-male-door.jpg'),
    dormFemaleDoor: a('facilities/dorm-female-door.jpg'),
    dormRoom1: a('facilities/dorm-room-1.jpg'),
    dormRoom2: a('facilities/dorm-room-2.jpg'),
    dormRoom3: a('facilities/dorm-room-3.jpg'),
    dormRoom4: a('facilities/dorm-room-4.jpg'),
    dormRoom5: a('facilities/dorm-room-5.jpg'),
    dormRoomDesk: a('facilities/dorm-room-desk.jpg'),
    dormWardrobe: a('facilities/dorm-wardrobe.jpg'),
    bathroom1: a('facilities/bathroom-1.jpg'),
    bathroom2: a('facilities/bathroom-2.jpg'),
    rooftop1: a('facilities/rooftop-1.jpg'),
    rooftop2: a('facilities/rooftop-2.jpg'),
    rooftop3: a('facilities/rooftop-3.jpg'),
    rooftop4: a('facilities/rooftop-4.jpg'),
  },
  students: {
    visaAirport1: a('students/visa-airport-1.jpg'),
    visaAirport2: a('students/visa-airport-2.jpg'),
    visaAirport3: a('students/visa-airport-3.jpg'),
    departureGroup: a('students/departure-group.jpg'),
    airportHall: a('students/airport-hall.jpg'),
    seojeongWelcome: a('students/seojeong-welcome.jpg'),
    jangsinCeremony: a('students/jangsin-ceremony.jpg'),
    kijeonWelcome: a('students/kijeon-welcome.jpg'),
    giftHandover: a('students/gift-handover.jpg'),
  },
  universities: {
    meetings: {
      hansei: a('universities/hansei-meeting.jpg'),
      daelim: a('universities/daelim-meeting.jpg'),
      yuhan: a('universities/yuhan-meeting.jpg'),
    },
    partnersGrid: a('universities/partners-grid.png'),
    logos: {
      'korea-university': a('universities/logos/korea-university.png'),
      yonsei: a('universities/logos/yonsei.png'),
      hanyang: a('universities/logos/hanyang.png'),
      sungkyunkwan: a('universities/logos/sungkyunkwan.png'),
      'kyung-hee': a('universities/logos/kyung-hee.png'),
      dongguk: a('universities/logos/dongguk.png'),
      ewha: a('universities/logos/ewha.png'),
      'university-of-seoul': a('universities/logos/university-of-seoul.png'),
      sejong: a('universities/logos/sejong.png'),
      ajou: a('universities/logos/ajou.png'),
      kaist: a('universities/logos/kaist.png'),
      postech: a('universities/logos/postech.png'),
    } as Record<string, string>,
  },
  marketing: {
    bannerFanpage: a('marketing/banner-fanpage.jpg'),
    poster: a('marketing/poster-tuyen-sinh.jpg'),
  },
} as const

/** Danh sách logo trường để admin chọn. */
export const UNIVERSITY_LOGO_OPTIONS = Object.entries(ASSETS.universities.logos).map(([key, src]) => ({
  key,
  src,
}))

/** Danh sách ảnh buổi làm việc với trường để admin chọn. */
export const UNIVERSITY_PHOTO_OPTIONS = Object.entries(ASSETS.universities.meetings).map(([key, src]) => ({
  key,
  src,
}))
