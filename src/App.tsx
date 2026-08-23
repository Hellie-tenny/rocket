import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./lib/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin routes are code-split out of the public bundle — public visitors
// (and search engines) never download the editor, Tiptap, or admin UI.
const Login = lazy(() => import("./admin/pages/Login"));
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const Posts = lazy(() => import("./admin/pages/Posts"));
const PostEditor = lazy(() => import("./admin/pages/PostEditor"));
const Analytics = lazy(() => import("./admin/pages/Analytics"));
const AdminLayout = lazy(() => import("./admin/components/AdminLayout"));
const ProtectedRoute = lazy(() => import("./admin/components/ProtectedRoute"));

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <p className="text-sm text-ink-500">Loading…</p>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route
              path="/admin/login"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <Login />
                </Suspense>
              }
            />

            <Route
              path="/admin"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                </Suspense>
              }
            >
              <Route
                index
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="posts"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <Posts />
                  </Suspense>
                }
              />
              <Route
                path="posts/new"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <PostEditor />
                  </Suspense>
                }
              />
              <Route
                path="posts/:id/edit"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <PostEditor />
                  </Suspense>
                }
              />
              <Route
                path="analytics"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <Analytics />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
