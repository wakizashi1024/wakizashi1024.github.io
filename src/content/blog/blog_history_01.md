---
title: 'Blog搭建紀錄'
description: 'Blog history'
pubDate: '2024/03/20 00:00:00'
# updatedDate: ''
# heroImage: ''
author: 'wakizashi1024'
tags:
  - blog
  - astro
---
## History

- 2024/03/20 First Version

## 本Blog的前世今生

一直想做一個Blog，最好是簡單易用且免費。傳統的技術有Wordpress/Hexo/Hugo等CMS，筆者也嘗試使用過，但覺得還是有點肥大且後期要達到一些自己想要的功能需要花費很大成本，索性自己搭一個簡易版本。一開始使用Next.js實現，基本的雛型也已經搭好了([next-blog-static](https://github.com/wakizashi1024/next-blog-static))，但總覺得有更簡單且更易擴充的實現方式。正好看到了使用island模式的框架[Astro](https://astro.build)，讓我可以從零開始像搭積木一樣一步步建立屬於自己的Blog。本篇記錄了這個Blog的搭建過程，供想要搭建可高度客製化的朋友們參考。(只會紀錄重點部分)

## 前置作業

首先當然是學習Astro怎麼使用啦，筆者的話建議從官網文件 `Start Here`、 `Core Concepts`及 `Tutorial`看過並實作一次。`Tutorial`的部分會教你如何從空專案開始搭建一個簡易的Blog，藉由課程實作來讓讀者熟悉該框架的一些基本概念，在實作後可使用該專案來擴展自己的Blog。

## 搭建項目

```bash
pnpm create astro@latest
dir   Where should we create your new project?
        ./astro-blog

tmpl   How would you like to start your new project?
        Use blog template

    ts   Do you plan to write TypeScript?
        Yes

use   How strict should TypeScript be?
        Strict

deps   Install dependencies?
        Yes

git   Initialize a new git repository?
        Yes
```

這裡筆者沒有使用完成 `Tutorial`後的專案來製作Blog(搭建時選擇空專案)，而是使用Blog Template。主要理由是在課程中使用的是Javascript且筆者想比較Template和教學專案的內容差異

## 加入暗黑模式切換

- global.css

  ```css
  :root {
      --accent: #2337ff;
      --accent-dark: #000d8a;
      --black: 15, 18, 25;
      --white: 189, 189, 189;
      --gray: 96, 115, 159;
      --gray-light: 229, 233, 240;
      --gray-dark: 34, 41, 57;
      --gray-gradient: rgba(var(--gray-light), 50%), #fff;
      --box-shadow: 0 2px 6px rgba(var(--gray), 25%), 0 8px 24px rgba(var(--gray), 33%),
          0 16px 32px rgba(var(--gray), 33%);
      0 16px 32px rgba(var(--gray), 33%);
  }

  [data-theme="light"] {
      --bg-color: linear-gradient(var(--gray-gradient)) no-repeat;
      --font-color: rgba(var(--gray-dark));
      --code-color: rgba(var(--gray-dark));
      --img-bg-color: rgba(255, 255, 255);
  }

  [data-theme="dark"] {
      --bg-color: rgba(var(--black));
      --font-color: rgba(var(--white));
      --code-color: rgba(var(--gray-dark));
  }

  [data-theme="dark"] {
      --code-color: rgba(var(--gray-dark));
  }

  body {
      font-family: 'Atkinson', sans-serif;
      margin: 0;
      padding: 0;
      text-align: left;
      background: linear-gradient(var(--gray-gradient)) no-repeat;
      background: var(--bg-color);
      background-size: 100% 600px;
      word-wrap: break-word;
      overflow-wrap: break-word;
      color: var(--font-color);
      font-size: 20px;
      line-height: 1.7;
  }

  main {
      width: 720px;
      max-width: calc(100% - 2em);
      margin: auto;
      padding: 3em 1em;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
      margin: 0 0 0.5rem 0;
      color: rgb(var(--font-color));
      line-height: 1.2;
  }
  ```
- pages/index.astro

  ```astro
  <style>
      .title {
          margin: 0;
          color: var(--font-color);
          line-height: 1;
      }
  </style>
  ```
- components/ThemeIcon.astro

  ```astro
  ---
  ---

  <button id="theme-toggle">
      <svg width="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path class="sun" fill-rule="evenodd" d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zm0 1.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm12-7a.8.8 0 0 1-.8.8h-2.4a.8.8 0 0 1 0-1.6h2.4a.8.8 0 0 1 .8.8zM4 12a.8.8 0 0 1-.8.8H.8a.8.8 0 0 1 0-1.6h2.5a.8.8 0 0 1 .8.8zm16.5-8.5a.8.8 0 0 1 0 1l-1.8 1.8a.8.8 0 0 1-1-1l1.7-1.8a.8.8 0 0 1 1 0zM6.3 17.7a.8.8 0 0 1 0 1l-1.7 1.8a.8.8 0 1 1-1-1l1.7-1.8a.8.8 0 0 1 1 0zM12 0a.8.8 0 0 1 .8.8v2.5a.8.8 0 0 1-1.6 0V.8A.8.8 0 0 1 12 0zm0 20a.8.8 0 0 1 .8.8v2.4a.8.8 0 0 1-1.6 0v-2.4a.8.8 0 0 1 .8-.8zM3.5 3.5a.8.8 0 0 1 1 0l1.8 1.8a.8.8 0 1 1-1 1L3.5 4.6a.8.8 0 0 1 0-1zm14.2 14.2a.8.8 0 0 1 1 0l1.8 1.7a.8.8 0 0 1-1 1l-1.8-1.7a.8.8 0 0 1 0-1z"/>
          <path class="moon" fill-rule="evenodd" d="M16.5 6A10.5 10.5 0 0 1 4.7 16.4 8.5 8.5 0 1 0 16.4 4.7l.1 1.3zm-1.7-2a9 9 0 0 1 .2 2 9 9 0 0 1-11 8.8 9.4 9.4 0 0 1-.8-.3c-.4 0-.8.3-.7.7a10 10 0 0 0 .3.8 10 10 0 0 0 9.2 6 10 10 0 0 0 4-19.2 9.7 9.7 0 0 0-.9-.3c-.3-.1-.7.3-.6.7a9 9 0 0 1 .3.8z"/>
      </svg>
  </button>

  <style>
      #theme-toggle {
          border: 0;
          background: none;
      }

      .sun { fill: black; }
      .moon { fill: transparent; }

      :global([data-theme="dark"]) .sun { fill: transparent; }
      :global([data-theme="dark"]) .moon { fill: white; }
  </style>

  <script is:inline>
      const getTheme = () => {
          if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
              return localStorage.getItem('theme');
          }

          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
              return 'dark';
          }

          return 'light';
      }

      const theme = getTheme();

      if (theme === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
      } else {
          document.documentElement.setAttribute('data-theme', 'dark');
      }

      window.localStorage.setItem('theme', theme);

      const handleToggleClick = () => {
          const newTheme = getTheme() === 'light' ? 'dark' : 'light';
          const element = document.documentElement;
          element.setAttribute('data-theme', newTheme);

          localStorage.setItem("theme", newTheme);
      }

      document.getElementById("theme-toggle").addEventListener("click", handleToggleClick);
  </script>
  ```
- components/Header.astro

  ```astro
  ---
  import HeaderLink from './HeaderLink.astro';
  import ThemeIcon from './ThemeIcon.astro';
  import { SITE_TITLE } from '../consts';
  ---

  <header>
      <nav>
          <div class="header-left">
              <h2><a href="/">{SITE_TITLE}</a></h2>
          </div>

          <div class="header-middle">
              <div class="internal-links">
                  <HeaderLink href="/">Home</HeaderLink>
                  <HeaderLink href="/blog">Blog</HeaderLink>
                  <HeaderLink href="/about">About</HeaderLink>
              </div>
          </div>

          <div class="header-right">
              <ThemeIcon />
              <div class="social-links">
                  <a href="https://github.com/wakizashi1024" target="_blank">
                      <span class="sr-only">Go to my GitHub repo</span>
                      <svg viewBox="0 0 16 16" aria-hidden="true" width="32" height="32"
                          ><path
                              fill="currentColor"
                              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                          ></path></svg
                      >
                  </a>
              </div>
          </div>
      </nav>
  </header>
  <style>
      header {
          margin: 0;
          padding: 0 1em;
          background: white;
          box-shadow: 0 2px 8px rgba(var(--black), 5%);
      }

      :global([data-theme="dark"])
      header {
          background: var(--black);
      }

      .header-left {
          display: flex;
      }

      .header-middle {
          display: flex;
      }

      .header-right {
          display: flex;
      }

      h2 {
          margin: 0;
          font-size: 1em;
      }

      h2 a,
      h2 a.active {
          text-decoration: none;
      }

      nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
      }

      nav a {
          padding: 1em 0.5em;
          color: var(--black);
          border-bottom: 4px solid transparent;
          text-decoration: none;
      }

      nav a.active {
          text-decoration: none;
          border-bottom-color: var(--accent);
      }

      .social-links,
      .social-links a {
          display: flex;
      }

      @media (max-width: 720px) {
          .social-links {
              display: none;
          }
      }
  </style>
  ```
- components/Footer.astro

  ```astro
  <style>
      footer {
          padding: 2em 1em 6em 1em;
          background: linear-gradient(var(--gray-gradient)) no-repeat;
          color: rgb(var(--gray));
          background: var(--bg-color);
          color: var(--font-color);
          text-align: center;
      }
  </style>
  ```

## 加入RWD選單折疊(Hambuger)

- components/Hamburger.astro

  ```astro
  ---
  ---
  <style>
      .hamburger {
          padding: 12px 12px;
          cursor: pointer;
      }

      .hamburger .line {
          display: block;
          width: 40px;
          height: 5px;
          margin: 10px 0;
          background-color: var(--font-color);
      }
  </style>

  <div class="hamburger">
      <span class="line"></span>
      <span class="line"></span>
      <span class="line"></span>
  </div>
  ```
- components/Header.astro

  ```astro
  ---
  import ThemeIcon from './ThemeIcon.astro';
  import { SITE_TITLE } from '../consts';
  import Hamburger from './Hamburger.astro';
  import Navigation from './Navigation.astro';
  ---

  <header>
      <div class="header-top">
          <Hamburger />

          <h2 class="logo"><a href="/">{SITE_TITLE}</a></h2>

          <div class="nav-desktop">
              <Navigation />
          </div>

          <div class="actions">
              <ThemeIcon />
              <div class="social-links">
                  <a href="https://github.com/wakizashi1024" target="_blank">
                      <span class="sr-only">Go to my GitHub repo</span>
                      <svg viewBox="0 0 16 16" aria-hidden="true" width="32" height="32"
                          ><path
                              fill="currentColor"
                              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                          ></path></svg
                      >
                  </a>
              </div>
          </div>
      </div>

      <div class="nav-mobile">
          <Navigation />
      </div>
  </header>

  <script>
      import "../scripts/menu.js";
  </script>

  <style>
      header {
          margin: 0;
          padding: 0 1em;
          background: white;
          box-shadow: 0 2px 8px rgba(var(--black), 5%);
      }

      :global([data-theme="dark"])
      header {
          background: var(--black);
      }

      .logo, .actions {
          width: 250px;
      }

      .header-top .actions {
          display: flex;
          justify-content: flex-end;
      }

      h2 {
          margin: 0;
          font-size: 1em;
      }

      h2 a,
      h2 a.active {
          text-decoration: none;
      }

      .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
      }

      .header-top a {
          padding: 1em 0.5em;
          color: var(--black);
          border-bottom: 4px solid transparent;
          text-decoration: none;
      }

      .header-top a.active {
          text-decoration: none;
          border-bottom-color: var(--accent);
      }

      .social-links,
      .social-links a {
          display: flex;
      }
  </style>
  ```
- components/Navigation.astro

  ```astro
  ---
  import HeaderLink from './HeaderLink.astro';
  ---

  <style>
      a {
          padding: 1em 0.5em;
          color: var(--black);
          border-bottom: 4px solid transparent;
          text-decoration: none;
      }

      a.active {
          text-decoration: none;
          border-bottom-color: var(--accent);
      }

      @media (max-width: 720px) {
          a.active {
              border-bottom-color: transparent;
          }
      }
  </style>
  <nav>
      <div class="nav-links">
          <HeaderLink href="/">Home</HeaderLink>
          <HeaderLink href="/blog">Blog</HeaderLink>
          <HeaderLink href="/about">About</HeaderLink>
      </div>
  </nav>
  ```
- scripts/menu.js

  ```javascript
  document.querySelector('.hamburger').addEventListener('click', () => {
      console.log(document.querySelector('.nav-links'))
      document.querySelector('.nav-mobile .nav-links').classList.toggle('expanded');
  });
  ```
- global.css

  ```css
  @media (max-width: 720px) {	
      .nav-desktop {
          display: none;
      }

      .logo {
          flex: 1;
          text-align: center;
      }

      .actions {
          width: auto;
      }

      nav {
          display: block;
          position: static;
          width: auto;
          background: none;
      }

      .nav-links {
          display: none;
          flex-direction: column;
          text-align: center;
      }

      .nav-links a {
          display: inline-block;
          padding: 15px 20px;
      }

      .social-links {
          display: none;
      }
  }

  @media (min-width: 720px) {
      .hamburger {
          display: none;
      }

      .nav-mobile {
          display: none;
      }
  }

  .expanded {
      display: flex;
  }
  ```

## 加入標籤分類

- content/config.ts

  ```typescript
  const blog = defineCollection({
      type: 'content',
      // Type-check frontmatter using a schema
      schema: z.object({
          title: z.string(),
          description: z.string(),
          // Transform string to Date object
          pubDate: z.coerce.date(),
          updatedDate: z.coerce.date().optional(),
          heroImage: z.string().optional(),
          tags: z.optional(z.array(z.string())),
      }),
  });
  ```
- layouts/BlogPost.astro

  ```typescript
  ---
  const { title, description, pubDate, updatedDate, heroImage, tags } = Astro.props;
  ---

  <div class="tags">
      {tags.map((tag) => <a href={`/tags/${tag}`}>{tag}</a>)}
  </div>
  ```
- pages/tags/[tag].astro

  ```astro
  ---
  import { getCollection } from 'astro:content';
  import BaseLayout from '../../layouts/BaseLayout.astro';
  export async function getStaticPaths() {
      const allPosts = await getCollection("blog");
      const uniqueTags = [...new Set(allPosts.map((post) => post.data.tags).flat())] as string[];
      return uniqueTags.map((tag: string) => {
          const filteredPosts = allPosts.filter((post) => post.data.tags?.includes(tag))
          filteredPosts.sort((a, b) => a.data.pubDate - b.data.pubDate);
          // console.log(filteredPosts)
          return {
              params: { tag },
              props: { posts: filteredPosts },
          };
      });
  }
  const { tag } = Astro.params;
  const { posts } = Astro.props;
  ---

  <style>
  main h2:first-child {
      text-align: center;
  }
  </style>

  <BaseLayout title={tag}>
  <main>
      <h2>Posts tagged with {tag}</h2>
      <ul>
      {posts.map((post) => (
          <li><a href={`/blog/${post.slug}/`}>{post.data.title}</a></li>
      ))}
      </ul>
  </main>

  </BaseLayout>
  ```
- pages/tags/index.astro

  ```astro
  ---
  import BaseLayout from "../../layouts/BaseLayout.astro";
  import { getCollection } from "astro:content";
  const allPosts = await getCollection('blog');
  const tags = [...new Set(allPosts.map((post) => post.data.tags).flat())];
  const pageTitle = "Tag Index";
  ---
  <style>
      a {
          color: #00539f;
      }

      .tags {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
      }

      .tag {
          margin: 0.25em;
          border: dotted 1px #a1a1a1;
          border-radius: .5em;
          padding: .5em 1em;
          font-size: 1.15em;
          background-color: #f8fcfd;
      }
  </style>

  <BaseLayout title={pageTitle}>
      <main>
          <div class="tags">
              {tags.map((tag) => <p class="tag"><a href={`/tags/${tag}`}>{tag}</a></p>)}
          </div>
      </main>
  </BaseLayout>
  ```

## 參考內容

- [Build a hamburger component](https://docs.astro.build/zh-tw/tutorial/3-components/4/#build-a-hamburger-component)
- [Install Astro with the Automatic CLI](https://docs.astro.build/en/install/auto/)
- [Add and style a theme toggle icon](https://docs.astro.build/zh-tw/tutorial/6-islands/2/#add-and-style-a-theme-toggle-icon)
- [Build a hamburger component](https://docs.astro.build/zh-tw/tutorial/3-components/4/#build-a-hamburger-component)
- [Generate tag pages](https://docs.astro.build/zh-tw/tutorial/5-astro-api/2/)
