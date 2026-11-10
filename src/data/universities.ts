import type { University } from '@/store/universitiesStore'

/**
 * 18 trường đối tác theo hồ sơ năng lực (tên + tên tiếng Hàn đúng đặc tả).
 * Khu vực (region), thành phố và hệ đào tạo (d4/d2) là giá trị mặc định để lọc –
 * admin có thể chỉnh lại tại /admin/universities. Học phí để trống đến khi có số liệu chính thức.
 */
export const initialUniversities: University[] = [
  { id: 'korea-university', nameEn: 'Korea University', nameKo: '고려대학교', city: 'Seoul', cityKo: '서울', region: 'seoul', d4: true, d2: true, logoKey: 'korea-university', featured: true },
  { id: 'yonsei', nameEn: 'Yonsei University', nameKo: '연세대학교', city: 'Seoul', cityKo: '서울', region: 'seoul', d4: true, d2: true, logoKey: 'yonsei', featured: true },
  { id: 'hanyang', nameEn: 'Hanyang University', nameKo: '한양대학교', city: 'Seoul', cityKo: '서울', region: 'seoul', d4: true, d2: true, logoKey: 'hanyang', featured: true },
  { id: 'sungkyunkwan', nameEn: 'Sungkyunkwan University', nameKo: '성균관대학교', city: 'Seoul', cityKo: '서울', region: 'seoul', d4: true, d2: true, logoKey: 'sungkyunkwan', featured: true },
  { id: 'kyung-hee', nameEn: 'Kyung Hee University', nameKo: '경희대학교', city: 'Seoul', cityKo: '서울', region: 'seoul', d4: true, d2: true, logoKey: 'kyung-hee', featured: true },
  { id: 'dongguk', nameEn: 'Dongguk University', nameKo: '동국대학교', city: 'Seoul', cityKo: '서울', region: 'seoul', d4: true, d2: true, logoKey: 'dongguk', featured: false },
  { id: 'ewha', nameEn: 'Ewha Womans University', nameKo: '이화여자대학교', city: 'Seoul', cityKo: '서울', region: 'seoul', d4: true, d2: true, logoKey: 'ewha', featured: false },
  { id: 'university-of-seoul', nameEn: 'University of Seoul', nameKo: '서울시립대학교', city: 'Seoul', cityKo: '서울', region: 'seoul', d4: true, d2: true, logoKey: 'university-of-seoul', featured: false },
  { id: 'sejong', nameEn: 'Sejong University', nameKo: '세종대학교', city: 'Seoul', cityKo: '서울', region: 'seoul', d4: true, d2: true, logoKey: 'sejong', featured: false },
  { id: 'ajou', nameEn: 'Ajou University', nameKo: '아주대학교', city: 'Suwon', cityKo: '수원', region: 'gyeonggi-incheon', d4: true, d2: true, logoKey: 'ajou', featured: false },
  { id: 'kaist', nameEn: 'KAIST', city: 'Daejeon', cityKo: '대전', region: 'other', d4: false, d2: true, logoKey: 'kaist', featured: false },
  { id: 'postech', nameEn: 'POSTECH', city: 'Pohang', cityKo: '포항', region: 'other', d4: false, d2: true, logoKey: 'postech', featured: false },
  { id: 'jeonju-kijeon', nameEn: 'Jeonju Kijeon College', nameKo: '전주기전대학', city: 'Jeonju', cityKo: '전주', region: 'other', d4: true, d2: true, featured: false },
  { id: 'seojeong', nameEn: 'Seojeong University', nameKo: '서정대학교', city: 'Yangju', cityKo: '양주', region: 'gyeonggi-incheon', d4: true, d2: true, featured: false },
  { id: 'seoul-jangsin', nameEn: 'Seoul Jangsin University', nameKo: '서울장신대학교', city: 'Gwangju (Gyeonggi)', cityKo: '경기 광주', region: 'gyeonggi-incheon', d4: true, d2: true, featured: false },
  { id: 'yuhan', nameEn: 'Yuhan University', nameKo: '유한대학교', city: 'Bucheon', cityKo: '부천', region: 'gyeonggi-incheon', d4: true, d2: true, photoKey: 'yuhan', featured: false },
  { id: 'daelim', nameEn: 'Daelim University', nameKo: '대림대학교', city: 'Anyang', cityKo: '안양', region: 'gyeonggi-incheon', d4: true, d2: true, photoKey: 'daelim', featured: false },
  { id: 'hansei', nameEn: 'Hansei University', nameKo: '한세대학교', city: 'Gunpo', cityKo: '군포', region: 'gyeonggi-incheon', d4: true, d2: true, photoKey: 'hansei', featured: false },
]
