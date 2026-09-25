import { NavLink, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import { BASE_URL } from './appConfig'
import { AdminPage } from './features/admin/AdminPage'
import { EventDetailPage } from './features/booking/EventDetailPage'
import { EventListPage } from './features/events/EventListPage'

const Header = styled.header`
  background: ${({ theme }) => theme.color.surface};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

const HeaderInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(4)};
  align-items: center;
  justify-content: space-between;
  max-width: 1080px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space(3)} ${theme.space(4)}`};
`

const Brand = styled.p`
  font-weight: 800;
`

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(1)};

  a {
    display: inline-flex;
    align-items: center;
    min-height: 40px;
    padding: 0 ${({ theme }) => theme.space(3)};
    border-radius: ${({ theme }) => theme.radius.md};
    color: ${({ theme }) => theme.color.muted};
    font-size: ${({ theme }) => theme.font.sm};
    font-weight: 700;
    text-decoration: none;
  }

  a:hover,
  a[aria-current='page'] {
    color: ${({ theme }) => theme.color.primary};
    background: ${({ theme }) => theme.color.primaryWeak};
  }
`

const Main = styled.main`
  max-width: 1080px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space(6)} ${theme.space(4)} ${theme.space(7)}`};
`

export function App() {
  return (
    <>
      <Header>
        <HeaderInner>
          <Brand>イベント予約</Brand>
          <Nav aria-label="メイン">
            <NavLink to="/" end>
              イベント一覧
            </NavLink>
            <NavLink to="/admin">申込状況</NavLink>
            <a href={`${BASE_URL}legacy.html`}>旧画面（jQuery）</a>
          </Nav>
        </HeaderInner>
      </Header>
      <Main>
        <Routes>
          <Route path="/" element={<EventListPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Main>
    </>
  )
}
