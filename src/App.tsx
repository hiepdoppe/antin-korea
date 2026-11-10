import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { SiteLayout } from '@/components/site/SiteLayout'
import { Toaster } from '@/components/ui/Toaster'
import AboutPage from '@/pages/site/AboutPage'
import ContactPage from '@/pages/site/ContactPage'
import FacilitiesPage from '@/pages/site/FacilitiesPage'
import HomePage from '@/pages/site/HomePage'
import NewsDetailPage from '@/pages/site/NewsDetailPage'
import NewsListPage from '@/pages/site/NewsListPage'
import NotFoundPage from '@/pages/site/NotFoundPage'
import ProgramsPage from '@/pages/site/ProgramsPage'
import RoadmapPage from '@/pages/site/RoadmapPage'
import TeamPage from '@/pages/site/TeamPage'
import UniversitiesPage from '@/pages/site/UniversitiesPage'
import { ROUTES } from '@/constants/routes'

// Khu quản trị tách riêng (code-splitting) để trang công khai nhẹ hơn.
const AdminGate = lazy(() => import('@/pages/admin/AdminGate'))
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'))
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'))
const Leads = lazy(() => import('@/pages/admin/Leads'))
const PageEditor = lazy(() => import('@/pages/admin/PageEditor'))
const NewsAdmin = lazy(() => import('@/pages/admin/NewsAdmin'))
const NewsEditor = lazy(() => import('@/pages/admin/NewsEditor'))
const Universities = lazy(() => import('@/pages/admin/Universities'))
const Gallery = lazy(() => import('@/pages/admin/Gallery'))
const Translations = lazy(() => import('@/pages/admin/Translations'))
const Publish = lazy(() => import('@/pages/admin/Publish'))

function Loading() {
  return <div className="grid min-h-screen place-items-center text-sm text-navy-500">…</div>
}

/** Các trang công khai. Dùng hai lần: gốc "/" (tiếng Việt) và "/ko" (tiếng Hàn). */
const sitePages = (
  <>
    <Route index element={<HomePage />} />
    <Route path={ROUTES.about.slice(1)} element={<AboutPage />} />
    <Route path={ROUTES.team.slice(1)} element={<TeamPage />} />
    <Route path={ROUTES.programs.slice(1)} element={<ProgramsPage />} />
    <Route path={ROUTES.roadmap.slice(1)} element={<RoadmapPage />} />
    <Route path={ROUTES.facilities.slice(1)} element={<FacilitiesPage />} />
    <Route path={ROUTES.universities.slice(1)} element={<UniversitiesPage />} />
    <Route path={ROUTES.news.slice(1)} element={<NewsListPage />} />
    <Route path={`${ROUTES.news.slice(1)}/:slug`} element={<NewsDetailPage />} />
    <Route path={ROUTES.contact.slice(1)} element={<ContactPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </>
)

export default function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<SiteLayout />}>
            {sitePages}
          </Route>
          <Route path="/ko" element={<SiteLayout />}>
            {sitePages}
          </Route>
          <Route
            path="/admin"
            element={
              <AdminGate>
                <AdminLayout />
              </AdminGate>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="pages/:page" element={<PageEditor />} />
            <Route path="news" element={<NewsAdmin />} />
            <Route path="news/:id" element={<NewsEditor />} />
            <Route path="universities" element={<Universities />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="translate" element={<Translations />} />
            <Route path="publish" element={<Publish />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </>
  )
}
