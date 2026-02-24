// .vitepress/config.mts
import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..') // 项目根目录

// 定义侧边栏项的类型（支持嵌套）
interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
  collapsed?: boolean
}

// 解析Markdown文件，获取Frontmatter中的title和order
function parseFrontmatter(filePath: string): { title: string | null; order: number | null } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(content)
    return {
      title: data.title || null,
      order: typeof data.order === 'number' ? data.order : null
    }
  } catch (error) {
    return { title: null, order: null }
  }
}

// 格式化文件名为标题
function formatFileNameToTitle(fileName: string): string {
  return fileName
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// 递归构建侧边栏树
function buildSidebarTree(dir: string, basePath: string = '', lang: string = 'en'): SidebarItem[] {
  const items: SidebarItem[] = [];
  const dirItems: { path: string; item: SidebarItem }[] = []; // 用于存储目录项，稍后排序
  
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  // 首先检查当前目录是否有index.md，用于决定目录标题
  const indexFile = entries.find(e => !e.isDirectory() && e.name === 'index.md');
  let dirTitle: string | null = null;
  let dirOrder: number | null = null;
  
  if (indexFile) {
    const indexPath = path.join(dir, indexFile.name);
    const { title, order } = parseFrontmatter(indexPath);
    dirTitle = title;
    dirOrder = order;
  }

  // 处理所有子目录（递归）
  const subDirs = entries.filter(e => e.isDirectory());
  for (const subDir of subDirs) {
    const subDirPath = path.join(dir, subDir.name);
    const subDirRelativePath = basePath ? path.join(basePath, subDir.name) : subDir.name;
    
    // 递归构建子目录的侧边栏
    const subItems = buildSidebarTree(subDirPath, subDirRelativePath, lang);
    
    if (subItems.length > 0) {
      // 检查子目录是否有index.md来确定标题
      const subDirIndexPath = path.join(subDirPath, 'index.md');
      let subDirTitle = formatFileNameToTitle(subDir.name); // 默认用目录名
      let subDirOrder = 999;
      
      if (fs.existsSync(subDirIndexPath)) {
        const { title, order } = parseFrontmatter(subDirIndexPath);
        if (title) subDirTitle = title;
        if (order !== null) subDirOrder = order;
      }
      
      dirItems.push({
        path: subDir.name,
        item: {
          text: subDirTitle,
          items: subItems,
          collapsed: true, // 默认折叠
          // ❌ 移除link属性，这样点击标题时只展开/折叠，不跳转
        }
      });
    }
  }

  // 处理当前目录下的所有非index.md文件
  const files = entries.filter(e => 
    !e.isDirectory() && 
    e.name.endsWith('.md') && 
    e.name !== 'index.md'
  );

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    const fileName = file.name.replace(/\.md$/, '');
    const { title, order } = parseFrontmatter(filePath);
    
    const link = `/${lang}/api/${basePath ? basePath + '/' : ''}${fileName}`;
    
    dirItems.push({
      path: fileName,
      item: {
        text: title || formatFileNameToTitle(fileName),
        link: link  // 只有普通文件才有link，可以跳转
      }
    });
  }

  // 按order和名称排序所有项
  dirItems.sort((a, b) => {
    // 获取每个项的order（如果是目录且有index.md，则使用目录的order）
    let orderA = 999;
    let orderB = 999;
    
    // 如果是目录项，尝试从index.md获取order
    if (a.item.items) {
      const indexPath = path.join(dir, a.path, 'index.md');
      if (fs.existsSync(indexPath)) {
        const { order } = parseFrontmatter(indexPath);
        if (order !== null) orderA = order;
      }
    } else {
      // 如果是文件，从文件本身获取order
      const filePath = path.join(dir, a.path + '.md');
      if (fs.existsSync(filePath)) {
        const { order } = parseFrontmatter(filePath);
        if (order !== null) orderA = order;
      }
    }
    
    if (b.item.items) {
      const indexPath = path.join(dir, b.path, 'index.md');
      if (fs.existsSync(indexPath)) {
        const { order } = parseFrontmatter(indexPath);
        if (order !== null) orderB = order;
      }
    } else {
      const filePath = path.join(dir, b.path + '.md');
      if (fs.existsSync(filePath)) {
        const { order } = parseFrontmatter(filePath);
        if (order !== null) orderB = order;
      }
    }
    
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return a.path.localeCompare(b.path);
  });

  return dirItems.map(item => item.item);
}

// 生成侧边栏配置
function generateSidebar(lang: string = 'en'): SidebarItem[] {
  const apiDir = path.resolve(projectRoot, lang, 'api');
  
  console.log(`\n=== 生成 [${lang}] 侧边栏树 ===`);
  console.log(`API目录: ${apiDir}`);

  if (!fs.existsSync(apiDir)) {
    console.warn(`⚠️ 目录不存在: ${apiDir}`);
    return [];
  }

  // 检查根目录是否有index.md
  const rootIndexPath = path.join(apiDir, 'index.md');
  let rootTitle = lang === 'zh' ? 'API 参考' : 'API Reference';
  
  if (fs.existsSync(rootIndexPath)) {
    const { title } = parseFrontmatter(rootIndexPath);
    if (title) rootTitle = title;
  }

  // 构建侧边栏树
  const items = buildSidebarTree(apiDir, '', lang);
  
  console.log(`✅ 生成了 ${items.length} 个顶级侧边栏项目`);
  
  // 返回带根节点的侧边栏
  return [{
    text: rootTitle,
    items: items,
    collapsed: false, // 根节点默认展开
    // 根节点也没有link，只用于展开/折叠
  }];
}

export default defineConfig({
  base: '/api-docs/',
  title: '双语 API 文档',
  
  // 语言配置
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'API Documentation',
      description: 'Bilingual API Docs with VitePress',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'API', link: '/en/api/' }
        ]
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'API 文档',
      description: '使用 VitePress 构建的双语文档',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: 'API', link: '/zh/api/' }
        ]
      }
    }
  },
  
  themeConfig: {
    langMenuLabel: 'Language',
    
    // 侧边栏配置
    sidebar: {
      '/en/': generateSidebar('en'),
      '/zh/': generateSidebar('zh')
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-repo' }
    ]
  }
})