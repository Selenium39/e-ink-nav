# nav.e-ink.me — 电子书导航站方案草案

状态：Alex 2026-11-17 已拍板做（轻量版）。约束：不复用 fwfw；无投稿入口（投稿走 Alex 邮箱）；独立仓库 `e-ink-nav`（Alex 自建）。
托管：Cloudflare Pages（Alex 2026-11-17 已确认；与 iloveepub/gpxconverter 同模式，零服务器维护）。
投稿邮箱：openminimax@gmail.com（Alex 2026-11-17 已确认）。

## UI 风格（纸书墨水风 — Alex 2026-11-17 已确认）
- 基调：纸白底 #FAF9F6 + 墨黑字 #1A1A1A + 发丝线边框；深色模式纯黑底 #0A0A0A（与 wiki 的黑白 theme-color 一脉）。强调色只用一个墨蓝点缀链接/CTA，其余全黑白灰。
- 字体：标题衬线（Noto Serif SC / Georgia）出书卷气，正文无衬线保可读。
- 卡片像图书馆目录卡：favicon + 名称 + 一句话简介 + 元数据小标签（格式/语言/价格模型）。
- 布局：顶部家族导航（与 e-ink.me / news / wiki / games 互链）+ 搜索 + 粘性分类筛选条 + 分类分区卡片网格。
- 硬约束：能在墨水屏浏览器上流畅打开 — 高对比、无重动画、少 JS（承接 news 的定位，也是差异化）。
- 不做：彩色 logo 墙、大图 hero、渐变（fwfw 路线，又重又不贴品牌）。

## 定位
e-ink 家族的「发现层」：找书、借书、买书、读书工具的一站式目录。
与家族分工：e-ink.me 做书（工具）/ news 读新闻 / wiki 查知识 / games 玩 / nav 找资源。
与 fwfw 分工：fwfw 全品类，nav 只做电子书垂直。

## 红线
- 只收合法资源：公版、开放获取、正版商城、正规图书馆、开源/正规工具。盗版书库一律不收（子域名与主站共用根域名声誉）。
- 投稿只走邮箱，站内不做投稿系统、不做用户系统、不做评论。

## 技术形态（轻量）
- 纯静态站，构建产物部署 Cloudflare Pages。
- 全部条目维护在一个数据文件里（YAML/JSON，随仓库走）：更新 = 改数据文件 + push，自动构建上线。无 CMS、无后端、无数据库。
- 页面：首页（分类 + 精选 + 按格式/语言/价格筛选）+ 分类页（每页配一段真实介绍文案，SEO 主力）。v1 不做单条目详情页。
- 语言：v1 英文 + 中文（架构预留 i18n 扩展）。
- 页脚放投稿邮箱（mailto），文案如「推荐收录 / 勘误请邮件联系」。

## 条目数据字段
name / url / 一句话简介（中英）/ 分类 / 支持格式[] / 语言[] / 价格模型（免费/免费+付费/订阅/付费）/ 是否需注册 / 地区备注 / 精选标记

## 分类体系（8 类）与首批种子名单（约 60 条，全部合法来源）

### 1. 免费电子书库（公版 / 开放获取）
Project Gutenberg、Standard Ebooks、Internet Archive、Open Library、ManyBooks、Wikisource 维基文库、DOAB、OAPEN、HathiTrust、OpenStax、中国哲学书电子化计划（ctext.org）、书格（shuge.org）

### 2. 电子书商城与订阅
Amazon Kindle Store、Kobo Store、Google Play Books、Apple Books、微信读书、豆瓣阅读、京东读书

### 3. 图书馆借阅
Libby / OverDrive、Hoopla、中国国家数字图书馆

### 4. 阅读 App 与阅读器软件
KOReader、Calibre、静读天下 Moon+ Reader、ReadEra、FBReader、Legado（开源阅读）、Thorium Reader、Kindle App、Kobo App、微信读书 App

### 5. 电子书工具
e-ink.me（自家，格式转换）、iloveepub.com（自家，免费工具集）、Sigil（EPUB 编辑器）、Pandoc

### 6. 有声书
LibriVox、Audible、喜马拉雅、Storytel

### 7. 社区与资讯
MobileRead 论坛、Goodreads、豆瓣读书、Reddit r/ereader、书伴 BookFere、TeleRead；家族内链：news.e-ink.me、wiki.e-ink.me、games.e-ink.me

### 8. 词典与辅助工具
汉典、Wiktionary、WordReference

## 导流设计（nav → e-ink.me）
- 每个分类页尾部放与该分类最相关的 e-ink 工具 CTA（如书库类 → 网页转 EPUB；工具类 → 转换器）。
- 条目格式元数据是核心卖点：「只有 MOBI？→ 一键转 EPUB」式衔接文案。
- 自家条目可精选置顶，但数量克制（工具类 2 个），避免整站像自卖自夸。

## SEO 要点
- 分类页 slug 用搜索词：/free-ebooks、/ebook-stores、/library-borrowing、/reading-apps、/ebook-tools、/audiobooks、/communities、/dictionaries（中英双语路径或语言前缀）。
- 每分类页 300+ 字原创介绍（不是裸链接列表），条目简介各 1–2 句原创。
- sitemap + 结构化数据（ItemList）；与 wiki/news/games/e-ink 主站页脚互链成家族网。

## 维护
- 死链检查自动化（月度脚本扫一遍数据文件里的 URL）。
- 新增条目流程：Alex 收到邮件投稿 → 转给 Muse 核实合法性与信息 → 改数据文件 push 上线。

## 待 Alex 确认
1. 投稿邮箱是否用 openminimax@gmail.com（e-ink 对外联系邮箱）？
2. 托管用 Cloudflare Pages 是否可以？
3. 仓库建好后把地址给我，即可按此方案派 coder 开发。
