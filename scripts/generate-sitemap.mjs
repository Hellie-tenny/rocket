// Regenerates public/sitemap.xml, including every currently published blog
// post pulled live from Firestore, alongside the fixed static pages.
//
// Run manually whenever you publish/unpublish posts:
//   npm run generate-sitemap
//
// Uses the same public Firebase client config as the app (safe — these are
// public identifiers, not secrets) and only reads published posts, which
// are already publicly readable per firestore.rules.

import { config } from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { writeFileSync } from "fs";

config({ path: ".env.local" });

const SITE_URL = "https://rocket-technologies.web.app";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const STATIC_PAGES = [
  { path: "/", priority: "1.0" },
  { path: "/about", priority: "0.7" },
  { path: "/projects", priority: "0.7" },
  { path: "/blog", priority: "0.9" },
  { path: "/contact", priority: "0.5" },
  { path: "/privacy", priority: "0.3" },
];

async function main() {
  if (!firebaseConfig.projectId) {
    console.error(
      "Missing Firebase config — make sure .env.local exists with VITE_FIREBASE_* values."
    );
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const postsQuery = query(collection(db, "posts"), where("published", "==", true));
  const snapshot = await getDocs(postsQuery);

  const postUrls = snapshot.docs.map((doc) => {
    const data = doc.data();
    const lastmod = data.updatedAt?.toDate?.().toISOString().split("T")[0];
    return { path: `/blog/${data.slug}`, priority: "0.8", lastmod };
  });

  const allUrls = [...STATIC_PAGES, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.path}</loc>
    <priority>${u.priority}</priority>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>
`;

  writeFileSync("public/sitemap.xml", xml);
  console.log(`Sitemap written with ${allUrls.length} URLs (${postUrls.length} posts).`);
}

main().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});
