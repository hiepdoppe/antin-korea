import { ASSETS } from '@/constants/assets'
import type { GalleryItem } from '@/store/galleryStore'

const A = ASSETS

/** Ảnh thật từ thư mục duhocantin, nhóm theo hiển thị ở mục Cơ sở vật chất & Học viên. */
export const initialGallery: GalleryItem[] = [
  // Không gian học tập
  { id: 'g-study-1', src: A.facilities.classroomTeaching, group: 'study', caption: 'Lớp học tiếng Hàn', captionKo: '한국어 수업', featured: true, visible: true },
  { id: 'g-study-2', src: A.facilities.classroomSeated, group: 'study', caption: 'Học viên trong giờ học', captionKo: '수업 중인 학생들', featured: true, visible: true },
  { id: 'g-study-3', src: A.facilities.classroomTables, group: 'study', caption: 'Phòng học bàn ghế', captionKo: '책상과 의자가 있는 강의실', featured: false, visible: true },
  { id: 'g-study-4', src: A.facilities.classroomWhiteboard, group: 'study', caption: 'Phòng học trang bị bảng từ', captionKo: '마그네틱 칠판을 갖춘 강의실', featured: false, visible: true },
  { id: 'g-study-5', src: A.facilities.classroomDoor1, group: 'study', caption: 'Phòng học 1', captionKo: '강의실 1', featured: false, visible: true },
  { id: 'g-study-6', src: A.facilities.classroomDoor2, group: 'study', caption: 'Phòng học 2', captionKo: '강의실 2', featured: false, visible: true },

  // Ký túc xá
  { id: 'g-dorm-1', src: A.facilities.dormRoom1, group: 'dorm', caption: 'Phòng ở giường tầng', captionKo: '2층 침대 객실', featured: true, visible: true },
  { id: 'g-dorm-2', src: A.facilities.dormRoom2, group: 'dorm', caption: 'Phòng ở thoáng, sáng', captionKo: '밝고 쾌적한 객실', featured: true, visible: true },
  { id: 'g-dorm-3', src: A.facilities.dormRoomDesk, group: 'dorm', caption: 'Phòng ở có bàn học', captionKo: '책상이 있는 객실', featured: true, visible: true },
  { id: 'g-dorm-4', src: A.facilities.dormWardrobe, group: 'dorm', caption: 'Tủ đồ cá nhân', captionKo: '개인 옷장', featured: true, visible: true },
  { id: 'g-dorm-5', src: A.facilities.dormMaleDoor, group: 'dorm', caption: 'Khu ký túc xá nam', captionKo: '남자 기숙사 구역', featured: false, visible: true },
  { id: 'g-dorm-6', src: A.facilities.dormFemaleDoor, group: 'dorm', caption: 'Khu ký túc xá nữ', captionKo: '여자 기숙사 구역', featured: false, visible: true },
  { id: 'g-dorm-7', src: A.facilities.dormRoom3, group: 'dorm', caption: 'Phòng ở giường tầng', captionKo: '2층 침대 객실', featured: false, visible: true },
  { id: 'g-dorm-8', src: A.facilities.dormRoom4, group: 'dorm', caption: 'Phòng ở giường tầng', captionKo: '2층 침대 객실', featured: false, visible: true },
  { id: 'g-dorm-9', src: A.facilities.dormRoom5, group: 'dorm', caption: 'Phòng ở giường tầng', captionKo: '2층 침대 객실', featured: false, visible: true },
  { id: 'g-dorm-10', src: A.facilities.bathroom1, group: 'dorm', caption: 'Khu vệ sinh', captionKo: '화장실·샤워실', featured: false, visible: true },
  { id: 'g-dorm-11', src: A.facilities.bathroom2, group: 'dorm', caption: 'Khu vệ sinh', captionKo: '화장실·샤워실', featured: false, visible: true },
  { id: 'g-dorm-12', src: A.facilities.rooftop1, group: 'dorm', caption: 'Sân thượng', captionKo: '옥상', featured: false, visible: true },
  { id: 'g-dorm-13', src: A.facilities.rooftop2, group: 'dorm', caption: 'Sân thượng', captionKo: '옥상', featured: false, visible: true },
  { id: 'g-dorm-14', src: A.facilities.rooftop3, group: 'dorm', caption: 'Sân thượng', captionKo: '옥상', featured: false, visible: true },
  { id: 'g-dorm-15', src: A.facilities.rooftop4, group: 'dorm', caption: 'Sân thượng', captionKo: '옥상', featured: false, visible: true },

  // Hình ảnh học viên thực tế
  { id: 'g-social-1', src: A.students.visaAirport1, group: 'social', caption: 'Học viên cầm hashtag Chọn An Tín - Chọn Tương lai', captionKo: '"안틴을 선택하면 미래를 선택합니다" 해시태그를 든 학생들', featured: true, visible: true },
  { id: 'g-social-2', src: A.students.visaAirport2, group: 'social', caption: 'Học viên nhận visa, sẵn sàng xuất cảnh', captionKo: '비자를 받고 출국을 준비하는 학생들', featured: true, visible: true },
  { id: 'g-social-3', src: A.students.visaAirport3, group: 'social', caption: 'Học viên tại sân bay trước giờ xuất cảnh', captionKo: '출국 전 공항의 학생들', featured: true, visible: true },
  { id: 'g-social-4', src: A.students.departureGroup, group: 'social', caption: 'Học viên An Tín Korea tại sân bay', captionKo: '공항의 안틴 코리아 학생들', featured: false, visible: true },
  { id: 'g-social-5', src: A.students.kijeonWelcome, group: 'social', caption: 'Đón học viên tại sân bay – Jeonju Kijeon College', captionKo: '공항 학생 환영 – 전주기전대학', featured: false, visible: true },
  { id: 'g-social-6', src: A.students.seojeongWelcome, group: 'social', caption: 'Học viên tại Seojeong University', captionKo: '서정대학교의 학생들', featured: false, visible: true },
  { id: 'g-social-7', src: A.students.jangsinCeremony, group: 'social', caption: 'Lễ tổng kết khóa tiếng Hàn – Seoul Jangsin University', captionKo: '한국어 과정 수료식 – 서울장신대학교', featured: false, visible: true },
  { id: 'g-social-8', src: A.students.airportHall, group: 'social', caption: 'Học viên tại sảnh sân bay', captionKo: '공항 로비의 학생들', featured: false, visible: true },
  { id: 'g-social-9', src: A.students.giftHandover, group: 'social', caption: 'Trao quà cho học viên tại văn phòng', captionKo: '사무실에서 학생에게 선물 전달', featured: false, visible: true },
]
