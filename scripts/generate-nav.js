import fs from 'node:fs'
import path from 'node:path'

const CONTENT_DIR = path.resolve(process.cwd(), 'content')
const PREFIX_PATTERN = /^(\d+)-(.+)$/

function isHiddenEntry(name) {
  return name.startsWith('.')
}

function parsePrefix(name) {
  const match = name.match(PREFIX_PATTERN)

  if (!match) {
    return {
      order: null,
      cleanName: name
    }
  }

  return {
    order: Number.parseInt(match[1], 10),
    cleanName: match[2]
  }
}

function stripMarkdownExtension(name) {
  return name.replace(/\.md$/i, '')
}

function getDisplayName(name) {
  return parsePrefix(stripMarkdownExtension(name)).cleanName
}

function compareEntries(left, right) {
  const leftPrefix = parsePrefix(stripMarkdownExtension(left.name))
  const rightPrefix = parsePrefix(stripMarkdownExtension(right.name))

  if (leftPrefix.order !== null && rightPrefix.order !== null) {
    if (leftPrefix.order !== rightPrefix.order) {
      return leftPrefix.order - rightPrefix.order
    }
  } else if (leftPrefix.order !== null) {
    return -1
  } else if (rightPrefix.order !== null) {
    return 1
  }

  return stripMarkdownExtension(left.name).localeCompare(
    stripMarkdownExtension(right.name),
    'zh-Hans-CN',
    { numeric: true, sensitivity: 'base' }
  )
}

function createFileNode(name, relativePath) {
  return {
    type: 'file',
    text: getDisplayName(name),
    link: `/${relativePath.replace(/\.md$/i, '')}`
  }
}

function createDirectoryNode(name, relativePath, items) {
  return {
    type: 'directory',
    text: getDisplayName(name),
    basePath: `/${relativePath}/`,
    items
  }
}

function scanDirectory(absoluteDir, relativeDir = '') {
  const entries = fs
    .readdirSync(absoluteDir, { withFileTypes: true })
    .filter((entry) => !isHiddenEntry(entry.name))
    .filter((entry) => entry.name !== '.vitepress')
    .filter((entry) => !(relativeDir === '' && entry.name === 'index.md'))
    .filter((entry) => entry.isDirectory() || entry.name.endsWith('.md'))
    .sort(compareEntries)

  const nodes = []

  for (const entry of entries) {
    const nextRelativePath = relativeDir
      ? path.posix.join(relativeDir, entry.name)
      : entry.name
    const nextAbsolutePath = path.join(absoluteDir, entry.name)

    if (entry.isDirectory()) {
      const children = scanDirectory(nextAbsolutePath, nextRelativePath)

      if (children.length > 0) {
        nodes.push(createDirectoryNode(entry.name, nextRelativePath, children))
      }

      continue
    }

    nodes.push(createFileNode(entry.name, nextRelativePath))
  }

  return nodes
}

function toNavItems(nodes) {
  return nodes.map((node) => {
    if (node.type === 'file') {
      return {
        text: node.text,
        link: node.link
      }
    }

    return {
      text: node.text,
      items: toNavItems(node.items)
    }
  })
}

function toSidebarItems(nodes) {
  return nodes.map((node) => {
    if (node.type === 'file') {
      return {
        text: node.text,
        link: node.link
      }
    }

    return {
      text: node.text,
      collapsed: false,
      items: toSidebarItems(node.items)
    }
  })
}

function buildSidebarMap(nodes, sidebar = {}) {
  for (const node of nodes) {
    if (node.type !== 'directory') {
      continue
    }

    sidebar[node.basePath] = toSidebarItems(node.items)
    buildSidebarMap(node.items, sidebar)
  }

  return sidebar
}

export function generateSiteNavigation() {
  const contentTree = scanDirectory(CONTENT_DIR)

  return {
    nav: [
      { text: '首页', link: '/' },
      ...toNavItems(contentTree)
    ],
    sidebar: buildSidebarMap(contentTree)
  }
}

export default generateSiteNavigation
