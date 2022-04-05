import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { Link } from "@mui/material";

const container = document.getElementById('root')
if (container) {
    const root = createRoot(container)

    const CustomLink = (props: { children: string, href: string }) => <Link
        color={'#FFFFFF'}
        fontSize={'.3em'}
        underline='none'
        sx={{
            cursor: 'pointer'
        }}
        href={props.href}>
        {props.children}
    </Link>

    root.render([
        <div style={{
            flex: '1 0 auto'
        }}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<App/>}/>
                </Routes>
            </BrowserRouter>
        </div>,
        <footer style={{
            flexShrink: 0,
            background: '#181818',
            fontSize: 'var(--font-size)',
            padding: '.6em',
            display: 'flex',
            justifyContent: 'space-around'
        }}>
            <CustomLink href={'https://t.me/rkbdigboard'}>Rboard Themes</CustomLink>
            <CustomLink href={'https://t.me/gboardthemes'}>Rboard Manager community</CustomLink>
            <CustomLink href={'https://t.me/rboardthemecommunity'}>Rboard community themes</CustomLink>
        </footer>
    ])
}